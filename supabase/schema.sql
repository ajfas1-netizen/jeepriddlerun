-- ============================================================
-- MC PAL JEEP RIDDLE RUN - database schema
-- Run this once in Supabase Studio > SQL Editor > New query.
-- Then: Authentication > Sign In / Providers > enable "Anonymous".
-- Then: Storage > create buckets `photos` and `receipts`, both PUBLIC.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- teams ----------
create table if not exists public.teams (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid,                       -- anonymous auth uid of the phone that created it
  name              text not null check (char_length(name) between 2 and 40),
  duck_id           text not null default 'classic',
  rig_id            text not null default 'granite',
  join_code         text unique not null,       -- lets a second phone in the same Jeep join
  created_at        timestamptz not null default now()
);

-- ---------- checkins : one row per team per stop ----------
create table if not exists public.checkins (
  team_id     uuid not null references public.teams(id) on delete cascade,
  stop_id     text not null,
  flags       jsonb not null default '{}'::jsonb,   -- duck, posted, tagLocation, tagPal, hashtag, receipt
  spend       numeric(10,2) not null default 0 check (spend >= 0 and spend <= 100000),
  photo_url   text,
  receipt_url text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (team_id, stop_id)
);
create index if not exists checkins_team_idx on public.checkins(team_id);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists checkins_touch on public.checkins;
create trigger checkins_touch before update on public.checkins
  for each row execute function public.touch_updated_at();

-- ---------- stop pins : set from Organizer tools > Pin drop ----------
create table if not exists public.stop_pins (
  stop_id text primary key,
  lat     double precision not null,
  lng     double precision not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SCORING. Kept in the database so the leaderboard cannot be
-- edited from a phone. Change the numbers here and in
-- src/data/event.js together.
-- ============================================================
create or replace function public.tag_points(f jsonb) returns integer
language sql immutable as $$
  select coalesce((f->>'duck')::boolean::int,0)*3
       + coalesce((f->>'posted')::boolean::int,0)*3
       + coalesce((f->>'tagLocation')::boolean::int,0)*3
       + coalesce((f->>'tagPal')::boolean::int,0)*3
       + coalesce((f->>'hashtag')::boolean::int,0)*3
       + coalesce((f->>'receipt')::boolean::int,0)*3
$$;

create or replace view public.leaderboard as
select
  t.id                                            as team_id,
  t.name,
  t.duck_id,
  count(c.stop_id) filter (where c.photo_url is not null)::int as stops,
  coalesce(sum(c.spend),0)::int                   as spend,
  coalesce(sum(public.tag_points(c.flags)),0)::int as tag_points,
  coalesce(sum(c.spend),0)::int                   as spend_points,   -- dollar for dollar
  coalesce(sum(public.tag_points(c.flags)),0)::int
    + coalesce(sum(c.spend),0)::int                as total_points
from public.teams t
left join public.checkins c on c.team_id = t.id
group by t.id;

create or replace view public.submissions as
select c.stop_id, t.name as team, t.duck_id, c.flags, c.spend,
       c.photo_url, c.receipt_url, c.created_at
from public.checkins c join public.teams t on t.id = c.team_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- Everyone can read everything (the leaderboard is public by design).
-- A phone can only write the rig it owns. Nobody can delete.
-- ============================================================
alter table public.teams     enable row level security;
alter table public.checkins  enable row level security;
alter table public.stop_pins enable row level security;

drop policy if exists teams_read      on public.teams;
drop policy if exists teams_insert    on public.teams;
drop policy if exists teams_update    on public.teams;
create policy teams_read   on public.teams for select using (true);
create policy teams_insert on public.teams for insert with check (owner_id = auth.uid() or owner_id is null);
create policy teams_update on public.teams for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists checkins_read   on public.checkins;
drop policy if exists checkins_write  on public.checkins;
drop policy if exists checkins_update on public.checkins;
create policy checkins_read on public.checkins for select using (true);
create policy checkins_write on public.checkins for insert
  with check (exists (select 1 from public.teams t where t.id = team_id and (t.owner_id = auth.uid() or t.owner_id is null)));
create policy checkins_update on public.checkins for update
  using (exists (select 1 from public.teams t where t.id = team_id and (t.owner_id = auth.uid() or t.owner_id is null)));

drop policy if exists pins_read  on public.stop_pins;
drop policy if exists pins_write on public.stop_pins;
create policy pins_read  on public.stop_pins for select using (true);
create policy pins_write on public.stop_pins for all using (auth.uid() is not null) with check (auth.uid() is not null);

grant select on public.leaderboard, public.submissions to anon, authenticated;

-- ---------- realtime for the live leaderboard ----------
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.teams;

-- ============================================================
-- STORAGE POLICIES
-- Run after creating the `photos` and `receipts` buckets as PUBLIC.
-- ============================================================
drop policy if exists "rr read"  on storage.objects;
drop policy if exists "rr write" on storage.objects;
create policy "rr read"  on storage.objects for select
  using (bucket_id in ('photos','receipts'));
create policy "rr write" on storage.objects for insert
  with check (bucket_id in ('photos','receipts') and auth.uid() is not null);

-- ============================================================
-- No judging step. Standings are fully derived from tag points and
-- dollars spent, so the leaderboard is final the moment receipts are
-- verified at the closing ceremony.
-- ============================================================

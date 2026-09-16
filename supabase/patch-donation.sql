-- Adds the PAL pledge. Run once in the Supabase SQL Editor.
--
-- One rule: a dollar pledged to PAL is two points, with no ceiling. Rigs
-- pledge at the starting line, then give through Givebutter or hand cash
-- or a check to a volunteer at the finish.

alter table public.teams
  add column if not exists donation numeric(10,2) not null default 0
  check (donation >= 0 and donation <= 1000000);

-- Must agree line for line with src/lib/scoring.js.
-- Dropped first, not replaced. CREATE OR REPLACE VIEW refuses to move or
-- rename an existing column, and this adds donation ahead of tag_points.
drop view if exists public.leaderboard;
create view public.leaderboard as
select
  t.id                                            as team_id,
  t.name,
  t.duck_id,
  count(c.stop_id) filter (where c.photo_url is not null)::int as stops,
  coalesce(sum(c.spend),0)::int                   as spend,
  coalesce(t.donation,0)::int                     as donation,
  coalesce(sum(public.tag_points(c.flags)),0)::int as tag_points,
  coalesce(sum(c.spend),0)::int                   as spend_points,
  (coalesce(t.donation,0) * 2)::int               as give_points,
  (coalesce(sum(public.tag_points(c.flags)),0)
    + coalesce(sum(c.spend),0)
    + coalesce(t.donation,0) * 2)::int            as total_points
from public.teams t
left join public.checkins c on c.team_id = t.id
group by t.id, t.donation;

-- The finish table needs the pledge next to the claimed spend.
create or replace view public.submissions as
select c.stop_id, t.name as team, t.duck_id, c.flags, c.spend,
       c.photo_url, c.receipt_url, c.created_at,
       t.join_code, coalesce(t.donation,0)::int as donation
from public.checkins c join public.teams t on t.id = c.team_id;

select * from public.leaderboard limit 1;

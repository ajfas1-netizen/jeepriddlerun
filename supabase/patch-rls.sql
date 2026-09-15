-- Run this once in the Supabase SQL Editor against the live project.
-- Fixes a silent failure: a second phone joining by team code, or a phone
-- that lost its browser storage, has a different anonymous user id than the
-- one that created the team, so its check-ins were being rejected. The phone
-- still showed the photo; the leaderboard never got it.

drop policy if exists checkins_write  on public.checkins;
drop policy if exists checkins_update on public.checkins;
drop policy if exists teams_update    on public.teams;

create policy checkins_write on public.checkins for insert
  with check (auth.uid() is not null);

create policy checkins_update on public.checkins for update
  using (auth.uid() is not null) with check (auth.uid() is not null);

create policy teams_update on public.teams for update
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- Confirm the three policies now read "auth.uid() IS NOT NULL".
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('checkins','teams')
order by tablename, policyname;

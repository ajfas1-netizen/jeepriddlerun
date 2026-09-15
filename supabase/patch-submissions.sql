-- Adds join_code to the submissions view so the Rig check screen can find a
-- rig by the code on its phone. Run once in the Supabase SQL Editor.

create or replace view public.submissions as
select c.stop_id, t.name as team, t.duck_id, c.flags, c.spend,
       c.photo_url, c.receipt_url, c.created_at,
       t.join_code
from public.checkins c join public.teams t on t.id = c.team_id;

select * from public.submissions limit 1;

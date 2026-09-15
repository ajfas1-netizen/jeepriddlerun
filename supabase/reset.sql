-- ============================================================
-- RESET BEFORE THE EVENT
--
-- Wipes every rig and every check-in so the leaderboard starts empty
-- on Saturday morning. Run it in Supabase: SQL Editor > New query >
-- paste > Run.
--
-- Safe to run more than once. It does NOT touch the schema or any
-- stop pins you dropped.
--
-- Phones used for testing heal themselves. The app looks up its saved
-- rig by id on launch, gets a clean "no such row", and clears itself,
-- so testers land back on the sign-up screen with no action needed.
--
-- PHOTOS ARE NOT DELETED HERE. Supabase blocks direct deletes from
-- storage.objects ("Direct deletion from storage tables is not
-- allowed"), so uploaded photos have to go through the Storage page
-- in the dashboard: Storage > photos > select all > Delete. Leaving
-- them costs nothing but a little space, since nothing links to them
-- once the check-ins are gone.
-- ============================================================

-- check-ins first, though the foreign key would cascade anyway
delete from public.checkins;

-- every rig
delete from public.teams;

-- ---------- confirm it is clean ----------
select
  (select count(*) from public.teams)    as rigs,
  (select count(*) from public.checkins) as checkins;

-- ============================================================
-- RESET BEFORE THE EVENT
--
-- Wipes every rig, every check-in and every uploaded photo, so the
-- leaderboard starts empty on Saturday morning. Run it in Supabase:
-- SQL Editor > New query > paste > Run.
--
-- Safe to run more than once. It does NOT touch the schema, the
-- storage buckets themselves, or any stop pins you dropped.
--
-- Phones that were used for testing heal themselves. The app looks up
-- its saved rig by id on launch, finds nothing, and clears itself, so
-- testers land back on the sign-up screen with no action needed.
-- ============================================================

-- check-ins first, though the foreign key would cascade anyway
delete from public.checkins;

-- every rig
delete from public.teams;

-- every uploaded photo and receipt
delete from storage.objects where bucket_id in ('photos', 'receipts');

-- ---------- confirm it is clean ----------
select
  (select count(*) from public.teams)      as rigs,
  (select count(*) from public.checkins)   as checkins,
  (select count(*) from storage.objects
     where bucket_id in ('photos','receipts')) as uploaded_files;

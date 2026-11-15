-- Blended Family Devotional: Joy in Him journey migration
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- The app now has four journeys: 'mom', 'family', 'us', and the 30-day 'joy'
-- (Joy in Him / Gozo en El). This widens the journey check on all three tables
-- so Joy progress, favorites, and notes sync like the other journeys.
-- The app works fully without this (localStorage on the device); this only
-- enables cloud sync for the new journeys. Safe to run more than once.

alter table public.devotional_progress drop constraint if exists devotional_progress_journey_check;
alter table public.devotional_progress drop constraint if exists devotional_progress_journey_allowed;
alter table public.devotional_progress
  add constraint devotional_progress_journey_allowed
  check (journey in ('mom', 'family', 'us', 'joy'));

alter table public.devotional_favorites drop constraint if exists devotional_favorites_journey_check;
alter table public.devotional_favorites drop constraint if exists devotional_favorites_journey_allowed;
alter table public.devotional_favorites
  add constraint devotional_favorites_journey_allowed
  check (journey in ('mom', 'family', 'us', 'joy'));

alter table public.devotional_notes drop constraint if exists devotional_notes_journey_check;
alter table public.devotional_notes drop constraint if exists devotional_notes_journey_allowed;
alter table public.devotional_notes
  add constraint devotional_notes_journey_allowed
  check (journey in ('mom', 'family', 'us', 'joy'));

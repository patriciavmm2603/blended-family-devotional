-- Blended Family Devotional: journeys migration
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- The app now has two journeys: mom's personal reading ('mom') and family reading ('family').
-- This adds a "journey" column to all three tables so progress, favorites, and notes
-- are tracked separately per journey. Existing rows become mom's journey.
-- (Replaces the short-lived role column from migration-roles.sql, if you ran it.)

-- progress
alter table public.devotional_progress drop constraint if exists devotional_progress_pkey;
alter table public.devotional_progress drop column if exists role;
alter table public.devotional_progress
  add column if not exists journey text not null default 'mom'
  check (journey in ('mom', 'family'));
alter table public.devotional_progress
  add primary key (user_id, journey, day);

-- favorites
alter table public.devotional_favorites drop constraint if exists devotional_favorites_pkey;
alter table public.devotional_favorites
  add column if not exists journey text not null default 'mom'
  check (journey in ('mom', 'family'));
alter table public.devotional_favorites
  add primary key (user_id, journey, day);

-- notes
alter table public.devotional_notes drop constraint if exists devotional_notes_pkey;
alter table public.devotional_notes
  add column if not exists journey text not null default 'mom'
  check (journey in ('mom', 'family'));
alter table public.devotional_notes
  add primary key (user_id, journey, day);

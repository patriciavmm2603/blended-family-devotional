-- Blended Family Devotional: per-role progress migration
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Adds a "role" column (mom / dad / family) to devotional_progress so each
-- day can be marked complete separately for Mom, Dad, and Family reading.
-- Any checkmarks you already made become Mom's. Nothing else changes.

alter table public.devotional_progress
  add column if not exists role text not null default 'mom'
  check (role in ('mom', 'dad', 'family'));

alter table public.devotional_progress
  drop constraint if exists devotional_progress_pkey;

alter table public.devotional_progress
  add primary key (user_id, day, role);

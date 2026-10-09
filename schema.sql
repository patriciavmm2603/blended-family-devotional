-- Blended Family Devotional: Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- This creates three small tables for one user's progress, favorites, and private notes.
-- It does NOT touch any existing tables. Safe to run as-is.

create table if not exists public.devotional_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  day int not null check (day between 1 and 365),
  role text not null default 'mom' check (role in ('mom', 'dad', 'family')),
  completed_at timestamptz not null default now(),
  primary key (user_id, day, role)
);

create table if not exists public.devotional_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  day int not null check (day between 1 and 365),
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.devotional_notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  day int not null check (day between 1 and 365),
  note_text text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.devotional_progress enable row level security;
alter table public.devotional_favorites enable row level security;
alter table public.devotional_notes enable row level security;

-- Each signed-in user can only see and change their own rows.
drop policy if exists "own progress" on public.devotional_progress;
create policy "own progress" on public.devotional_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own favorites" on public.devotional_favorites;
create policy "own favorites" on public.devotional_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own notes" on public.devotional_notes;
create policy "own notes" on public.devotional_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

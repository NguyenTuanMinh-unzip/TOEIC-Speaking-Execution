-- ===========================================================================
-- Optional cloud schema (Supabase / Postgres).
--
-- The app ships local-first (localStorage + IndexedDB) so it works on Day 1
-- with zero setup. If you later want cross-device sync, run this schema and
-- reimplement src/lib/audio-db.ts + the persistence in src/lib/store.ts
-- against these tables + Supabase Storage. Signatures are designed to map 1:1.
--
-- Single-user app: rows are scoped to auth.uid(). Enable email magic-link auth.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- One row per program day (1..180) per user.
create table if not exists day_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  day          int  not null check (day between 1 and 180),
  date         date not null,
  pronunciation text not null default 'not_started',
  shadowing     text not null default 'not_started',
  speaking      text not null default 'not_started',
  toeic         text not null default 'not_started',
  completed     boolean not null default false,
  failed        boolean not null default false,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, day),
  constraint status_values check (
    pronunciation in ('not_started','in_progress','done') and
    shadowing     in ('not_started','in_progress','done') and
    speaking      in ('not_started','in_progress','done') and
    toeic         in ('not_started','in_progress','done')
  )
);

-- One row per saved audio clip. The blob itself lives in Supabase Storage
-- (bucket: 'recordings'); storage_path points to it.
create table if not exists recordings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  day          int  not null check (day between 1 and 180),
  topic        text not null,
  task_type    text not null check (task_type in ('pronunciation','shadowing','speaking','toeic')),
  sub_task     text,
  duration_ms  int  not null default 0,
  mime_type    text not null default 'audio/webm',
  storage_path text not null,
  created_at   timestamptz not null default now()
);

create index if not exists recordings_user_day_idx on recordings (user_id, day);

-- Row Level Security: a user can only see their own data.
alter table day_progress enable row level security;
alter table recordings   enable row level security;

create policy "own day_progress" on day_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own recordings" on recordings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket (create via dashboard or the line below in SQL editor):
-- insert into storage.buckets (id, name, public) values ('recordings','recordings', false);

-- Donations table: everyone who donated (email, name, amount).
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  amount_donated numeric not null check (amount_donated >= 0),
  created_at timestamptz not null default now()
);

-- Optional: enable RLS and allow anonymous insert (e.g. from your app or webhook).
-- Adjust policies if you use auth or only server-side inserts.

alter table public.donations enable row level security;

-- Allow insert without auth (for server-side API or anon key from your app).
create policy "Allow anonymous insert"
  on public.donations
  for insert
  with check (true);

-- Allow read for everyone (e.g. leaderboard). Tighten to authenticated only if needed.
create policy "Allow public read"
  on public.donations
  for select
  using (true);

-- Optional: no update/delete for anonymous.
-- create policy "No anon update" on public.donations for update using (false);
-- create policy "No anon delete" on public.donations for delete using (false);

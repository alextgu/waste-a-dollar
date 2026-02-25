-- Allow update so PATCH /api/donations/[id] can send updates to Supabase.
-- Run in SQL Editor if you already ran 001_create_donations.sql.

create policy "Allow anonymous update"
  on public.donations
  for update
  using (true)
  with check (true);

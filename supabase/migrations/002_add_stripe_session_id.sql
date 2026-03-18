-- Add Stripe session id for idempotent inserts from Checkout success.
-- Run after 001_create_donations.sql

alter table if exists public.donations
  add column if not exists stripe_session_id text;

create unique index if not exists donations_stripe_session_id_key
  on public.donations (stripe_session_id)
  where stripe_session_id is not null;


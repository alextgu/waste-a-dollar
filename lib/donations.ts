import type { Donation, DonationInsert } from "@/types/donation";
import { createClient } from "@/lib/supabase/server";

const TABLE = "donations";

/** Supabase returns this when .single() finds no row */
const NOT_FOUND_CODE = "PGRST116";

function isNotFoundError(err: unknown): boolean {
  return typeof (err as { code?: string })?.code === "string" && (err as { code: string }).code === NOT_FOUND_CODE;
}

export async function insertDonation(
  data: DonationInsert
): Promise<{ data: Donation | null; error: unknown }> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from(TABLE)
    .insert({
      email: data.email,
      name: data.name,
      amount_donated: data.amount_donated,
      stripe_session_id: data.stripe_session_id,
    })
    .select("id, email, name, amount_donated, stripe_session_id, created_at")
    .single();

  if (error) return { data: null, error };
  return { data: row as Donation, error: null };
}

export async function upsertDonationByStripeSession(
  data: Omit<DonationInsert, "stripe_session_id"> & { stripe_session_id: string }
): Promise<{ data: Donation | null; error: unknown }> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        email: data.email,
        name: data.name,
        amount_donated: data.amount_donated,
        stripe_session_id: data.stripe_session_id,
      },
      { onConflict: "stripe_session_id" }
    )
    .select("id, email, name, amount_donated, stripe_session_id, created_at")
    .single();

  if (error) return { data: null, error };
  return { data: row as Donation, error: null };
}

export type DonationResult = { data: Donation | null; error: unknown };
export type DonationsListResult = { data: Donation[] | null; error: unknown };

export function isDonationNotFound(result: { error: unknown }): boolean {
  return isNotFoundError(result.error);
}

export async function getDonations(): Promise<{
  data: Donation[] | null;
  error: unknown;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, email, name, amount_donated, stripe_session_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };
  return { data: (data ?? []) as Donation[], error: null };
}

export async function getDonationCount(): Promise<{
  count: number | null;
  error: unknown;
}> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true });

  if (error) return { count: null, error };
  return { count: typeof count === "number" ? count : 0, error: null };
}

export async function getDonationTotal(): Promise<{
  total: number | null;
  error: unknown;
}> {
  const supabase = await createClient();
  // PostgREST aggregate: returns [{ sum: number | null }]
  const { data, error } = await supabase
    .from(TABLE)
    .select("amount_donated.sum()");

  if (error) return { total: null, error };

  const row = Array.isArray(data) ? (data[0] as { sum?: unknown } | undefined) : undefined;
  const sum = row?.sum;
  return { total: typeof sum === "number" && Number.isFinite(sum) ? sum : 0, error: null };
}

export async function getLatestDonationCreatedAt(): Promise<{
  created_at: string | null;
  error: unknown;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) return { created_at: null, error };
  const row = Array.isArray(data) ? (data[0] as { created_at?: unknown } | undefined) : undefined;
  return { created_at: typeof row?.created_at === "string" ? row.created_at : null, error: null };
}

export async function getDonationById(
  id: string
): Promise<{ data: Donation | null; error: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, email, name, amount_donated, stripe_session_id, created_at")
    .eq("id", id)
    .single();

  if (error) return { data: null, error };
  return { data: data as Donation, error: null };
}

export type DonationUpdate = Partial<
  Pick<Donation, "email" | "name" | "amount_donated">
>;

export async function updateDonation(
  id: string,
  update: DonationUpdate
): Promise<{ data: Donation | null; error: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update(update)
    .eq("id", id)
    .select("id, email, name, amount_donated, stripe_session_id, created_at")
    .single();

  if (error) return { data: null, error };
  return { data: data as Donation, error: null };
}

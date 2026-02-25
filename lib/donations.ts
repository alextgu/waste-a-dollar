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
    })
    .select("id, email, name, amount_donated, created_at")
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
    .select("id, email, name, amount_donated, created_at")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };
  return { data: (data ?? []) as Donation[], error: null };
}

export async function getDonationById(
  id: string
): Promise<{ data: Donation | null; error: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, email, name, amount_donated, created_at")
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
    .select("id, email, name, amount_donated, created_at")
    .single();

  if (error) return { data: null, error };
  return { data: data as Donation, error: null };
}

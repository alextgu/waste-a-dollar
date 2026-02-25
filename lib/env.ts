/**
 * Validates required Supabase env vars. Throws a clear error if missing so the app fails fast.
 * Call from Supabase client creation (server-side only).
 */
export function assertSupabaseEnv(): void {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || typeof url !== "string" || !url.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local (see env.example)."
    );
  }
  if (!key || typeof key !== "string" || !key.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to .env.local (see env.example)."
    );
  }
}

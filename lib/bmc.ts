/**
 * Buy Me a Coffee integration.
 * - BMC's REST API (developers.buymeacoffee.com) is no longer maintained; they recommend webhooks.
 * - If BMC adds or documents a "list supporters" API, set BUYMEACOFFEE_API_URL and BUYMEACOFFEE_ACCESS_TOKEN.
 * - Webhooks are the supported way to receive donation events in real time.
 */

const BMC_API_URL = process.env.BUYMEACOFFEE_API_URL;
const BMC_ACCESS_TOKEN = process.env.BUYMEACOFFEE_ACCESS_TOKEN;

export type BmcSupportPayload = {
  response?: {
    supporter_email?: string;
    number_of_coffees?: string;
    total_amount?: string;
    support_created_on?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/**
 * Fetch donation/supporter data from BMC's API (if configured).
 * BMC has deprecated their public API in favor of webhooks; this is for when/if they expose a list endpoint.
 */
export async function fetchBmcDonations(): Promise<{
  data: unknown | null;
  error: string | null;
}> {
  if (!BMC_API_URL || !BMC_ACCESS_TOKEN) {
    return {
      data: null,
      error: "BMC API not configured. Set BUYMEACOFFEE_API_URL and BUYMEACOFFEE_ACCESS_TOKEN, or use webhooks.",
    };
  }

  try {
    const res = await fetch(BMC_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BMC_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        data: null,
        error: `BMC API error ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: `Request failed: ${message}` };
  }
}

/**
 * Normalize a BMC webhook payload into our donation shape (email, name, amount_donated).
 * Adjust fields based on actual webhook docs: studio.buymeacoffee.com/webhooks/docs
 */
export function normalizeBmcWebhookToDonation(payload: BmcSupportPayload): {
  email: string;
  name: string;
  amount_donated: number;
} | null {
  const r = payload?.response ?? payload;
  if (!r || typeof r !== "object") return null;

  const email = typeof r.supporter_email === "string" ? r.supporter_email.trim() : "";
  const amount = typeof r.total_amount === "string" ? parseFloat(r.total_amount) : Number(r.total_amount);
  if (!email || Number.isNaN(amount) || amount < 0) return null;

  const name = typeof r.supporter_name === "string" ? r.supporter_name.trim() : email.split("@")[0] || "Supporter";

  return { email, name, amount_donated: amount };
}

import { NextResponse } from "next/server";
import { fetchBmcDonations } from "@/lib/bmc";

/**
 * GET /api/donations/bmc
 * Request donation/supporter data from Buy Me a Coffee.
 * Requires BUYMEACOFFEE_API_URL and BUYMEACOFFEE_ACCESS_TOKEN in .env.
 * BMC has deprecated their REST API in favor of webhooks; when they document a list endpoint, set the URL.
 * Otherwise use POST /api/webhooks/bmc to receive donations when BMC sends them.
 */
export async function GET() {
  const { data, error } = await fetchBmcDonations();
  if (error) {
    return NextResponse.json(
      { error, data: null },
      { status: data === null && error.includes("not configured") ? 503 : 500 }
    );
  }
  return NextResponse.json({ data });
}

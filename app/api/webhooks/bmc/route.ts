import { NextResponse } from "next/server";
import { insertDonation } from "@/lib/donations";
import {
  normalizeBmcWebhookToDonation,
  type BmcSupportPayload,
} from "@/lib/bmc";

const WEBHOOK_SECRET = process.env.BUYMEACOFFEE_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/bmc
 * Receives webhooks from Buy Me a Coffee when someone donates.
 * Configure in BMC: Studio → Webhooks → endpoint https://your-domain.com/api/webhooks/bmc
 * Set BUYMEACOFFEE_WEBHOOK_SECRET in .env and the same value in BMC’s webhook verification token.
 * Verification is required when the secret is set; always set it in production.
 */
export async function POST(request: Request) {
  try {
    if (WEBHOOK_SECRET) {
      const auth = request.headers.get("authorization");
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
      const headerToken = request.headers.get("x-bmc-verification-token");
      const provided = token ?? headerToken ?? "";
      if (provided !== WEBHOOK_SECRET) {
        return NextResponse.json(
          { error: "Unauthorized: invalid or missing webhook secret" },
          { status: 401 }
        );
      }
    }

    const payload = (await request.json()) as BmcSupportPayload;
    const donation = normalizeBmcWebhookToDonation(payload);

    if (donation) {
      const { error } = await insertDonation(donation);
      if (error) {
        console.error("Webhook: failed to store donation", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 }
    );
  }
}

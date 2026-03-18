import Stripe from "stripe";
import { upsertDonationByStripeSession } from "@/lib/donations";
import Link from "next/link";

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY env var.");
  return new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" });
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  let saved = false;
  let saveError: string | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const amount = typeof session.amount_total === "number" ? session.amount_total / 100 : 1;
      const email =
        session.customer_details?.email ??
        (typeof session.customer_email === "string" ? session.customer_email : null);
      const name =
        (typeof session.metadata?.donor_name === "string" && session.metadata.donor_name.trim()) ||
        session.customer_details?.name ||
        "Anonymous";

      if (email) {
        const result = await upsertDonationByStripeSession({
          stripe_session_id: sessionId,
          email,
          name,
          amount_donated: amount,
        });
        if (result.error) {
          console.error("Donation save error:", result.error);
          saveError = "Payment succeeded, but we couldn't save your donation.";
        } else {
          saved = true;
        }
      } else {
        saveError = "Payment succeeded, but Stripe did not provide an email.";
      }
    } catch (e) {
      console.error("Thank-you processing error:", e);
      saveError = "Payment succeeded, but we couldn't verify the session.";
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md px-6 text-center">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="mt-3 text-sm text-[var(--color-foreground)]/70">
        Your donation was processed successfully.
      </p>

      {saved && (
        <p className="mt-4 text-sm text-[var(--color-foreground)]/70">
          You are now on the leaderboard.
        </p>
      )}
      {saveError && (
        <p className="mt-4 text-sm text-red-300">
          {saveError}
        </p>
      )}

      {sessionId && (
        <p className="mt-6 break-all rounded-md border border-[var(--color-foreground)]/15 bg-black/5 px-3 py-2 text-xs text-[var(--color-foreground)]/70">
          Session: {sessionId}
        </p>
      )}

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-5 py-2 text-sm font-semibold text-black"
      >
        Back home
      </Link>
    </div>
  );
}


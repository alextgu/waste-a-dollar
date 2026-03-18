import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY env var.");

  return new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" });
}

async function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL;

  if (envUrl && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    return trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Missing host header; cannot build absolute URLs.");
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const name = (body as { name?: unknown })?.name;
    const email = (body as { email?: unknown })?.email;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Missing or invalid name" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = await getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
              description: "Thank you for your support!",
            },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        },
      ],
      customer_email: email.trim(),
      metadata: {
        donor_name: name.trim(),
      },
      success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}


// app/actions/stripe.ts
'use server';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

async function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_URL;

  if (envUrl && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim().replace(/\/$/, '');
    return trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
  }

  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) throw new Error('Missing host header; cannot build absolute URLs.');
  return `${proto}://${host}`;
}

let stripeClient: Stripe | undefined;
function getStripe() {
  if (stripeClient) return stripeClient;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY env var.');
  }

  stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
  });
  return stripeClient;
}

export async function createCheckoutSession(formData: FormData) {
  const stripe = getStripe();
  const rawAmount = formData.get('amount');
  const amount = typeof rawAmount === 'string' ? Number.parseFloat(rawAmount) : NaN;

  // Stripe expects the smallest currency unit (cents).
  // Keep this strict to avoid accidental $0 / NaN / negative payments.
  if (!Number.isFinite(amount) || amount < 1) {
    redirect('/donate?error=invalid_amount');
  }

  // Optional: cap donations to avoid fat-fingered huge charges.
  if (amount > 5000) {
    redirect('/donate?error=amount_too_large');
  }

  const baseUrl = await getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
            description: 'Thank you for your support!',
            // Optional: Add your logo URL here so it shows on the Stripe page
            // images: ['https://your-site.com/logo.png'], 
          },
          unit_amount: Math.round(amount * 100), // $1.00 = 100
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    submit_type: 'donate',
    // Where to send them after they pay
    success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/donate`,
  });

  redirect(session.url!);
}
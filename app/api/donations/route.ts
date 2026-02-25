import { NextResponse } from "next/server";
import { insertDonation, getDonations } from "@/lib/donations";
import { isRateLimited } from "@/lib/rate-limit";

/** GET /api/donations – list all donations (e.g. for leaderboard) */
export async function GET() {
  const { data, error } = await getDonations();
  if (error) {
    console.error("Donations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
  return NextResponse.json({ data: data ?? [] });
}

/** POST /api/donations – create a donation (send to Supabase) */
export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many donation attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  try {
    const body = await request.json();
    let { email, name, amount_donated } = body;

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid name" },
        { status: 400 }
      );
    }
    const amount = typeof amount_donated === "string" ? parseFloat(amount_donated) : Number(amount_donated);
    if (Number.isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Missing or invalid amount_donated (must be a non-negative number)" },
        { status: 400 }
      );
    }

    const { data, error } = await insertDonation({
      email: email.trim(),
      name: name.trim(),
      amount_donated: amount,
    });

    if (error) {
      console.error("Donation insert error:", error);
      return NextResponse.json(
        { error: "Failed to save donation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

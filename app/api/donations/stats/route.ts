import { NextResponse } from "next/server";
import { getDonationCount, getDonationTotal } from "@/lib/donations";

export async function GET() {
  const [{ count, error: countError }, { total, error: totalError }] =
    await Promise.all([getDonationCount(), getDonationTotal()]);

  const error = countError ?? totalError;
  if (error) {
    console.error("Donation stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 });
  }

  return NextResponse.json({
    count: count ?? 0,
    total: total ?? 0,
  });
}


import { NextResponse } from "next/server";
import { getDonationCount } from "@/lib/donations";

export async function GET() {
  const { count, error } = await getDonationCount();
  if (error) {
    console.error("Donation count fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch donation count" }, { status: 500 });
  }
  return NextResponse.json({ count: count ?? 0 });
}


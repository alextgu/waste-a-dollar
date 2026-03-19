import { NextResponse } from "next/server";
import { getLatestDonationCreatedAt } from "@/lib/donations";

export async function GET() {
  const { created_at, error } = await getLatestDonationCreatedAt();
  if (error) {
    console.error("Latest donation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest donation" },
      { status: 500 }
    );
  }

  return NextResponse.json({ created_at });
}


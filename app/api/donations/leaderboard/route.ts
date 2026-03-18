import { NextResponse } from "next/server";
import { getDonations } from "@/lib/donations";

export async function GET() {
  const { data, error } = await getDonations();
  if (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }

  const rows = (data ?? []).map((d, idx) => ({
    rank: idx + 1,
    name: d.name,
    created_at: d.created_at,
  }));

  return NextResponse.json({ data: rows });
}


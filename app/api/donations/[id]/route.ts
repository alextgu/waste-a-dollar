import { NextResponse } from "next/server";
import { getDonationById, updateDonation, isDonationNotFound } from "@/lib/donations";

type RouteContext = { params: Promise<{ id: string }> };

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

/** GET /api/donations/[id] – fetch one donation */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Invalid donation id" }, { status: 400 });
  }
  const { data, error } = await getDonationById(id);
  if (isDonationNotFound({ error })) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }
  if (error) {
    console.error("Donation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation" },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }
  return NextResponse.json({ data });
}

/** PATCH /api/donations/[id] – update a donation (send updates to Supabase) */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Invalid donation id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const update: { email?: string; name?: string; amount_donated?: number } = {};
    if (body.email !== undefined) {
      if (typeof body.email !== "string" || !body.email.trim()) {
        return NextResponse.json(
          { error: "Invalid email" },
          { status: 400 }
        );
      }
      update.email = body.email.trim();
    }
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { error: "Invalid name" },
          { status: 400 }
        );
      }
      update.name = body.name.trim();
    }
    if (body.amount_donated !== undefined) {
      if (typeof body.amount_donated !== "number" || body.amount_donated < 0) {
        return NextResponse.json(
          { error: "Invalid amount_donated" },
          { status: 400 }
        );
      }
      update.amount_donated = body.amount_donated;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update (email, name, amount_donated)" },
        { status: 400 }
      );
    }

    const { data, error } = await updateDonation(id, update);
    if (isDonationNotFound({ error })) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }
    if (error) {
      console.error("Donation update error:", error);
      return NextResponse.json(
        { error: "Failed to update donation" },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

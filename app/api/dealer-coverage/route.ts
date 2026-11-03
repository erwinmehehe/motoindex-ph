import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { matchQuoteEligibleDealers } from "@/lib/persistentSellers";
import { ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

// Buyer-facing availability only: never return partner email addresses or lead-routing identifiers.
export async function POST(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") || 0) > 2000) return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413, headers });
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers }); }
  const make = typeof body.make === "string" ? body.make.trim().slice(0, 60) : "";
  const cityProvince = typeof body.cityProvince === "string" ? body.cityProvince.trim().slice(0, 120) : "";
  if (!make || cityProvince.length < 3) {
    return NextResponse.json({ ok: false, error: "Choose a motorcycle brand and enter a city or province." }, { status: 400, headers });
  }
  if (!databaseConfigured()) return NextResponse.json({ ok: false, error: "Dealer coverage is temporarily unavailable." }, { status: 503, headers });
  try {
    const available = (await matchQuoteEligibleDealers(make, cityProvince, 1)).length > 0;
    return NextResponse.json({ ok: true, available }, { headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Dealer coverage is temporarily unavailable." }, { status: 503, headers });
  }
}

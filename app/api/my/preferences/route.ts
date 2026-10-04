import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const keys = [
  "notificationPriceDropEmail",
  "notificationQuoteEmail",
  "notificationRegistrationEmail",
  "notificationInsuranceEmail",
  "notificationMaintenanceEmail",
  "notificationDealerPromoEmail",
] as const;

async function ownerOr401() {
  if (!ownerAuthConfigured()) return null;
  const session = await getOwnerSession();
  return session;
}

export async function GET() {
  const session = await ownerOr401();
  if (!session) return NextResponse.json({ ok: false, error: "Sign in to manage notifications." }, { status: 401, headers });
  const owner = await prisma.ownerAccount.findUnique({ where: { id: session.ownerId } });
  if (!owner) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404, headers });
  return NextResponse.json({ ok: true, preferences: Object.fromEntries(keys.map(key => [key, owner[key]])) }, { headers });
}

export async function PUT(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  const session = await ownerOr401();
  if (!session) return NextResponse.json({ ok: false, error: "Sign in to manage notifications." }, { status: 401, headers });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers }); }
  const data: Record<string, boolean> = {};
  for (const key of keys) if (typeof body[key] === "boolean") data[key] = body[key] as boolean;
  if (!Object.keys(data).length) return NextResponse.json({ ok: false, error: "No valid preference supplied." }, { status: 400, headers });
  const updated = await prisma.ownerAccount.update({ where: { id: session.ownerId }, data });
  return NextResponse.json({ ok: true, preferences: Object.fromEntries(keys.map(key => [key, updated[key]])) }, { headers });
}

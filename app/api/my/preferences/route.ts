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
  const current = await prisma.ownerAccount.findUnique({ where: { id: session.ownerId } });
  if (!current) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404, headers });
  const data = {
    notificationPriceDropEmail: typeof body.notificationPriceDropEmail === "boolean" ? body.notificationPriceDropEmail : current.notificationPriceDropEmail,
    notificationQuoteEmail: typeof body.notificationQuoteEmail === "boolean" ? body.notificationQuoteEmail : current.notificationQuoteEmail,
    notificationRegistrationEmail: typeof body.notificationRegistrationEmail === "boolean" ? body.notificationRegistrationEmail : current.notificationRegistrationEmail,
    notificationInsuranceEmail: typeof body.notificationInsuranceEmail === "boolean" ? body.notificationInsuranceEmail : current.notificationInsuranceEmail,
    notificationMaintenanceEmail: typeof body.notificationMaintenanceEmail === "boolean" ? body.notificationMaintenanceEmail : current.notificationMaintenanceEmail,
    notificationDealerPromoEmail: typeof body.notificationDealerPromoEmail === "boolean" ? body.notificationDealerPromoEmail : current.notificationDealerPromoEmail,
  };
  const changed = keys.some(key => typeof body[key] === "boolean");
  if (!changed) return NextResponse.json({ ok: false, error: "No valid preference supplied." }, { status: 400, headers });
  const updated = await prisma.ownerAccount.update({
    where: { id: session.ownerId },
    data: {
      ...data,
      reminderEmailsEnabled: data.notificationRegistrationEmail || data.notificationInsuranceEmail || data.notificationMaintenanceEmail,
    },
  });
  return NextResponse.json({ ok: true, preferences: Object.fromEntries(keys.map(key => [key, updated[key]])) }, { headers });
}

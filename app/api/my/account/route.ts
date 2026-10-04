import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearOwnerSessionCookie, getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function DELETE(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  if (!ownerAuthConfigured()) return NextResponse.json({ ok: false, error: "MotoIndex accounts are not enabled." }, { status: 503, headers });
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Sign in to delete your account." }, { status: 401, headers });
  await prisma.$transaction(async tx => {
    await tx.priceAlertSubscription.deleteMany({ where: { ownerId: session.ownerId } });
    await tx.dealerLead.deleteMany({ where: { ownerId: session.ownerId } });
    await tx.usedListing.deleteMany({ where: { ownerId: session.ownerId } });
    await tx.ownerAccount.delete({ where: { id: session.ownerId } });
  });
  const response = NextResponse.json({ ok: true }, { headers });
  clearOwnerSessionCookie(response);
  return response;
}

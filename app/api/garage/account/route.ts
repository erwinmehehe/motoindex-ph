import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerSession, ownerAuthConfigured } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function GET() {
  if (!ownerAuthConfigured()) {
    return NextResponse.json({ available: false, authenticated: false }, { headers });
  }
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ available: true, authenticated: false }, { headers });
  }
  const snapshot = await prisma.garageSnapshot.findUnique({
    where: { ownerId: session.ownerId },
    select: { revision: true, updatedAt: true },
  });
  return NextResponse.json({
    available: true,
    authenticated: true,
    email: session.owner.email,
    reminderEmailsEnabled: session.owner.reminderEmailsEnabled,
    sessionExpiresAt: session.expiresAt.toISOString(),
    cloud: snapshot ? { revision: snapshot.revision, updatedAt: snapshot.updatedAt.toISOString() } : null,
  }, { headers });
}

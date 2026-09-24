import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashOwnerToken,
  ownerAuthConfigured,
  ownerRequestOriginAllowed,
  ownerSessionExpiry,
  ownerToken,
  setOwnerSessionCookie,
} from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  if (!ownerAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Garage accounts are not enabled yet." }, { status: 503, headers });
  }

  const { token } = await params;
  if (!token || token.length > 256) {
    return NextResponse.json({ ok: false, error: "This sign-in link is invalid." }, { status: 400, headers });
  }

  const tokenHash = hashOwnerToken(token);
  const link = await prisma.ownerMagicLink.findUnique({ where: { tokenHash } });
  if (!link || link.usedAt || link.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: "This sign-in link is invalid, expired, or already used." }, { status: 410, headers });
  }

  const sessionToken = ownerToken();
  const sessionHash = hashOwnerToken(sessionToken);
  const expiresAt = ownerSessionExpiry();
  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
      const consumed = await tx.ownerMagicLink.updateMany({
        where: { id: link.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) throw new Error("MAGIC_LINK_ALREADY_USED");
      await tx.ownerAccount.update({
        where: { id: link.ownerId },
        data: { verifiedAt: now },
      });
      await tx.ownerSession.create({
        data: {
          ownerId: link.ownerId,
          tokenHash: sessionHash,
          expiresAt,
        },
      });
    });
  } catch {
    return NextResponse.json({ ok: false, error: "This sign-in link could not be used." }, { status: 409, headers });
  }

  const response = NextResponse.json({ ok: true }, { headers });
  setOwnerSessionCookie(response, sessionToken, expiresAt);
  return response;
}

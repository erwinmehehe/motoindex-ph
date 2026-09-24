import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashOwnerToken,
  normalizeOwnerEmail,
  ownerAuthConfigured,
  ownerMagicLinkExpiry,
  ownerRequestOriginAllowed,
  ownerToken,
  sendOwnerMagicLink,
  validOwnerEmail,
} from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function POST(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  if (!ownerAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Garage accounts are not enabled yet." }, { status: 503, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers });
  }

  const email = normalizeOwnerEmail(body.email);
  if (!validOwnerEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400, headers });
  }

  const owner = await prisma.ownerAccount.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const recent = await prisma.ownerMagicLink.count({
    where: { ownerId: owner.id, createdAt: { gte: windowStart } },
  });
  if (recent >= 3) {
    return NextResponse.json(
      { ok: false, error: "Too many sign-in emails were requested. Try again later." },
      { status: 429, headers }
    );
  }

  await prisma.ownerMagicLink.deleteMany({
    where: {
      ownerId: owner.id,
      OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
    },
  }).catch(() => {});

  const token = ownerToken();
  const link = await prisma.ownerMagicLink.create({
    data: {
      ownerId: owner.id,
      tokenHash: hashOwnerToken(token),
      expiresAt: ownerMagicLinkExpiry(),
    },
  });

  try {
    await sendOwnerMagicLink(email, token);
  } catch {
    await prisma.ownerMagicLink.delete({ where: { id: link.id } }).catch(() => {});
    return NextResponse.json(
      { ok: false, error: "The sign-in email could not be sent. Try again later." },
      { status: 503, headers }
    );
  }

  return NextResponse.json(
    { ok: true, message: "Check your email for the MotoIndex sign-in link." },
    { status: 201, headers }
  );
}

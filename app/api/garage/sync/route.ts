import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const MAX_PAYLOAD_BYTES = 500_000;

function validGaragePayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  return Array.isArray(payload.motorcycles) && Array.isArray(payload.records) && Array.isArray(payload.documents);
}

async function ownerOr401() {
  if (!ownerAuthConfigured()) return { error: NextResponse.json({ ok: false, error: "Garage cloud sync is not enabled." }, { status: 503, headers }) };
  const session = await getOwnerSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: "Sign in to use Garage cloud sync." }, { status: 401, headers }) };
  return { session };
}

export async function GET() {
  const auth = await ownerOr401();
  if ("error" in auth) return auth.error;
  const snapshot = await prisma.garageSnapshot.findUnique({ where: { ownerId: auth.session.ownerId } });
  return NextResponse.json({
    ok: true,
    snapshot: snapshot ? {
      revision: snapshot.revision,
      updatedAt: snapshot.updatedAt.toISOString(),
      payload: snapshot.payload,
    } : null,
  }, { headers });
}

export async function PUT(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  const auth = await ownerOr401();
  if ("error" in auth) return auth.error;

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Garage data is too large to sync." }, { status: 413, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid Garage sync request." }, { status: 400, headers });
  }

  const payload = body.payload;
  const expectedRevision = Number(body.revision ?? 0);
  if (!validGaragePayload(payload) || !Number.isInteger(expectedRevision) || expectedRevision < 0) {
    return NextResponse.json({ ok: false, error: "Invalid Garage sync payload." }, { status: 400, headers });
  }
  const serialized = JSON.stringify(payload);
  if (serialized.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "Garage data is too large to sync." }, { status: 413, headers });
  }

  const ownerId = auth.session.ownerId;
  const existing = await prisma.garageSnapshot.findUnique({ where: { ownerId } });

  if (!existing) {
    if (expectedRevision !== 0) {
      return NextResponse.json({ ok: false, conflict: true, revision: 0, error: "Cloud Garage changed. Reload its current state before saving." }, { status: 409, headers });
    }
    try {
      const created = await prisma.garageSnapshot.create({
        data: { ownerId, payload: payload as Prisma.InputJsonValue, revision: 1 },
      });
      return NextResponse.json({ ok: true, revision: created.revision, updatedAt: created.updatedAt.toISOString() }, { headers });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const latest = await prisma.garageSnapshot.findUnique({ where: { ownerId } });
        return NextResponse.json({ ok: false, conflict: true, revision: latest?.revision || 1, error: "Cloud Garage changed. Reload its current state before saving." }, { status: 409, headers });
      }
      throw error;
    }
  }

  if (existing.revision !== expectedRevision) {
    return NextResponse.json({
      ok: false,
      conflict: true,
      revision: existing.revision,
      updatedAt: existing.updatedAt.toISOString(),
      error: "Cloud Garage changed on another device. Restore or reload it before replacing the cloud copy.",
    }, { status: 409, headers });
  }

  const updated = await prisma.garageSnapshot.updateMany({
    where: { ownerId, revision: expectedRevision },
    data: { payload: payload as Prisma.InputJsonValue, revision: { increment: 1 } },
  });
  if (updated.count !== 1) {
    const latest = await prisma.garageSnapshot.findUnique({ where: { ownerId } });
    return NextResponse.json({
      ok: false,
      conflict: true,
      revision: latest?.revision || expectedRevision,
      updatedAt: latest?.updatedAt.toISOString(),
      error: "Cloud Garage changed on another device. Restore or reload it before replacing the cloud copy.",
    }, { status: 409, headers });
  }

  const latest = await prisma.garageSnapshot.findUnique({ where: { ownerId } });
  return NextResponse.json({
    ok: true,
    revision: latest?.revision,
    updatedAt: latest?.updatedAt.toISOString(),
  }, { headers });
}

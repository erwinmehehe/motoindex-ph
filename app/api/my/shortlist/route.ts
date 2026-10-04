import { NextResponse } from "next/server";
import { getModelById } from "@/lib/data";
import { prisma } from "@/lib/db";
import { getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

async function sessionOr401() {
  if (!ownerAuthConfigured()) return { response: NextResponse.json({ ok: false, error: "MotoIndex accounts are not enabled." }, { status: 503, headers }) };
  const session = await getOwnerSession();
  if (!session) return { response: NextResponse.json({ ok: false, error: "Sign in to sync your shortlist." }, { status: 401, headers }) };
  return { session };
}

export async function GET() {
  const auth = await sessionOr401();
  if ("response" in auth) return auth.response;
  const rows = await prisma.ownerShortlistItem.findMany({
    where: { ownerId: auth.session.ownerId },
    orderBy: [{ position: "asc" }, { updatedAt: "desc" }],
    select: { modelId: true },
  });
  return NextResponse.json({ ok: true, modelIds: rows.map(row => row.modelId) }, { headers });
}

export async function PUT(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  const auth = await sessionOr401();
  if ("response" in auth) return auth.response;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers }); }
  const input = Array.isArray(body.modelIds) ? body.modelIds : [];
  const modelIds = [...new Set(input.filter((value): value is string => typeof value === "string" && value.length <= 100))]
    .filter(id => Boolean(getModelById(id)))
    .slice(0, 8);

  await prisma.$transaction(async tx => {
    await tx.ownerShortlistItem.deleteMany({ where: { ownerId: auth.session.ownerId, modelId: { notIn: modelIds } } });
    for (const [position, modelId] of modelIds.entries()) {
      await tx.ownerShortlistItem.upsert({
        where: { ownerId_modelId: { ownerId: auth.session.ownerId, modelId } },
        create: { ownerId: auth.session.ownerId, modelId, position },
        update: { position },
      });
    }
  });
  return NextResponse.json({ ok: true, modelIds }, { headers });
}

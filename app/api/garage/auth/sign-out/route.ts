import { NextResponse } from "next/server";
import {
  clearOwnerSessionCookie,
  hashOwnerToken,
  ownerAuthConfigured,
  ownerRequestOriginAllowed,
  ownerSessionTokenFromCookies,
} from "@/lib/ownerAuth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!ownerRequestOriginAllowed(request)) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  if (!ownerAuthConfigured()) {
    const disabled = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    clearOwnerSessionCookie(disabled);
    return disabled;
  }
  const token = await ownerSessionTokenFromCookies();
  if (token) {
    await prisma.ownerSession.deleteMany({ where: { tokenHash: hashOwnerToken(token) } }).catch(() => {});
  }
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } }
  );
  clearOwnerSessionCookie(response);
  return response;
}

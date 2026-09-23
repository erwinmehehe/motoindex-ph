import { NextResponse } from "next/server";
import {
  clearOwnerSessionCookie,
  hashOwnerToken,
  ownerSessionTokenFromCookies,
} from "@/lib/ownerAuth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
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

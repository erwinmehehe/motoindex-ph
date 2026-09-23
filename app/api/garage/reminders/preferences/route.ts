import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { garageRemindersConfigured } from "@/lib/garageReminders";
import { getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function PUT(request: Request) {
  if (!ownerRequestOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  }
  if (!ownerAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Garage accounts are not enabled." }, { status: 503, headers });
  }
  if (!garageRemindersConfigured()) {
    return NextResponse.json({ ok: false, error: "Garage email reminders are not configured yet." }, { status: 503, headers });
  }
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sign in to update Garage reminders." }, { status: 401, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers });
  }
  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ ok: false, error: "Reminder preference is invalid." }, { status: 400, headers });
  }

  await prisma.ownerAccount.update({
    where: { id: session.ownerId },
    data: { reminderEmailsEnabled: body.enabled },
  });
  return NextResponse.json({ ok: true, reminderEmailsEnabled: body.enabled }, { headers });
}

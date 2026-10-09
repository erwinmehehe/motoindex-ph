import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess";
import { NextResponse } from "next/server";
import { expireStaleOffers } from "@/lib/persistentOffers";

export const runtime = "nodejs";

export async function POST(req: Request){const denied=await requirePrivilegedApiAccess(req);if(denied)return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const requested = Number(body.maxAgeDays);
    const maxAgeDays = Number.isFinite(requested) && requested > 0 ? requested : undefined;
    return NextResponse.json({ ok: true, ...await expireStaleOffers(maxAgeDays) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Expiry failed" }, { status: 400 });
  }
}

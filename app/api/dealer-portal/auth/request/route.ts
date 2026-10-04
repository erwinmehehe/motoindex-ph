import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dealerAuthConfigured, dealerMagicLinkExpiry, dealerRequestOriginAllowed, dealerToken, hashDealerToken, normalizeDealerEmail, sendDealerMagicLink, validDealerEmail } from "@/lib/dealerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function POST(request: Request) {
  if (!dealerRequestOriginAllowed(request)) return NextResponse.json({ ok:false, error:"Invalid request origin." }, { status:403, headers });
  if (!dealerAuthConfigured()) return NextResponse.json({ ok:false, error:"Dealer Portal is not enabled yet." }, { status:503, headers });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok:false, error:"Invalid request." }, { status:400, headers }); }
  const email = normalizeDealerEmail(body.email);
  if (!validDealerEmail(email)) return NextResponse.json({ ok:false, error:"Enter a valid email address." }, { status:400, headers });

  const account = await prisma.dealerAccount.findUnique({ where:{ email }, include:{ memberships:true } });
  const generic = { ok:true, message:"If this email belongs to an approved MotoIndex dealer, a sign-in link will arrive shortly." };
  if (!account || !account.memberships.length) return NextResponse.json(generic, { status:201, headers });

  const recent = await prisma.dealerMagicLink.count({
    where:{ accountId:account.id, createdAt:{ gte:new Date(Date.now()-15*60*1000) } }
  });
  if (recent >= 3) return NextResponse.json({ ok:false, error:"Too many sign-in emails were requested. Try again later." }, { status:429, headers });

  await prisma.dealerMagicLink.deleteMany({
    where:{ accountId:account.id, OR:[{ expiresAt:{ lt:new Date() } }, { usedAt:{ not:null } }] }
  }).catch(()=>{});

  const token = dealerToken();
  const link = await prisma.dealerMagicLink.create({
    data:{ accountId:account.id, tokenHash:hashDealerToken(token), expiresAt:dealerMagicLinkExpiry() }
  });
  try { await sendDealerMagicLink(email, token); }
  catch {
    await prisma.dealerMagicLink.delete({ where:{ id:link.id } }).catch(()=>{});
    return NextResponse.json({ ok:false, error:"The sign-in email could not be sent." }, { status:503, headers });
  }
  return NextResponse.json(generic, { status:201, headers });
}

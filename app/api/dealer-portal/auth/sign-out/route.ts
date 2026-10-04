import { NextResponse } from "next/server";
import { clearDealerSessionCookie, dealerRequestOriginAllowed, dealerSessionTokenFromCookies, hashDealerToken } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:Request){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403});
  const token=await dealerSessionTokenFromCookies();
  if(token)await prisma.dealerSession.deleteMany({where:{tokenHash:hashDealerToken(token)}}).catch(()=>{});
  const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"}});
  clearDealerSessionCookie(response);
  return response;
}

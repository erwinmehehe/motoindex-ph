import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dealerAuthConfigured, dealerRequestOriginAllowed, dealerSessionExpiry, dealerToken, hashDealerToken, setDealerSessionCookie } from "@/lib/dealerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control":"no-store", "X-Robots-Tag":"noindex, nofollow, noarchive" };

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}) {
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  if(!dealerAuthConfigured())return NextResponse.json({ok:false,error:"Dealer Portal is not enabled yet."},{status:503,headers});
  const {token}=await params;
  if(!token||token.length>256)return NextResponse.json({ok:false,error:"This sign-in link is invalid."},{status:400,headers});
  const link=await prisma.dealerMagicLink.findUnique({where:{tokenHash:hashDealerToken(token)}});
  if(!link||link.usedAt||link.expiresAt.getTime()<=Date.now())return NextResponse.json({ok:false,error:"This sign-in link is invalid, expired, or already used."},{status:410,headers});

  const sessionToken=dealerToken();
  const expiresAt=dealerSessionExpiry();
  const now=new Date();
  try{
    await prisma.$transaction(async tx=>{
      const consumed=await tx.dealerMagicLink.updateMany({where:{id:link.id,usedAt:null,expiresAt:{gt:now}},data:{usedAt:now}});
      if(consumed.count!==1)throw new Error("USED");
      await tx.dealerAccount.update({where:{id:link.accountId},data:{verifiedAt:now}});
      await tx.dealerSession.create({data:{accountId:link.accountId,tokenHash:hashDealerToken(sessionToken),expiresAt}});
    });
  }catch{
    return NextResponse.json({ok:false,error:"This sign-in link could not be used."},{status:409,headers});
  }
  const response=NextResponse.json({ok:true},{headers});
  setDealerSessionCookie(response,sessionToken,expiresAt);
  return response;
}

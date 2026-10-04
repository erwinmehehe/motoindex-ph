import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { privacyRetentionConfigured, runPrivacyRetention } from "@/lib/privacyRetention";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function safeEqual(a:string,b:string){
  const left=Buffer.from(a),right=Buffer.from(b);
  return left.length===right.length&&timingSafeEqual(left,right);
}

function authorized(request:Request){
  const expected=process.env.PRIVACY_RETENTION_CRON_SECRET||"";
  const header=request.headers.get("authorization")||"";
  const supplied=header.startsWith("Bearer ")?header.slice(7):"";
  return Boolean(expected&&supplied&&safeEqual(supplied,expected));
}

async function run(request:Request){
  const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};
  if(!authorized(request))return NextResponse.json({ok:false,error:"Unauthorized."},{status:401,headers});
  if(!privacyRetentionConfigured())return NextResponse.json({ok:false,error:"Privacy retention is not fully configured."},{status:503,headers});
  try{
    return NextResponse.json({ok:true,...await runPrivacyRetention()},{headers});
  }catch{
    return NextResponse.json({ok:false,error:"Privacy retention run failed."},{status:500,headers});
  }
}
export const GET=run;
export const POST=run;

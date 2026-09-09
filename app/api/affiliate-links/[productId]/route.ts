import { NextResponse } from "next/server";
import { getRuntimeAffiliateLink } from "@/lib/runtimeAffiliate";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(_request:Request,{params}:{params:Promise<{productId:string}>}){
  const {productId}=await params;
  const link=await getRuntimeAffiliateLink(productId);
  if(!link){
    return NextResponse.json({active:false},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
  return NextResponse.json(
    {active:true,merchant:link.merchant,network:link.network},
    {headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}}
  );
}

import { NextResponse } from "next/server";
import { getRuntimeAffiliateLinks } from "@/lib/runtimeAffiliate";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(_request:Request,{params}:{params:Promise<{productId:string}>}){
  const {productId}=await params;
  const offers=await getRuntimeAffiliateLinks(productId);
  if(!offers.length){
    return NextResponse.json({active:false},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
  const primary=offers.find(({merchant})=>merchant==="shopee")||offers[0];
  return NextResponse.json(
    {active:true,merchant:primary.merchant,network:primary.network,offers:offers.map(({merchant,network})=>({merchant,network}))},
    {headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}}
  );
}

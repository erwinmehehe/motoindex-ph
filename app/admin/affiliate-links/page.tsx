import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { allCatalogProducts } from "@/lib/catalog";
import { getAffiliateLink } from "@/lib/affiliate";
import { AffiliateLinkManager } from "@/components/AffiliateLinkManager";

export const metadata:Metadata={title:"Affiliate Links",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function AffiliateLinksAdmin(){
  const configured=databaseConfigured();
  let databaseReady=configured;
  let dbRows:Awaited<ReturnType<typeof prisma.affiliateProductLink.findMany>>=[];
  let clickEvents:Awaited<ReturnType<typeof prisma.outboundClickEvent.findMany>>=[];
  if(configured){
    try{
      dbRows=await prisma.affiliateProductLink.findMany({orderBy:{updatedAt:"desc"}});
      clickEvents=await prisma.outboundClickEvent.findMany({
        where:{entityType:"affiliate_product",createdAt:{gte:new Date(Date.now()-30*24*60*60*1000)}},
        select:{sourceOfferId:true,createdAt:true}
      });
    }catch{
      databaseReady=false;
    }
  }
  const byId=new Map(dbRows.map(row=>[row.productId,row]));
  const clicksByProduct=new Map<string,{d7:number;d30:number}>();
  const sevenDaysAgo=Date.now()-7*24*60*60*1000;
  for(const event of clickEvents){
    if(!event.sourceOfferId)continue;
    const current=clicksByProduct.get(event.sourceOfferId)||{d7:0,d30:0};
    current.d30+=1;
    if(event.createdAt.getTime()>=sevenDaysAgo)current.d7+=1;
    clicksByProduct.set(event.sourceOfferId,current);
  }
  const rows=allCatalogProducts().map(product=>{
    const db=byId.get(product.id);
    const fallback=getAffiliateLink(product.id);
    return {
      ...product,
      dbLink:db?{
        url:db.url,
        network:db.network,
        status:db.status,
        reviewNote:db.reviewNote||"",
        approvedAt:db.approvedAt?.toISOString(),
        updatedAt:db.updatedAt.toISOString()
      }:undefined,
      fallback:fallback?{network:fallback.network}:undefined,
      clicks7:clicksByProduct.get(product.id)?.d7||0,
      clicks30:clicksByProduct.get(product.id)?.d30||0
    };
  });

  return <section className="page shell">
    <div className="page-head">
      <h1>Affiliate link manager</h1>
      <p>Approve or disable Shopee and Involve Asia destinations by MotoIndex product ID. Database changes take effect at runtime, so public commerce CTAs do not require a content rebuild.</p>
      <div className="hero-actions"><a className="button ghost small" href="/admin/data-health">Data health</a><a className="button ghost small" href="/affiliate-disclosure" target="_blank">Affiliate disclosure ↗</a></div>
    </div>
    <div className="note-box"><h2>Publication rule</h2><p>Only HTTPS links on approved Shopee or Involve Asia hosts can be activated. An explicit database Disabled record blocks older JSON/environment fallbacks for that product.</p></div>
    <AffiliateLinkManager rows={rows} databaseConfigured={databaseReady}/>
  </section>;
}

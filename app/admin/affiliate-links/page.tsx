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
  if(configured){
    try{
      dbRows=await prisma.affiliateProductLink.findMany({orderBy:{updatedAt:"desc"}});
    }catch{
      databaseReady=false;
    }
  }
  const byId=new Map(dbRows.map(row=>[row.productId,row]));
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
      fallback:fallback?{network:fallback.network}:undefined
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

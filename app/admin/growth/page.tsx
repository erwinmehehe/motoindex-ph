import type { Metadata } from "next";
import Link from "next/link";
import { databaseConfigured, prisma } from "@/lib/db";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Growth Dashboard",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

type ProductClick={productId:string;clicks7:number;clicks30:number};

export default async function GrowthDashboard(){
  const configured=databaseConfigured();
  let ready=configured;
  const now=Date.now();
  const d7=new Date(now-7*24*60*60*1000);
  const d30=new Date(now-30*24*60*60*1000);

  let metrics={
    leads7:0,leads30:0,matched30:0,contacted30:0,closed30:0,
    handoffs30:0,opened30:0,quotes30:0,
    applications30:0,approvedApplications30:0,verifiedDealers:0,
    activeAffiliateLinks:0,affiliateClicks7:0,affiliateClicks30:0,
    offerClicks30:0
  };
  let topProducts:ProductClick[]=[];
  let topLeadModels:{label:string;count:number}[]=[];

  if(configured){
    try{
      const [leads,deliveries,applications,verifiedDealers,affiliateLinks,clicks]=await Promise.all([
        prisma.dealerLead.findMany({where:{createdAt:{gte:d30}},select:{make:true,model:true,status:true,matchedSellerSlugs:true,createdAt:true}}),
        prisma.dealerLeadDelivery.findMany({where:{createdAt:{gte:d30}},select:{status:true,createdAt:true,quoteResponse:{select:{id:true}}}}),
        prisma.dealerApplication.findMany({where:{createdAt:{gte:d30}},select:{status:true,createdAt:true}}),
        prisma.seller.count({where:{type:"dealer",status:"verified"}}),
        prisma.affiliateProductLink.findMany({where:{status:"active"},select:{productId:true}}),
        prisma.outboundClickEvent.findMany({where:{createdAt:{gte:d30}},select:{offerId:true,sourceOfferId:true,entityType:true,createdAt:true}})
      ]);

      metrics={
        leads7:leads.filter(item=>item.createdAt>=d7).length,
        leads30:leads.length,
        matched30:leads.filter(item=>item.matchedSellerSlugs.length>0).length,
        contacted30:leads.filter(item=>item.status==="contacted").length,
        closed30:leads.filter(item=>item.status==="closed").length,
        handoffs30:deliveries.length,
        opened30:deliveries.filter(item=>["opened","contacted","quoted","closed"].includes(item.status)).length,
        quotes30:deliveries.filter(item=>Boolean(item.quoteResponse)).length,
        applications30:applications.length,
        approvedApplications30:applications.filter(item=>item.status==="approved").length,
        verifiedDealers,
        activeAffiliateLinks:affiliateLinks.length,
        affiliateClicks7:clicks.filter(item=>item.entityType==="affiliate_product"&&item.createdAt>=d7).length,
        affiliateClicks30:clicks.filter(item=>item.entityType==="affiliate_product").length,
        offerClicks30:clicks.filter(item=>item.offerId!==null).length
      };

      const productMap=new Map<string,{clicks7:number;clicks30:number}>();
      for(const event of clicks){
        if(event.entityType!=="affiliate_product"||!event.sourceOfferId)continue;
        const current=productMap.get(event.sourceOfferId)||{clicks7:0,clicks30:0};
        current.clicks30+=1;
        if(event.createdAt>=d7)current.clicks7+=1;
        productMap.set(event.sourceOfferId,current);
      }
      topProducts=[...productMap.entries()].map(([productId,value])=>({productId,...value})).sort((a,b)=>b.clicks30-a.clicks30||b.clicks7-a.clicks7).slice(0,10);

      const modelMap=new Map<string,number>();
      for(const lead of leads){
        const label=`${lead.make} ${lead.model}`;
        modelMap.set(label,(modelMap.get(label)||0)+1);
      }
      topLeadModels=[...modelMap.entries()].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count).slice(0,10);
    }catch{
      ready=false;
    }
  }

  const leadMatchRate=metrics.leads30?Math.round((metrics.matched30/metrics.leads30)*100):0;
  const dealerContactRate=metrics.leads30?Math.round((metrics.contacted30/metrics.leads30)*100):0;
  const handoffOpenRate=metrics.handoffs30?Math.round((metrics.opened30/metrics.handoffs30)*100):0;
  const quoteResponseRate=metrics.handoffs30?Math.round((metrics.quotes30/metrics.handoffs30)*100):0;

  return <section className="page shell">
    <div className="page-head">
      <span className="entity-kicker">Operations</span>
      <h1>MotoIndex growth dashboard</h1>
      <p>Track the dealer funnel and affiliate commerce activity without mixing operational conversion metrics into public pages.</p>
      <div className="hero-actions">
        <Link className="button small" href="/admin/dealer-leads">Dealer leads</Link>
        <Link className="button ghost small" href="/admin/dealer-applications">Dealer applications</Link>
        <Link className="button ghost small" href="/admin/affiliate-links">Affiliate links</Link>
        <Link className="button ghost small" href="/admin/offers-review">Offers</Link>
      </div>
    </div>

    {!ready&&<div className="note-box"><h2>Growth database metrics are unavailable</h2><p>Apply the latest Prisma migrations to the production DATABASE_URL before using this dashboard. The public site remains fail-closed where a new runtime table is unavailable.</p></div>}

    <div className="growth-metric-grid">
      <article><span>Dealer leads · 7d</span><strong>{metrics.leads7}</strong><small>{metrics.leads30} in 30 days</small></article>
      <article><span>Lead match rate · 30d</span><strong>{leadMatchRate}%</strong><small>{metrics.matched30} matched requests</small></article>
      <article><span>Dealer contact rate · 30d</span><strong>{dealerContactRate}%</strong><small>{metrics.contacted30} contacted · {metrics.closed30} closed</small></article>
      <article><span>Secure handoff open rate</span><strong>{handoffOpenRate}%</strong><small>{metrics.opened30} of {metrics.handoffs30} handoffs</small></article>
      <article><span>Dealer quote response rate</span><strong>{quoteResponseRate}%</strong><small>{metrics.quotes30} private quotes · 30d</small></article>
      <article><span>Dealer applications · 30d</span><strong>{metrics.applications30}</strong><small>{metrics.approvedApplications30} approved</small></article>
      <article><span>Verified DB dealers</span><strong>{metrics.verifiedDealers}</strong><small>Approved persistent partners</small></article>
      <article><span>Active affiliate links</span><strong>{metrics.activeAffiliateLinks}</strong><small>Runtime database links</small></article>
      <article><span>Affiliate clicks · 7d</span><strong>{metrics.affiliateClicks7}</strong><small>{metrics.affiliateClicks30} in 30 days</small></article>
    </div>

    <div className="growth-dashboard-columns">
      <section className="growth-panel">
        <div className="section-head compact"><div><h2>Most requested motorcycles · 30 days</h2><p>Use this to prioritize dealer coverage and quote partnerships.</p></div></div>
        {topLeadModels.length?<div className="growth-ranking">{topLeadModels.map((item,index)=><div key={item.label}><b>#{index+1}</b><span>{item.label}</span><strong>{item.count}</strong></div>)}</div>:<p className="empty-copy">No dealer lead volume yet.</p>}
      </section>

      <section className="growth-panel">
        <div className="section-head compact"><div><h2>Top affiliate products · 30 days</h2><p>Clicks are anonymous product-level outbound events and do not include buyer contact fields.</p></div></div>
        {topProducts.length?<div className="growth-ranking">{topProducts.map((item,index)=><div key={item.productId}><b>#{index+1}</b><span>{item.productId}<small>{item.clicks7} clicks · 7d</small></span><strong>{item.clicks30}</strong></div>)}</div>:<p className="empty-copy">No affiliate clicks yet.</p>}
      </section>
    </div>

    <div className="note-box"><h2>What this dashboard does not claim</h2><p>Outbound clicks and dealer contacts are conversion signals, not confirmed revenue or motorcycle sales. Add commission or closed-sale values only when there is a verifiable settlement source.</p></div>
  </section>;
}

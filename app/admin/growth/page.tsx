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
    handoffs30:0,opened30:0,quotes30:0,interestedQuotes30:0,overdueHandoffs:0,undeliverableLeads:0,
    applications30:0,approvedApplications30:0,verifiedDealers:0,quoteEligibleDealers:0,
    activeAffiliateLinks:0,affiliateClicks7:0,affiliateClicks30:0,
    offerClicks30:0
  };
  let topProducts:ProductClick[]=[];
  let topLeadModels:{label:string;count:number}[]=[];
  let overdueHandoffs:{sellerName:string;modelLabel:string;buyerName:string;sharedAt:Date;hoursOpen:number}[]=[];
  let coverageGaps:{label:string;count:number}[]=[];
  let partnerPerformance:{sellerName:string;handoffs:number;quotes:number;interested:number;quoteRate:number}[]=[];

  if(configured){
    try{
      const [leads,deliveries,applications,verifiedDealers,quoteEligibleDealers,affiliateLinks,clicks]=await Promise.all([
        prisma.dealerLead.findMany({where:{createdAt:{gte:d30}},select:{make:true,model:true,cityProvince:true,status:true,matchedSellerSlugs:true,createdAt:true,deliveries:{select:{id:true}}}}),
        prisma.dealerLeadDelivery.findMany({where:{createdAt:{gte:d30}},select:{status:true,createdAt:true,sharedAt:true,sellerSlug:true,sellerName:true,quoteResponse:{select:{id:true,buyerDecision:true}},lead:{select:{make:true,model:true,fullName:true}}}}),
        prisma.dealerApplication.findMany({where:{createdAt:{gte:d30}},select:{status:true,createdAt:true}}),
        prisma.seller.count({where:{type:"dealer",status:"verified"}}),
        prisma.seller.count({where:{type:"dealer",status:"verified",leadEmail:{not:null}}}),
        prisma.affiliateProductLink.findMany({where:{status:"active"},select:{productId:true}}),
        prisma.outboundClickEvent.findMany({where:{createdAt:{gte:d30}},select:{offerId:true,sourceOfferId:true,entityType:true,createdAt:true}})
      ]);

      const slaCutoff=new Date(now-24*60*60*1000);
      const overdue=deliveries.filter(item=>item.sharedAt&&item.sharedAt<=slaCutoff&&!item.quoteResponse&&!["closed","cancelled","quoted"].includes(item.status));
      overdueHandoffs=overdue
        .map(item=>({
          sellerName:item.sellerName,
          modelLabel:`${item.lead.make} ${item.lead.model}`,
          buyerName:item.lead.fullName,
          sharedAt:item.sharedAt as Date,
          hoursOpen:Math.max(24,Math.floor((now-(item.sharedAt as Date).getTime())/(60*60*1000)))
        }))
        .sort((a,b)=>b.hoursOpen-a.hoursOpen)
        .slice(0,12);

      metrics={
        leads7:leads.filter(item=>item.createdAt>=d7).length,
        leads30:leads.length,
        matched30:leads.filter(item=>item.matchedSellerSlugs.length>0).length,
        contacted30:leads.filter(item=>item.status==="contacted").length,
        closed30:leads.filter(item=>item.status==="closed").length,
        handoffs30:deliveries.length,
        opened30:deliveries.filter(item=>["opened","contacted","quoted","closed"].includes(item.status)).length,
        quotes30:deliveries.filter(item=>Boolean(item.quoteResponse)).length,
        interestedQuotes30:deliveries.filter(item=>item.quoteResponse?.buyerDecision==="interested").length,
        overdueHandoffs:overdue.length,
        undeliverableLeads:leads.filter(item=>item.matchedSellerSlugs.length>0&&item.deliveries.length===0).length,
        applications30:applications.length,
        approvedApplications30:applications.filter(item=>item.status==="approved").length,
        verifiedDealers,
        quoteEligibleDealers,
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

      const gapMap=new Map<string,number>();
      for(const lead of leads.filter(item=>item.matchedSellerSlugs.length===0)){
        const label=`${lead.make} · ${lead.cityProvince}`;
        gapMap.set(label,(gapMap.get(label)||0)+1);
      }
      coverageGaps=[...gapMap.entries()].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label)).slice(0,10);

      const partnerMap=new Map<string,{sellerName:string;handoffs:number;quotes:number;interested:number}>();
      for(const delivery of deliveries){
        const current=partnerMap.get(delivery.sellerSlug)||{sellerName:delivery.sellerName,handoffs:0,quotes:0,interested:0};
        current.handoffs+=1;
        if(delivery.quoteResponse)current.quotes+=1;
        if(delivery.quoteResponse?.buyerDecision==="interested")current.interested+=1;
        partnerMap.set(delivery.sellerSlug,current);
      }
      partnerPerformance=[...partnerMap.values()]
        .map(item=>({...item,quoteRate:item.handoffs?Math.round((item.quotes/item.handoffs)*100):0}))
        .sort((a,b)=>b.interested-a.interested||b.quotes-a.quotes||b.quoteRate-a.quoteRate)
        .slice(0,10);
    }catch{
      ready=false;
    }
  }

  const leadMatchRate=metrics.leads30?Math.round((metrics.matched30/metrics.leads30)*100):0;
  const dealerContactRate=metrics.leads30?Math.round((metrics.contacted30/metrics.leads30)*100):0;
  const handoffOpenRate=metrics.handoffs30?Math.round((metrics.opened30/metrics.handoffs30)*100):0;
  const quoteResponseRate=metrics.handoffs30?Math.round((metrics.quotes30/metrics.handoffs30)*100):0;
  const buyerInterestRate=metrics.quotes30?Math.round((metrics.interestedQuotes30/metrics.quotes30)*100):0;

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
      <article><span>Buyer interest rate</span><strong>{buyerInterestRate}%</strong><small>{metrics.interestedQuotes30} interested quote responses</small></article>
      <article><span>Overdue dealer handoffs</span><strong>{metrics.overdueHandoffs}</strong><small>Shared 24h+ with no quote</small></article>
      <article><span>Matched but not deliverable</span><strong>{metrics.undeliverableLeads}</strong><small>Matched dealer, no secure contact path</small></article>
      <article><span>Dealer applications · 30d</span><strong>{metrics.applications30}</strong><small>{metrics.approvedApplications30} approved</small></article>
      <article><span>Verified DB dealers</span><strong>{metrics.verifiedDealers}</strong><small>Approved persistent partners</small></article>
      <article><span>Quote-capable partners</span><strong>{metrics.quoteEligibleDealers}</strong><small>Verified dealers with approved private lead contact</small></article>
      <article><span>Active affiliate links</span><strong>{metrics.activeAffiliateLinks}</strong><small>Runtime database links</small></article>
      <article><span>Affiliate clicks · 7d</span><strong>{metrics.affiliateClicks7}</strong><small>{metrics.affiliateClicks30} in 30 days</small></article>
    </div>

    <section className="growth-panel growth-sla-panel">
      <div className="section-head compact"><div><h2>Dealer response SLA queue</h2><p>Shared buyer requests with no structured quote after 24 hours. Work the oldest handoffs first.</p></div><Link className="text-link" href="/admin/dealer-leads">Open dealer leads →</Link></div>
      {overdueHandoffs.length?<div className="growth-ranking">{overdueHandoffs.map((item,index)=><div key={`${item.sellerName}-${item.sharedAt.toISOString()}-${index}`}><b>#{index+1}</b><span>{item.modelLabel}<small>{item.sellerName} · buyer {item.buyerName}</small></span><strong>{item.hoursOpen}h</strong></div>)}</div>:<p className="empty-copy">No dealer handoffs are past the 24-hour quote-response target.</p>}
    </section>

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

    <div className="growth-dashboard-columns">
      <section className="growth-panel">
        <div className="section-head compact"><div><h2>Dealer coverage gaps · 30 days</h2><p>Buyer demand where no quote-capable dealer partner matched the motorcycle brand and location.</p></div></div>
        {coverageGaps.length?<div className="growth-ranking">{coverageGaps.map((item,index)=><div key={item.label}><b>#{index+1}</b><span>{item.label}</span><strong>{item.count}</strong></div>)}</div>:<p className="empty-copy">No unmatched dealer-demand gaps in the last 30 days.</p>}
      </section>

      <section className="growth-panel">
        <div className="section-head compact"><div><h2>Dealer partner performance · 30 days</h2><p>Internal response signals only. Do not treat this as a public dealer ranking.</p></div></div>
        {partnerPerformance.length?<div className="partner-performance-table">{partnerPerformance.map((item,index)=><div key={item.sellerName}><b>#{index+1}</b><span>{item.sellerName}<small>{item.handoffs} handoffs · {item.quotes} quotes · {item.interested} interested</small></span><strong>{item.quoteRate}%</strong></div>)}</div>:<p className="empty-copy">No dealer handoff performance data yet.</p>}
      </section>
    </div>

    <div className="note-box"><h2>What this dashboard does not claim</h2><p>Outbound clicks and dealer contacts are conversion signals, not confirmed revenue or motorcycle sales. Add commission or closed-sale values only when there is a verifiable settlement source.</p></div>
  </section>;
}

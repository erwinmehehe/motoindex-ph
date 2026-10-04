import type { Metadata } from "next";
import Link from "next/link";
import { DealerPortalSignIn } from "@/components/DealerPortalSignIn";
import { DealerPortalSignOut } from "@/components/DealerPortalSignOut";
import { DealerInventoryManager } from "@/components/DealerInventoryManager";
import { getDealerSession, dealerAuthConfigured } from "@/lib/dealerAuth";
import { publicMotorcycles } from "@/lib/data";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/ui";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Dealer Portal | MotoIndex Philippines",description:"Private MotoIndex workspace for approved motorcycle dealers.",robots:{index:false,follow:false,noarchive:true}};

export default async function DealerPortalPage(){
  const session=await getDealerSession();
  if(!session){
    return <main className="page shell">
      <PageHero kicker="MotoIndex Dealer Portal" title="Manage dealer inventory and buyer requests." description="Approved MotoIndex dealers can publish current inventory, keep offers fresh, and review matched buyer requests from one private workspace." actions={<Link className="button ghost" href="/dealers/join">Apply for dealer listing</Link>}/>
      {dealerAuthConfigured()?<DealerPortalSignIn/>:<div className="note-box"><h2>Dealer Portal is not enabled on this deployment yet</h2><p>The database, email sender and DEALER_PORTAL_ENABLED setting must be configured before dealer sign-in is available.</p></div>}
    </main>;
  }

  const memberships=session.account.memberships.filter(item=>item.seller.status==="verified");
  const sellerIds=memberships.map(item=>item.sellerId);
  const sellerSlugs=memberships.map(item=>item.seller.slug);
  const now=new Date();
  const [offers,deliveries]=await Promise.all([
    prisma.sellerOffer.findMany({
      where:{sellerId:{in:sellerIds},publicationSource:"dealer_portal",status:"dealer_published",OR:[{expiresAt:null},{expiresAt:{gt:now}}]},
      include:{seller:{select:{name:true}}},
      orderBy:{updatedAt:"desc"},take:200
    }),
    prisma.dealerLeadDelivery.findMany({
      where:{sellerSlug:{in:sellerSlugs},status:{not:"cancelled"},expiresAt:{gt:now}},
      include:{lead:true,quoteResponse:true},
      orderBy:{createdAt:"desc"},take:100
    })
  ]);

  const modelMap=new Map(publicMotorcycles.map(model=>[model.id,`${model.make} ${model.model}`]));
  const inventory=offers.map(offer=>({
    id:offer.id,sellerId:offer.sellerId,sellerName:offer.seller.name,modelLabel:modelMap.get(offer.entityId)||offer.entityId,
    variantLabel:offer.variantLabel,colorLabel:offer.colorLabel,pricePhp:offer.pricePhp?Number(offer.pricePhp):null,
    downPaymentPhp:offer.downPaymentPhp?Number(offer.downPaymentPhp):null,monthlyPhp:offer.monthlyPhp?Number(offer.monthlyPhp):null,
    termMonths:offer.termMonths,availability:offer.availability,promoLabel:offer.promoLabel,
    expiresAt:offer.expiresAt?.toISOString()||null,observedAt:offer.observedAt.toISOString().slice(0,10)
  }));

  return <main className="page shell">
    <PageHero kicker="MotoIndex Dealer Portal" title="Dealer workspace" description={`Signed in as ${session.account.email}. Manage ${memberships.length} verified branch${memberships.length===1?"":"es"}, current motorcycle inventory and matched buyer requests.`} actions={<DealerPortalSignOut/>}/>
    <div className="health-summary">
      <div><span>Verified branches</span><strong>{memberships.length}</strong></div>
      <div><span>Current inventory</span><strong>{offers.length}</strong></div>
      <div><span>Active buyer requests</span><strong>{deliveries.length}</strong></div>
      <div><span>Quotes sent</span><strong>{deliveries.filter(item=>Boolean(item.quoteResponse)).length}</strong></div>
    </div>

    <DealerInventoryManager
      branches={memberships.map(item=>({id:item.sellerId,name:item.seller.name}))}
      models={publicMotorcycles.filter(model=>model.marketStatus!=="previous"&&model.marketStatus!=="discontinued").map(model=>({id:model.id,label:`${model.make} ${model.model}`})).sort((a,b)=>a.label.localeCompare(b.label))}
      offers={inventory}
    />

    <section className="dealer-portal-leads">
      <div className="section-head compact"><div><span className="section-kicker">Buyer requests</span><h2>Matched leads and quote status</h2><p>Only requests routed to branches attached to this account appear here.</p></div></div>
      <div className="dealer-application-list">
        {deliveries.map(delivery=><article className="dealer-application-card" key={delivery.id}>
          <div className="dealer-application-main">
            <span>{delivery.status} · {delivery.createdAt.toISOString().slice(0,10)}</span>
            <h3>{delivery.lead.make} {delivery.lead.model}{delivery.lead.variant?` · ${delivery.lead.variant}`:""}</h3>
            <p>{delivery.sellerName} · {delivery.lead.cityProvince} · {delivery.lead.purchaseType}</p>
            <small>{delivery.quoteResponse?"Structured quote submitted":"Quote not submitted yet"} · secure handoff expires {delivery.expiresAt.toISOString().slice(0,10)}</small>
          </div>
          <div className="dealer-review-actions"><Link className="button small" href={`/dealer-lead/${delivery.deliveryToken}`}>{delivery.quoteResponse?"Review quote":"Open buyer request"}</Link></div>
        </article>)}
        {!deliveries.length&&<div className="note-box"><h3>No active matched buyer requests</h3><p>New requests appear here only after MotoIndex matches the buyer to one of your verified branches.</p></div>}
      </div>
    </section>
  </main>;
}

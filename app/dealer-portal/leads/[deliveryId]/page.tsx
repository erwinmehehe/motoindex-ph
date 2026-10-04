import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealerSession } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";
import { DealerLeadPortal } from "@/components/DealerLeadPortal";
import { DealerQuoteResponseForm } from "@/components/DealerQuoteResponseForm";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Dealer Lead Workspace",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

export default async function DealerPortalLeadPage({params}:{params:Promise<{deliveryId:string}>}){
  const session=await getDealerSession();
  if(!session)return notFound();
  const {deliveryId}=await params;
  const slugs=new Set(session.account.memberships.map(item=>item.seller.slug));
  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{id:deliveryId},include:{lead:true,quoteResponse:true}});
  if(!delivery||!slugs.has(delivery.sellerSlug)||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return notFound();
  const lead=delivery.lead;
  return <main className="page shell secure-lead-page">
    <div className="page-head"><span className="entity-kicker">Dealer Portal lead workspace</span><h1>{lead.make} {lead.model} buyer request</h1><p>Private workspace for {delivery.sellerName}. This lead expires on {delivery.expiresAt.toISOString().slice(0,10)}.</p></div>
    <div className="secure-lead-grid">
      <article><span>Buyer</span><strong>{lead.fullName}</strong><p>{lead.cityProvince}</p></article>
      <article><span>Mobile</span><strong><a href={`tel:${lead.mobile}`}>{lead.mobile}</a></strong><p>Use only for this motorcycle request.</p></article>
      <article><span>Email</span><strong>{lead.email?<a href={`mailto:${lead.email}`}>{lead.email}</a>:"Not provided"}</strong><p>Optional buyer contact field.</p></article>
      <article><span>Motorcycle</span><strong>{lead.make} {lead.model}</strong><p>{lead.variant||"Variant not specified"}</p></article>
      <article><span>Buying method</span><strong>{lead.purchaseType}</strong><p>{lead.downPaymentBudget?`Down payment budget: ${php(lead.downPaymentBudget)}`:"No down-payment budget provided"}</p></article>
      <article><span>Request received</span><strong>{lead.createdAt.toISOString().slice(0,10)}</strong><p>MotoIndex matched this request to {delivery.sellerName}.</p></article>
    </div>
    <div className="note-box"><h2>Buyer privacy</h2><p>Use these details only to respond to this motorcycle request. Do not publish or redistribute them.</p></div>
    <DealerQuoteResponseForm endpoint={`/api/dealer-portal/leads/${delivery.id}/quote`} initial={delivery.quoteResponse?{
      cashPricePhp:delivery.quoteResponse.cashPricePhp?Number(delivery.quoteResponse.cashPricePhp):null,
      downPaymentPhp:delivery.quoteResponse.downPaymentPhp?Number(delivery.quoteResponse.downPaymentPhp):null,
      monthlyPhp:delivery.quoteResponse.monthlyPhp?Number(delivery.quoteResponse.monthlyPhp):null,
      termMonths:delivery.quoteResponse.termMonths,
      availability:delivery.quoteResponse.availability,
      validUntil:delivery.quoteResponse.validUntil?.toISOString()||null,
      dealerNote:delivery.quoteResponse.dealerNote||""
    }:undefined}/>
    <DealerLeadPortal endpoint={`/api/dealer-portal/leads/${delivery.id}`} initialStatus={delivery.status}/>
  </main>;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealerSession } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";
import { DealerLeadPortal } from "@/components/DealerLeadPortal";
import { DealerQuoteResponseForm } from "@/components/DealerQuoteResponseForm";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Dealer Buyer Request | MotoIndex",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

export default async function DealerPortalLeadPage({params}:{params:Promise<{deliveryId:string}>}){
  const session=await getDealerSession();
  if(!session)return notFound();
  const {deliveryId}=await params;
  const delivery=await prisma.dealerLeadDelivery.findUnique({
    where:{id:deliveryId},
    include:{lead:true,quoteResponse:true}
  });
  if(!delivery||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return notFound();
  const allowed=session.account.memberships.some(item=>item.seller.slug===delivery.sellerSlug&&item.seller.status==="verified");
  if(!allowed)return notFound();
  const lead=delivery.lead;
  const endpoint=`/api/dealer-portal/leads/${delivery.id}`;

  return <section className="page shell secure-lead-page">
    <div className="page-head"><span className="entity-kicker">MotoIndex Dealer Portal</span><h1>{lead.make} {lead.model} buyer request</h1><p>Matched to {delivery.sellerName}. Buyer details are available only to verified dealer accounts assigned to this branch.</p></div>
    <div className="secure-lead-grid">
      <article><span>Buyer</span><strong>{lead.fullName}</strong><p>{lead.cityProvince}</p></article>
      <article><span>Mobile</span><strong><a href={`tel:${lead.mobile}`}>{lead.mobile}</a></strong><p>Use only for this motorcycle request.</p></article>
      <article><span>Email</span><strong>{lead.email?<a href={`mailto:${lead.email}`}>{lead.email}</a>:"Not provided"}</strong><p>Optional buyer contact field.</p></article>
      <article><span>Motorcycle</span><strong>{lead.make} {lead.model}</strong><p>{lead.variant||"Variant not specified"}</p></article>
      <article><span>Buying method</span><strong>{lead.purchaseType}</strong><p>{lead.downPaymentBudget?`Down payment budget: ${php(lead.downPaymentBudget)}`:"No down-payment budget provided"}</p></article>
      <article><span>Request received</span><strong>{lead.createdAt.toISOString().slice(0,10)}</strong><p>Secure dealer access expires {delivery.expiresAt.toISOString().slice(0,10)}.</p></article>
    </div>
    <div className="note-box"><h2>Buyer privacy</h2><p>Use these details only to respond to this motorcycle request. Do not publish, resell, or redistribute buyer information.</p></div>
    <DealerQuoteResponseForm endpoint={`${endpoint}/quote`} initial={delivery.quoteResponse?{
      cashPricePhp:delivery.quoteResponse.cashPricePhp?Number(delivery.quoteResponse.cashPricePhp):null,
      downPaymentPhp:delivery.quoteResponse.downPaymentPhp?Number(delivery.quoteResponse.downPaymentPhp):null,
      monthlyPhp:delivery.quoteResponse.monthlyPhp?Number(delivery.quoteResponse.monthlyPhp):null,
      termMonths:delivery.quoteResponse.termMonths,
      availability:delivery.quoteResponse.availability,
      validUntil:delivery.quoteResponse.validUntil?.toISOString()||null,
      dealerNote:delivery.quoteResponse.dealerNote||""
    }:undefined}/>
    <DealerLeadPortal endpoint={endpoint} initialStatus={delivery.status}/>
  </section>;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { databaseConfigured, prisma } from "@/lib/db";
import { DealerLeadPortal } from "@/components/DealerLeadPortal";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Secure Buyer Lead",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

export default async function DealerLeadPage({params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return notFound();
  const {token}=await params;
  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{deliveryToken:token},include:{lead:true}});
  if(!delivery||delivery.status==="pending"||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return notFound();
  const lead=delivery.lead;

  return <section className="page shell secure-lead-page">
    <div className="page-head"><span className="entity-kicker">Secure MotoIndex buyer request</span><h1>{lead.make} {lead.model} dealer lead</h1><p>This page is available only through the secure dealer handoff link and expires on {delivery.expiresAt.toISOString().slice(0,10)}.</p></div>

    <div className="secure-lead-grid">
      <article><span>Buyer</span><strong>{lead.fullName}</strong><p>{lead.cityProvince}</p></article>
      <article><span>Mobile</span><strong><a href={`tel:${lead.mobile}`}>{lead.mobile}</a></strong><p>Use only for this motorcycle request.</p></article>
      <article><span>Email</span><strong>{lead.email?<a href={`mailto:${lead.email}`}>{lead.email}</a>:"Not provided"}</strong><p>Optional buyer contact field.</p></article>
      <article><span>Motorcycle</span><strong>{lead.make} {lead.model}</strong><p>{lead.variant||"Variant not specified"}</p></article>
      <article><span>Buying method</span><strong>{lead.purchaseType}</strong><p>{lead.downPaymentBudget?`Down payment budget: ${php(lead.downPaymentBudget)}`:"No down-payment budget provided"}</p></article>
      <article><span>Request received</span><strong>{lead.createdAt.toISOString().slice(0,10)}</strong><p>MotoIndex matched this request to {delivery.sellerName}.</p></article>
    </div>

    <div className="note-box"><h2>Handle this buyer information carefully</h2><p>The buyer consented to MotoIndex storing this request and sharing it with a relevant verified dealer. Use the details only to respond to this motorcycle request, and do not publish or redistribute them.</p></div>
    <DealerLeadPortal token={token} initialStatus={delivery.status}/>
  </section>;
}

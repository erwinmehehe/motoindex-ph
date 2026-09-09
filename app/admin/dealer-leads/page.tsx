// @ts-nocheck
import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { DealerLeadStatus } from "@/components/DealerLeadStatus";
import { DealerLeadDeliveryControl } from "@/components/DealerLeadDeliveryControl";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Dealer Leads",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function DealerLeadsAdmin(){
  const leads=databaseConfigured()?await prisma.dealerLead.findMany({orderBy:{createdAt:"desc"},take:100,include:{deliveries:{orderBy:{createdAt:"asc"},include:{quoteResponse:true}}}}):[];
  return <section className="page shell">
    <div className="page-head"><h1>Dealer lead review</h1><p>Buyer requests from the model quote funnel. This route is protected by MotoIndex admin Basic Auth and excluded from indexing.</p><div className="hero-actions"><a className="button small" href="/api/admin/dealer-leads/export">Export CSV</a><a className="button ghost small" href="/admin/dealer-applications">Dealer applications</a></div></div>
    <div className="health-summary"><div><span>Recent leads</span><strong>{leads.length}</strong></div><div><span>Matched</span><strong>{leads.filter(l=>l.matchedSellerSlugs.length>0).length}</strong></div><div><span>Secure handoffs</span><strong>{leads.reduce((sum,l)=>sum+l.deliveries.length,0)}</strong></div><div><span>Dealer quotes</span><strong>{leads.reduce((sum,l)=>sum+l.deliveries.filter(d=>Boolean(d.quoteResponse)).length,0)}</strong></div></div>
    {!databaseConfigured()?<div className="note-box"><h2>Production database is not configured</h2><p>Set DATABASE_URL and run the Prisma migrations before enabling dealer lead collection.</p></div>:
    leads.length===0?<div className="note-box"><h2>No dealer leads yet</h2><p>Requests will appear here after the production database is configured and buyers submit the model quote form.</p></div>:
    <div className="admin-table dealer-lead-admin">
      <div className="admin-row dealer-lead-head"><span>Buyer / motorcycle</span><span>Contact</span><span>Buying plan</span><span>Dealer match</span><span>Status</span></div>
      {leads.map(lead=><div className="dealer-lead-review-row" key={lead.id}>
        <div className="admin-row">
          <span><b>{lead.fullName}</b><small>{lead.make} {lead.model}{lead.variant?` · ${lead.variant}`:""} · {lead.cityProvince}</small><small>{lead.createdAt.toISOString().slice(0,16).replace("T"," ")}</small></span>
          <span><b>{lead.mobile}</b><small>{lead.email||"No email"}</small></span>
          <span><b>{lead.purchaseType}</b><small>{lead.downPaymentBudget?php(lead.downPaymentBudget):"No down-payment budget"}</small></span>
          <span><b>{lead.matchedSellerSlugs.length}</b><small>{lead.matchedSellerSlugs.join(", ")||"No dealer match"}</small></span>
          <span><DealerLeadStatus id={lead.id} current={lead.status}/></span>
        </div>
        <div className="dealer-lead-deliveries">
          {lead.deliveries.length?lead.deliveries.map(delivery=><div className="dealer-lead-delivery-stack" key={delivery.id}>
            <DealerLeadDeliveryControl
              leadId={lead.id}
              deliveryId={delivery.id}
              dealerEmail={delivery.dealerEmail}
              sellerName={delivery.sellerName}
              token={delivery.deliveryToken}
              status={delivery.status}
              expiresAt={delivery.expiresAt.toISOString()}
              buyerName={lead.fullName}
              modelLabel={`${lead.make} ${lead.model}`}
            />
            {delivery.quoteResponse&&<div className="dealer-quote-admin-summary">
              <span>Private dealer quote</span>
              <strong>{delivery.quoteResponse.cashPricePhp?php(Number(delivery.quoteResponse.cashPricePhp)):"No cash price"}</strong>
              <small>{delivery.quoteResponse.monthlyPhp?`${php(Number(delivery.quoteResponse.downPaymentPhp||0))} down · ${php(Number(delivery.quoteResponse.monthlyPhp))}/mo · ${delivery.quoteResponse.termMonths||"—"} months`:"No installment quote"}</small>
              <small>{delivery.quoteResponse.availability} · submitted {delivery.quoteResponse.submittedAt.toISOString().slice(0,10)}</small>
              {delivery.quoteResponse.validUntil&&<small>Valid until {delivery.quoteResponse.validUntil.toISOString().slice(0,10)}</small>}
              {delivery.quoteResponse.buyerDecision&&<small className={`buyer-decision ${delivery.quoteResponse.buyerDecision}`}>Buyer response: {delivery.quoteResponse.buyerDecision==="interested"?"Interested":"Not for me"}{delivery.quoteResponse.buyerDecisionAt?` · ${delivery.quoteResponse.buyerDecisionAt.toISOString().slice(0,10)}`:""}</small>}
              {delivery.quoteResponse.dealerNote&&<p>{delivery.quoteResponse.dealerNote}</p>}
            </div>}
          </div>):<div className="lead-delivery-empty"><strong>No secure partner handoff available</strong><small>{lead.matchedSellerSlugs.length?"Matched dealer records do not have an approved private lead email yet.":"No verified dealer matched this request."}</small></div>}
        </div>
      </div>)}
    </div>}
  </section>;
}

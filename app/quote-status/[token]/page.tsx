import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { databaseConfigured, prisma } from "@/lib/db";
import { php } from "@/lib/utils";
import { getModelById } from "@/lib/data";

export const metadata:Metadata={title:"Private Quote Status",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

function statusLabel(value:string){
  if(value==="new")return "Request received";
  if(value==="matched")return "Dealer match found";
  if(value==="ready")return "Waiting for dealer";
  if(value==="opened")return "Dealer opened request";
  if(value==="contacted")return "Dealer contacted buyer";
  if(value==="quoted")return "Quote received";
  if(value==="closed")return "Closed";
  return "In progress";
}

function availabilityLabel(value:string){
  if(value==="in_stock")return "In stock";
  if(value==="limited")return "Limited stock";
  if(value==="preorder")return "Pre-order / reservation";
  if(value==="out_of_stock")return "Out of stock";
  return "Confirm with dealer";
}

export default async function QuoteStatusPage({params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return notFound();
  const {token}=await params;
  const lead=await prisma.dealerLead.findUnique({
    where:{buyerAccessToken:token},
    include:{deliveries:{orderBy:{createdAt:"asc"},include:{quoteResponse:true}}}
  });
  if(!lead||!lead.buyerAccessExpiresAt||lead.buyerAccessExpiresAt<=new Date())return notFound();

  const model=getModelById(lead.modelExternalId);
  const quotes=lead.deliveries.filter(delivery=>delivery.quoteResponse&&delivery.status!=="cancelled");
  const activeHandoffs=lead.deliveries.filter(delivery=>delivery.status!=="cancelled");
  const waiting=Math.max(0,activeHandoffs.length-quotes.length);

  return <section className="page shell buyer-quote-status">
    <div className="page-head">
      <span className="entity-kicker">Private dealer quote status</span>
      <h1>{lead.make} {lead.model}</h1>
      <p>Your request for {lead.cityProvince}. This private link expires on {lead.buyerAccessExpiresAt.toISOString().slice(0,10)}.</p>
    </div>

    <div className="buyer-status-summary">
      <article><span>Request status</span><strong>{statusLabel(lead.status)}</strong><small>Submitted {lead.createdAt.toISOString().slice(0,10)}</small></article>
      <article><span>Matched dealers</span><strong>{lead.matchedSellerSlugs.length}</strong><small>{activeHandoffs.length} secure handoffs prepared</small></article>
      <article><span>Quotes received</span><strong>{quotes.length}</strong><small>{waiting} still waiting</small></article>
      <article><span>Buying method</span><strong>{lead.purchaseType}</strong><small>{lead.variant||"Variant not specified"}</small></article>
    </div>

    {quotes.length?<section className="buyer-quote-list">
      <div className="section-head compact"><div><h2>Dealer quote responses</h2><p>These are buyer-specific responses from matched verified dealers. They are not public MotoIndex price records.</p></div></div>
      {quotes.map(delivery=>{const quote=delivery.quoteResponse!;return <article className="buyer-quote-card" key={delivery.id}>
        <div className="buyer-quote-card-head">
          <div><span>Verified dealer response</span><h3>{delivery.sellerName}</h3><p>{availabilityLabel(quote.availability)}</p></div>
          <div className="buyer-quote-price"><strong>{quote.cashPricePhp?php(Number(quote.cashPricePhp)):"Installment quote"}</strong><small>{quote.cashPricePhp?"Cash price":"No cash price supplied"}</small></div>
        </div>
        {quote.monthlyPhp&&<div className="buyer-finance-strip">
          <span><small>Down payment</small><strong>{php(Number(quote.downPaymentPhp||0))}</strong></span>
          <span><small>Monthly</small><strong>{php(Number(quote.monthlyPhp))}</strong></span>
          <span><small>Term</small><strong>{quote.termMonths||"—"} months</strong></span>
        </div>}
        <div className="buyer-quote-meta">
          <small>Submitted {quote.submittedAt.toISOString().slice(0,10)}</small>
          {quote.validUntil&&<small>Valid until {quote.validUntil.toISOString().slice(0,10)}</small>}
        </div>
        {quote.dealerNote&&<p className="buyer-quote-note">{quote.dealerNote}</p>}
      </article>})}
    </section>:<div className="note-box"><h2>No dealer quote has been submitted yet</h2><p>{activeHandoffs.length?"Your request has been prepared for matched dealer partners. Return to this private link later to check for a structured response.":"There is no secure dealer handoff available for this request yet."}</p></div>}

    <div className="note-box"><h2>Before you reserve a motorcycle</h2><p>Confirm the exact variant, final cash price, registration and insurance charges, financing assumptions, stock, color and release timing directly with the dealer. A buyer-specific quote can change after its stated validity period.</p></div>

    <div className="hero-actions">
      {model&&<Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Back to motorcycle research</Link>}
      <Link className="button ghost" href="/dealers">Browse dealers</Link>
    </div>
    <small className="buyer-private-link-note">Keep this URL private. Anyone with the link can view these quote responses until it expires.</small>
  </section>;
}

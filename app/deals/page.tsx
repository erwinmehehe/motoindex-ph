import type { Metadata } from "next";
import Link from "next/link";
import { sourceBackedCommerceOffers, compareCommerceOffers, commerceOfferFreshness, isFreshCommerceOffer } from "@/lib/commerceOffers";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";
import { OfferOutboundLink } from "@/components/OfferOutboundLink";
import { entityHref, entityLabel } from "@/lib/entities";

export const dynamic="force-static";
const offers=sourceBackedCommerceOffers.filter(offer=>isFreshCommerceOffer(offer)).sort((a,b)=>compareCommerceOffers(a,b));
const merchants=new Set(offers.map(offer=>offer.sellerName));
export const metadata:Metadata=pageMetadata({title:"Current Motorcycle & Gear Seller Offers Philippines",description:"Browse fresh, attributable motorcycle and riding-gear seller offers in the Philippines. Check current price, finance terms, stock and the original merchant.",path:"/deals",index:offers.length>=3&&merchants.size>=2});

export default function DealsPage(){
  const motorcycleOffers=offers.filter(offer=>offer.entityType==="motorcycle"); const gearOffers=offers.filter(offer=>offer.entityType!=="motorcycle");
  return <section className="page shell current-offers-page"><div className="page-head"><span className="entity-kicker">Current seller offers</span><h1>Fresh motorcycle and gear offers in the Philippines</h1><p>These are recent, attributable seller observations that still pass MotoIndex freshness checks. An offer is not automatically a discount; compare it with the product or motorcycle page before buying.</p></div>
    <div className="buyer-status-summary current-offer-summary"><article><span>Fresh offers</span><strong>{offers.length}</strong><small>Only current verified rows</small></article><article><span>Merchants</span><strong>{merchants.size}</strong><small>Distinct attributable sellers</small></article><article><span>Motorcycles</span><strong>{motorcycleOffers.length}</strong><small>Current dealer/seller offers</small></article><article><span>Gear</span><strong>{gearOffers.length}</strong><small>Helmets, tires and top boxes</small></article></div>
    {offers.length?<div className="current-offer-list">{offers.map(offer=>{const label=entityLabel(offer.entityType,offer.entityId);const freshness=commerceOfferFreshness(offer);return <article className="current-offer-card" key={offer.id}><div className="current-offer-copy"><span>{offer.entityType}</span><h2>{label}</h2><p>{offer.sellerName} · {offer.availability}</p><div className="current-offer-meta"><small>{freshness.label}</small><small>Observed {offer.observedAt}</small></div></div><div className="current-offer-price"><strong>{offer.pricePhp?php(offer.pricePhp):"Ask seller"}</strong>{offer.monthlyPhp?<small>{php(offer.monthlyPhp)}/mo · {offer.termMonths||"—"} months{offer.downpaymentPhp?` · DP ${php(offer.downpaymentPhp)}`:""}</small>:<small>Finance terms not listed</small>}</div><div className="current-offer-actions"><Link className="button ghost small" href={entityHref(offer.entityType,offer.entityId)}>Research item</Link><OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={Boolean(offer.affiliateUrl)}/></div></article>})}</div>:<div className="note-box"><h2>No fresh public seller offers are available right now</h2><p>MotoIndex does not fill this page with demo rows or stale merchant prices. Use the motorcycle and gear research pages while current offers are being verified.</p><div className="hero-actions"><Link className="button small" href="/motorcycles">Motorcycle prices</Link><Link className="button ghost small" href="/catalog">Gear catalog</Link></div></div>}
    <div className="note-box"><h2>Before treating an offer as a deal</h2><p>Check the exact model or SKU, variant or size, stock, registration or shipping charges, financing assumptions and final checkout total.</p></div>
  </section>;
}

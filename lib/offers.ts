import type { OfferEntityType, OfferStatus, SellerOffer, PriceObservation } from "./types";

// v0.6 demo offer data. Nothing in this file should be presented as a live seller price
// until status is changed to "verified" with a current source and verified timestamp.
export const sellerOffers: SellerOffer[] = [
  { id:"demo-aerox-dealer-a", entityType:"motorcycle", entityId:"yamaha-aerox-v3", sellerName:"Demo Yamaha Dealer A", sellerSlug:"demo-yamaha-dealer-a", sellerType:"dealer", pricePhp:125900, downpaymentPhp:25000, monthlyPhp:5850, termMonths:24, availability:"Demo availability", status:"demo", observedAt:"2026-08-20", note:"Illustrative dealer offer used to validate the offer table and financing UX." },
  { id:"demo-aerox-dealer-b", entityType:"motorcycle", entityId:"yamaha-aerox-v3", sellerName:"Demo Multi-brand Dealer", sellerSlug:"demo-multibrand-dealer", sellerType:"dealer", pricePhp:127500, downpaymentPhp:18000, monthlyPhp:6290, termMonths:24, availability:"Demo availability", status:"demo", observedAt:"2026-08-18", note:"Sample only — not a live quote." },
  { id:"demo-nmax-dealer-a", entityType:"motorcycle", entityId:"yamaha-nmax-v3", sellerName:"Demo Yamaha Dealer B", sellerSlug:"demo-yamaha-dealer-b", sellerType:"dealer", pricePhp:151900, downpaymentPhp:30000, monthlyPhp:7100, termMonths:24, availability:"Demo availability", status:"demo", observedAt:"2026-08-21", note:"Sample only — verify dealer pricing, fees and financing before publication." },
  { id:"demo-adv160-dealer-a", entityType:"motorcycle", entityId:"honda-adv-160", sellerName:"Demo Honda Dealer A", sellerSlug:"demo-honda-dealer-a", sellerType:"dealer", pricePhp:167400, downpaymentPhp:33000, monthlyPhp:7800, termMonths:24, availability:"Demo availability", status:"demo", observedAt:"2026-08-21", note:"Sample only — not a current dealer quote." },
  { id:"demo-shoei-nxr2-retailer-a", entityType:"helmet", entityId:"shoei-nxr2", sellerName:"Demo Gear Retailer", sellerSlug:"demo-gear-retailer", sellerType:"retailer", pricePhp:31500, availability:"Demo stock", status:"demo", observedAt:"2026-08-19", note:"Illustrative retail offer. Replace with a verified PH retailer feed or manual check." },
  { id:"demo-hjc-c10-retailer-a", entityType:"helmet", entityId:"hjc-c10", sellerName:"Demo Helmet Shop", sellerSlug:"demo-helmet-shop", sellerType:"retailer", pricePhp:7200, availability:"Demo stock", status:"demo", observedAt:"2026-08-17", note:"Illustrative retail offer only." },
  { id:"demo-city-grip2-retailer-a", entityType:"tire", entityId:"michelin-city-grip-2", sellerName:"Demo Tire Retailer", sellerSlug:"demo-tire-retailer", sellerType:"retailer", pricePhp:2950, availability:"Demo size-dependent price", status:"demo", observedAt:"2026-08-16", note:"Illustrative starting price. Real tire price must be stored per size/SKU." },
  { id:"demo-angel-scooter-retailer-a", entityType:"tire", entityId:"pirelli-angel-scooter", sellerName:"Demo Tire Shop", sellerSlug:"demo-tire-shop", sellerType:"retailer", pricePhp:2600, availability:"Demo size-dependent price", status:"demo", observedAt:"2026-08-15", note:"Illustrative starting price. Real price varies by size." },
  { id:"demo-givi-b32n-retailer-a", entityType:"topbox", entityId:"givi-b32n", sellerName:"Demo Accessories Shop", sellerSlug:"demo-accessories-shop", sellerType:"retailer", pricePhp:4800, availability:"Demo stock", status:"demo", observedAt:"2026-08-14", note:"Box-only sample price. Rack/plate/bracket may be separate." },
  { id:"expired-sh39-retailer-a", entityType:"topbox", entityId:"shad-sh39", sellerName:"Legacy Demo Seller", sellerType:"retailer", pricePhp:6200, availability:"Unknown", status:"expired", observedAt:"2026-07-01", note:"Expired example used to demonstrate automatic suppression from public offer tables." }
];

export const priceObservations: PriceObservation[] = [
  { entityType:"motorcycle", entityId:"yamaha-aerox-v3", sellerName:"Demo Yamaha Dealer A", pricePhp:127900, observedAt:"2026-06-18", status:"demo" },
  { entityType:"motorcycle", entityId:"yamaha-aerox-v3", sellerName:"Demo Yamaha Dealer A", pricePhp:126900, observedAt:"2026-07-19", status:"demo" },
  { entityType:"motorcycle", entityId:"yamaha-aerox-v3", sellerName:"Demo Yamaha Dealer A", pricePhp:125900, observedAt:"2026-08-20", status:"demo" },
  { entityType:"helmet", entityId:"shoei-nxr2", sellerName:"Demo Gear Retailer", pricePhp:32900, observedAt:"2026-06-10", status:"demo" },
  { entityType:"helmet", entityId:"shoei-nxr2", sellerName:"Demo Gear Retailer", pricePhp:31900, observedAt:"2026-07-12", status:"demo" },
  { entityType:"helmet", entityId:"shoei-nxr2", sellerName:"Demo Gear Retailer", pricePhp:31500, observedAt:"2026-08-19", status:"demo" },
  { entityType:"tire", entityId:"michelin-city-grip-2", sellerName:"Demo Tire Retailer", pricePhp:3100, observedAt:"2026-06-08", status:"demo" },
  { entityType:"tire", entityId:"michelin-city-grip-2", sellerName:"Demo Tire Retailer", pricePhp:3050, observedAt:"2026-07-13", status:"demo" },
  { entityType:"tire", entityId:"michelin-city-grip-2", sellerName:"Demo Tire Retailer", pricePhp:2950, observedAt:"2026-08-16", status:"demo" }
];

export function getOffersForEntity(entityType: OfferEntityType, entityId: string, includeExpired = false) {
  return sellerOffers
    .filter(o => o.entityType === entityType && o.entityId === entityId && (includeExpired || o.status !== "expired"))
    .sort((a,b) => (a.pricePhp ?? Number.MAX_SAFE_INTEGER) - (b.pricePhp ?? Number.MAX_SAFE_INTEGER));
}

export function getPriceHistory(entityType: OfferEntityType, entityId: string) {
  return priceObservations
    .filter(o => o.entityType === entityType && o.entityId === entityId)
    .sort((a,b) => a.observedAt.localeCompare(b.observedAt));
}

export function getOfferById(id: string) { return sellerOffers.find(o => o.id === id); }

export function offerCounts() {
  return sellerOffers.reduce((acc, offer) => {
    acc[offer.status] = (acc[offer.status] || 0) + 1;
    return acc;
  }, {} as Record<OfferStatus, number>);
}

export function publicOfferTarget(offer: SellerOffer) {
  if (offer.entityType === "motorcycle") return `/motorcycles/${offer.entityId.split("-")[0]}/${offer.entityId.replace(/^[^-]+-/,"")}#price`;
  if (offer.entityType === "helmet") return "/catalog";
  if (offer.entityType === "tire") return "/tires";
  return "/accessories/top-box";
}

export function getOffersForSeller(sellerSlug:string, includeExpired=false){ return sellerOffers.filter(o=>o.sellerSlug===sellerSlug && (includeExpired || o.status!=="expired")).sort((a,b)=>(a.pricePhp??Number.MAX_SAFE_INTEGER)-(b.pricePhp??Number.MAX_SAFE_INTEGER)); }

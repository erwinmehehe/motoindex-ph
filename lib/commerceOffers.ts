import { helmetProducts, tireProducts, topBoxProducts } from "./catalog";
import {
  commerceAgeDays,
  commerceFreshDays,
  isFreshCommerceDate,
  isHttpsUrl,
  isProductSpecificCommerceUrl,
} from "./commercePolicy";
import type { OfferEntityType, SellerOffer, SellerType } from "./types";

type PriceBackedProduct = {
  id: string;
  brand: string;
  model: string;
  status: "research" | "verified";
  priceFromPhp?: number;
  priceSourceUrl?: string;
  lastChecked?: string;
};

type MerchantIdentity = { name: string; slug: string; type: SellerType };

const hostLabels: Record<string, MerchantIdentity> = {
  "www.teamspyder.com": { name: "Team Spyder", slug: "team-spyder", type: "official" },
  "teamspyder.com": { name: "Team Spyder", slug: "team-spyder", type: "official" },
  "evohelmet.com": { name: "EVO Helmets", slug: "evo-helmets", type: "official" },
  "www.evohelmet.com": { name: "EVO Helmets", slug: "evo-helmets", type: "official" },
  "gbrands.ph": { name: "GBrands Philippines", slug: "gbrands-ph", type: "retailer" },
  "www.gbrands.ph": { name: "GBrands Philippines", slug: "gbrands-ph", type: "retailer" },
  "pieza.ph": { name: "Pieza", slug: "pieza", type: "retailer" },
  "www.pieza.ph": { name: "Pieza", slug: "pieza", type: "retailer" },
  "kranosgears.com": { name: "Kranos Gears", slug: "kranos-gears", type: "retailer" },
  "www.kranosgears.com": { name: "Kranos Gears", slug: "kranos-gears", type: "retailer" },
  "tenplus.ph": { name: "TenPlus", slug: "tenplus", type: "retailer" },
  "www.tenplus.ph": { name: "TenPlus", slug: "tenplus", type: "retailer" },
  "www.motoworld.com.ph": { name: "Motoworld Philippines", slug: "motoworld-ph", type: "retailer" },
  "motoworld.com.ph": { name: "Motoworld Philippines", slug: "motoworld-ph", type: "retailer" },
  "ridemanila.com": { name: "Ride Manila", slug: "ride-manila", type: "retailer" },
  "www.ridemanila.com": { name: "Ride Manila", slug: "ride-manila", type: "retailer" },
  "secmotosupply.com": { name: "SEC Moto Supply", slug: "sec-moto-supply", type: "retailer" },
  "www.secmotosupply.com": { name: "SEC Moto Supply", slug: "sec-moto-supply", type: "retailer" },
  "leksmotogears.com": { name: "Lek's Moto Gears", slug: "leks-moto-gears", type: "retailer" },
  "www.leksmotogears.com": { name: "Lek's Moto Gears", slug: "leks-moto-gears", type: "retailer" },
  "shopmotoman.com": { name: "Motoman", slug: "motoman", type: "retailer" },
  "www.shopmotoman.com": { name: "Motoman", slug: "motoman", type: "retailer" },
  "teamgraphitee.com": { name: "Team Graphitee", slug: "team-graphitee", type: "retailer" },
  "www.teamgraphitee.com": { name: "Team Graphitee", slug: "team-graphitee", type: "retailer" },
  "shopee.ph": { name: "Shopee Philippines", slug: "shopee-ph", type: "marketplace" },
  "www.shopee.ph": { name: "Shopee Philippines", slug: "shopee-ph", type: "marketplace" },
  "lazada.com.ph": { name: "Lazada Philippines", slug: "lazada-ph", type: "marketplace" },
  "www.lazada.com.ph": { name: "Lazada Philippines", slug: "lazada-ph", type: "marketplace" },
};

function merchantFromUrl(url: string): MerchantIdentity | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return hostLabels[host] || {
      name: host.replace(/^www\./, ""),
      slug: host.replace(/^www\./, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      type: "retailer" as SellerType,
    };
  } catch {
    return null;
  }
}

function sourceOffer(entityType: OfferEntityType, product: PriceBackedProduct): SellerOffer | null {
  if (
    product.status !== "verified" ||
    !product.priceFromPhp ||
    !product.priceSourceUrl ||
    !product.lastChecked ||
    !isProductSpecificCommerceUrl(product.priceSourceUrl)
  ) return null;
  const merchant = merchantFromUrl(product.priceSourceUrl);
  if (!merchant) return null;
  return {
    id: `source-${entityType}-${product.id}`,
    entityType,
    entityId: product.id,
    sellerName: merchant.name,
    sellerSlug: merchant.slug,
    sellerType: merchant.type,
    pricePhp: product.priceFromPhp,
    availability: "Check current stock and exact variant",
    status: "verified",
    observedAt: product.lastChecked,
    verifiedAt: product.lastChecked,
    targetUrl: product.priceSourceUrl,
    note: `Source-backed starting-price observation for ${product.brand} ${product.model}. Confirm the exact size, variant, bundle and checkout total on the merchant page.`,
  };
}

export const sourceBackedCommerceOffers: SellerOffer[] = [
  ...helmetProducts.map((p) => sourceOffer("helmet", p)),
  ...tireProducts.map((p) => sourceOffer("tire", p)),
  ...topBoxProducts.map((p) => sourceOffer("topbox", p)),
].filter((offer): offer is SellerOffer => Boolean(offer));

export function isFreshCommerceOffer(offer: SellerOffer, maxAgeDays = commerceFreshDays, now = new Date()) {
  return offer.status === "verified" && isFreshCommerceDate(offer.observedAt, maxAgeDays, now);
}

export function commerceOfferDestination(offer: SellerOffer) {
  if (offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl)) return offer.affiliateUrl;
  if (offer.targetUrl && isHttpsUrl(offer.targetUrl)) return offer.targetUrl;
  return null;
}

export function compareCommerceOffers(a: SellerOffer, b: SellerOffer, now = new Date()) {
  const ageDifference = commerceAgeDays(a.observedAt, now) - commerceAgeDays(b.observedAt, now);
  if (ageDifference !== 0) return ageDifference;
  const priceDifference = (a.pricePhp ?? Number.MAX_SAFE_INTEGER) - (b.pricePhp ?? Number.MAX_SAFE_INTEGER);
  if (priceDifference !== 0) return priceDifference;
  return a.sellerName.localeCompare(b.sellerName);
}

export function merchantOfferKey(offer: SellerOffer) {
  if (offer.sellerType !== "marketplace" && offer.targetUrl && isHttpsUrl(offer.targetUrl)) {
    try { return `host:${new URL(offer.targetUrl).hostname.toLowerCase().replace(/^www\./, "")}`; } catch { /* fall through */ }
  }
  if (offer.sellerSlug) return `seller:${offer.sellerSlug.toLowerCase()}`;
  return `seller:${offer.sellerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getSourceBackedCommerceOffers(entityType: OfferEntityType, entityId: string, now = new Date()) {
  return sourceBackedCommerceOffers
    .filter((offer) => offer.entityType === entityType && offer.entityId === entityId && isFreshCommerceOffer(offer, commerceFreshDays, now))
    .sort((a, b) => compareCommerceOffers(a, b, now));
}

export function getSourceBackedCommerceOfferById(id: string) {
  return sourceBackedCommerceOffers.find((offer) => offer.id === id);
}

export function commerceOfferFreshness(offer: SellerOffer, now = new Date()) {
  const age = commerceAgeDays(offer.observedAt, now);
  if (!Number.isFinite(age) || age < 0) return { label: "Invalid check date", tone: "stale" as const, age };
  if (age <= 7) return { label: "Checked this week", tone: "fresh" as const, age };
  if (age <= commerceFreshDays) return { label: `Checked ${age} days ago`, tone: "current" as const, age };
  return { label: "Needs recheck", tone: "stale" as const, age };
}

export { commerceFreshDays } from "./commercePolicy";

import snapshot from "@/data/generated/public-db-snapshot.json";
import type { OfferEntityType, SellerOffer, SellerProfile } from "@/lib/types";
import type { PublicUsedListing } from "@/lib/persistentUsedListings";

export type SnapshotPriceObservation = {
  entityType: OfferEntityType;
  entityId: string;
  sellerName: string;
  pricePhp: number;
  observedAt: string;
  status: "verified" | "expired";
};

export type SnapshotAffiliateLink = {
  productId: string;
  merchant: string;
  network: string;
  url: string;
  status: string;
};

type PublicSnapshot = {
  generatedAt: string | null;
  dealers: SellerProfile[];
  offers: SellerOffer[];
  priceHistory: SnapshotPriceObservation[];
  usedListings: PublicUsedListing[];
  affiliateLinks: SnapshotAffiliateLink[];
};

const data = snapshot as PublicSnapshot;

export function publicSnapshotGeneratedAt() {
  return data.generatedAt || undefined;
}

export function snapshotDealers() {
  return data.dealers;
}

export function snapshotSeller(slug: string) {
  return data.dealers.find((dealer) => dealer.slug === slug);
}

export function snapshotOffers(filters?: { entityType?: OfferEntityType; entityId?: string }) {
  return data.offers.filter((offer) =>
    (!filters?.entityType || offer.entityType === filters.entityType) &&
    (!filters?.entityId || offer.entityId === filters.entityId)
  );
}

export function snapshotOffer(id: string) {
  return data.offers.find((offer) => offer.id === id);
}

export function snapshotPriceHistory(entityType: OfferEntityType, entityId: string) {
  return data.priceHistory.filter((row) => row.entityType === entityType && row.entityId === entityId);
}

export function snapshotUsedListings(options: { modelId?: string; limit?: number } = {}) {
  const limit = Math.min(Math.max(options.limit || 50, 1), 100);
  return data.usedListings
    .filter((row) => !options.modelId || row.modelExternalId === options.modelId)
    .slice(0, limit);
}

export function snapshotAffiliateLink(productId: string) {
  return data.affiliateLinks.find((row) => row.productId === productId && row.status === "active");
}

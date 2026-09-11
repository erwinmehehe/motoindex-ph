import { motorcycles } from "@/lib/data";
import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";
import { commerceFreshnessWindow } from "@/lib/commercePolicy";
import { snapshotOffer, snapshotOffers, snapshotPriceHistory } from "@/lib/publicSnapshot";
import type { OfferEntityType, SellerOffer } from "@/lib/types";

export function matchEntity(type: OfferEntityType, id: string) {
  if (type === "motorcycle") {
    const item = motorcycles.find((x) => x.id === id);
    return item ? `${item.make} ${item.model}` : null;
  }
  if (type === "helmet") {
    const item = helmetProducts.find((x) => x.id === id);
    return item ? `${item.brand} ${item.model}` : null;
  }
  if (type === "tire") {
    const item = tireProducts.find((x) => x.id === id);
    return item ? `${item.brand} ${item.model}` : null;
  }
  const item = topBoxProducts.find((x) => x.id === id);
  return item ? `${item.brand} ${item.model}` : null;
}

export async function getVerifiedOffers(
  filters?: { entityType?: OfferEntityType; entityId?: string },
  now = new Date()
): Promise<SellerOffer[]> {
  const { lower, upper } = commerceFreshnessWindow(now);
  return snapshotOffers(filters)
    .filter((offer) => {
      if (offer.status !== "verified") return false;
      const observed = new Date(`${offer.observedAt}T00:00:00Z`);
      return observed >= lower && observed <= upper;
    })
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt) || (a.pricePhp ?? Number.MAX_SAFE_INTEGER) - (b.pricePhp ?? Number.MAX_SAFE_INTEGER));
}

export async function getVerifiedOfferById(id: string, now = new Date()): Promise<SellerOffer | null> {
  const offer = snapshotOffer(id);
  if (!offer || offer.status !== "verified") return null;
  const { lower, upper } = commerceFreshnessWindow(now);
  const observed = new Date(`${offer.observedAt}T00:00:00Z`);
  return observed >= lower && observed <= upper ? offer : null;
}

export async function getPriceHistory(entityType: OfferEntityType, entityId: string) {
  return snapshotPriceHistory(entityType, entityId)
    .map((row) => ({
      pricePhp: row.pricePhp,
      observedAt: row.observedAt,
      sellerName: row.sellerName,
      status: row.status,
    }))
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt));
}

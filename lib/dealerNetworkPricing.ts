import { isIndexableModel, getModelById } from "./data";
import { isCheckedWithin, MARKET_PRICE_MAX_AGE_DAYS } from "./freshnessPolicy";
import { marketPriceChecks } from "./marketChecks";
import type { SellerProfile } from "./types";

export type DealerNetworkPriceReference = {
  modelId: string;
  label: string;
  href: string;
  priceFromPhp: number;
  priceToPhp?: number;
  checkedAt: string;
  sourceName: string;
  sourceUrl: string;
};

function operatorForSeller(seller: SellerProfile) {
  const value = seller.name.toLowerCase();
  if (value.includes("motortrade")) return "Motortrade Philippines";
  if (value.includes("wheeltek")) return "Wheeltek";
  return null;
}

export function dealerNetworkPriceReferences(seller: SellerProfile, now = new Date()): DealerNetworkPriceReference[] {
  const operator = operatorForSeller(seller);
  if (!operator) return [];

  const rows = marketPriceChecks
    .filter((row) => row.sourceName === operator && isCheckedWithin(row.checkedAt, MARKET_PRICE_MAX_AGE_DAYS, now))
    .flatMap((row) => {
      const model = getModelById(row.modelId);
      if (!model || !isIndexableModel(model)) return [];
      if (!seller.brands.some((brand) => brand.toLowerCase() === model.make.toLowerCase())) return [];
      return [{
        modelId: model.id,
        label: `${model.make} ${model.model}`,
        href: `/motorcycles/${model.makeSlug}/${model.slug}`,
        priceFromPhp: row.priceFromPhp,
        priceToPhp: row.priceToPhp,
        checkedAt: row.checkedAt,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl
      }];
    });

  return [...new Map(rows.map((row) => [row.modelId, row])).values()]
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 12);
}

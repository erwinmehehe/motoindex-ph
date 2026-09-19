import { isIndexableModel, motorcycles } from "./data";
import { observedMarketRange } from "./marketChecks";
import type { Motorcycle } from "./types";

const NON_CURRENT = new Set(["previous", "uncertain", "discontinued"]);

export const currentPublicMotorcycles = motorcycles.filter(
  (model) => isIndexableModel(model) && !NON_CURRENT.has(model.marketStatus || "")
);

export const currentScooters = currentPublicMotorcycles.filter((model) =>
  /scooter/i.test(model.category)
);

export function priceOrdered(models: Motorcycle[]) {
  return [...models].sort(
    (a, b) =>
      observedMarketRange(a).from - observedMarketRange(b).from ||
      a.make.localeCompare(b.make) ||
      a.model.localeCompare(b.model)
  );
}

export function marketMedianPrice(models: Motorcycle[]) {
  const prices = models.map((model) => observedMarketRange(model).from).sort((a, b) => a - b);
  if (!prices.length) return undefined;
  const middle = Math.floor(prices.length / 2);
  return prices.length % 2
    ? prices[middle]
    : Math.round((prices[middle - 1] + prices[middle]) / 2);
}

export function marketPriceSpan(models: Motorcycle[]) {
  if (!models.length) return { low: undefined, high: undefined };
  return {
    low: Math.min(...models.map((model) => observedMarketRange(model).from)),
    high: Math.max(...models.map((model) => observedMarketRange(model).to || observedMarketRange(model).from))
  };
}

export function marketBrandCount(models: Motorcycle[]) {
  return new Set(models.map((model) => model.makeSlug)).size;
}

export function hasAbs(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}

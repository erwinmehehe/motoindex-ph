import type { Motorcycle } from "./types";

const DAY_MS = 86_400_000;

// Published model facts should be rechecked at least quarterly.
export const MODEL_SOURCE_MAX_AGE_DAYS = 90;
// Market asking-price observations move faster and should be refreshed monthly.
export const MARKET_PRICE_MAX_AGE_DAYS = 30;

export function checkedAgeDays(checkedAt?: string, now = new Date()) {
  if (!checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) return Number.POSITIVE_INFINITY;
  const checkedMs = Date.parse(`${checkedAt}T00:00:00Z`);
  if (!Number.isFinite(checkedMs)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((now.getTime() - checkedMs) / DAY_MS));
}

export function isCheckedWithin(checkedAt: string | undefined, maxAgeDays: number, now = new Date()) {
  return checkedAgeDays(checkedAt, now) <= maxAgeDays;
}

export function modelSourceNeedsRefresh(model: Motorcycle, now = new Date()) {
  return !isCheckedWithin(model.verifiedAt, MODEL_SOURCE_MAX_AGE_DAYS, now);
}

export function marketPriceNeedsRefresh(model: Motorcycle, now = new Date()) {
  if (!model.marketPriceCheckedAt) return false;
  return !isCheckedWithin(model.marketPriceCheckedAt, MARKET_PRICE_MAX_AGE_DAYS, now);
}

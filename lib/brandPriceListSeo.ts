import type { Motorcycle } from "./types";
import { latestPriceReference } from "./marketChecks";
import { php } from "./utils";

// Use the name printed by the manufacturer for brand hub SEO and page copy.
// The catalog can contain different capitalizations of the same make.
const brandDisplayOverrides: Record<string, string> = {
  kymco: "KYMCO"
};

export function motorcycleBrandDisplayName(makeSlug: string, sourceMake: string) {
  return brandDisplayOverrides[makeSlug] ?? sourceMake;
}

// Keep the page heading and canonical URL evergreen. The price-check year is
// included in search metadata only when dated price evidence exists.
export function motorcycleBrandPriceListTitle(brand: string) {
  return `${brand} Motorcycle Philippines Price List`;
}

export function motorcycleBrandPriceListDescription(brand: string, low?: number, high?: number) {
  const keyword = motorcycleBrandPriceListTitle(brand);
  if (low !== undefined && high !== undefined) {
    return `${keyword}: Compare model prices from ${php(low)} to ${php(high)}, engine sizes, specs and seat heights. Explore model details.`;
  }
  // Do not imply that a brand has a verified current lineup when no current models pass publication checks.
  return `${keyword}: Browse model prices, engine sizes, specs and seat heights. Confirm current dealer quotes before buying.`;
}

/**
 * An SEO year is earned by a dated price observation, not the calendar or a
 * specification-only verification. Do not label old source data as freshly priced.
 */
export function latestBrandPriceCheckYear(models: readonly Motorcycle[]): number | undefined {
  const dates = models.map(latestPriceReference)
    .filter((reference) => reference.kind === "price-check" && /^\d{4}-\d{2}-\d{2}$/.test(reference.date))
    .map((reference) => reference.date);
  if (!dates.length) return undefined;
  return Number(dates.sort().at(-1)!.slice(0, 4));
}

/** Keep the search intent prominent without truncating longer brand names. */
export function motorcycleBrandSearchTitle(brand: string, checkedYear?: number) {
  const year = typeof checkedYear === "number" && Number.isInteger(checkedYear) && checkedYear >= 2020 && checkedYear <= 2100
    ? ` ${checkedYear}` : "";
  const full = `${brand} Motorcycle Price List Philippines${year} | MotoIndex`;
  if (full.length <= 62) return full;
  const compact = `${brand} Motorcycle Price List PH${year} | MotoIndex`;
  return compact.length <= 62 ? compact : `${brand} Price List PH${year} | MotoIndex`;
}

export function motorcycleBrandSearchDescription(
  brand: string, modelCount: number, low?: number, high?: number, checkedYear?: number
) {
  if (modelCount <= 0 || low === undefined || high === undefined) {
    return motorcycleBrandPriceListDescription(brand, low, high);
  }
  const year = checkedYear ? ` (${checkedYear})` : "";
  const long = `${motorcycleBrandPriceListTitle(brand)}${year}: Compare ${modelCount} tracked models, prices ${php(low)}–${php(high)}, specs and source dates. Confirm dealer quotes.`;
  if (long.length <= 158) return long;
  return `${brand} motorcycle prices Philippines${year}: ${modelCount} tracked models, ${php(low)}–${php(high)}, checked sources and specs. Confirm dealer quotes.`;
}

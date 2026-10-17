import { php } from "./utils";

// Use the name printed by the manufacturer for brand hub SEO and page copy.
// The catalog can contain different capitalizations of the same make.
const brandDisplayOverrides: Record<string, string> = {
  kymco: "KYMCO"
};

export function motorcycleBrandDisplayName(makeSlug: string, sourceMake: string) {
  return brandDisplayOverrides[makeSlug] ?? sourceMake;
}

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

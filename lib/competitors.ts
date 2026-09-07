// Competing price/spec aggregators and dealer chains.
//
// MotoIndex still checks these sources and still records the date it did, but it
// does not link to them and does not print their names: a dofollow link and a
// brand mention on every model page is free marketing and free link equity for a
// site competing for the same queries.
//
// Retail merchants are deliberately NOT listed here. Ride Manila, Shopee and the
// like are shopping destinations for the reader and a revenue path for the site.
//
// To stop linking to another domain, add it here. Matching is on the registrable
// host and any subdomain.

export const COMPETITOR_HOSTS = [
  "zigwheels.ph",
  "motortrade.com.ph",
  "carmudi.com.ph",
  "motodeal.com.ph",
  "pinoymotospecs.com",
  "fasterwheeler.com"
];

export function isCompetitorSource(url?: string) {
  if (!url) return false;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return false;
  }
  return COMPETITOR_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
}

// Competitor sources are named generically rather than by brand. The reader still
// sees that a real Philippine source was checked, and on what date, without the
// page advertising a competing site by name.
export function sourceDisplayName(label: string | undefined, url?: string, kind?: string) {
  if (!isCompetitorSource(url)) return label || "Source";
  const k = (kind || "").toLowerCase();
  if (k.includes("dealer")) return "Philippine dealer listing";
  if (k.includes("retail")) return "Philippine retailer listing";
  if (k.includes("comparison") || k.includes("aggregat")) return "Philippine comparison site";
  return "Philippine market source";
}

// Server components can read a competitor URL to decide not to link it, but the
// URL must not reach the browser: anything passed into a "use client" component
// is serialized into the RSC flight payload and ships inside the HTML. Strip the
// competitor URLs at that boundary.
//
// The records themselves keep their URLs. Source provenance is real and the
// editorial gates (isIndexableModel, freshness) depend on it; this only changes
// what crosses into the client bundle.
const URL_FIELDS = ["sourceUrl", "marketPriceSourceUrl", "priceSourceUrl", "sourceImageUrl", "targetUrl"] as const;

export function forClient<T>(record: T): T;
export function forClient<T>(record: T[]): T[];
export function forClient(record: any): any {
  if (Array.isArray(record)) return record.map(forClient);
  if (!record || typeof record !== "object") return record;
  let copy: any;
  for (const field of URL_FIELDS) {
    if (isCompetitorSource(record[field])) {
      copy = copy || { ...record };
      delete copy[field];
    }
  }
  return copy || record;
}

// Competing price/spec aggregators and dealer chains.
//
// MotoIndex still checks these sources and records the date. Public citations
// show the publisher name and remain openable; SourceRef adds nofollow for these
// competing domains so transparency does not imply editorial endorsement.
//
// Retail merchants are deliberately NOT listed here. Ride Manila, Shopee and the
// like are shopping destinations for the reader and a revenue path for the site.
//
// Add competing domains here so their public links receive nofollow. Matching is
// on the registrable host and any subdomain.

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

// Keep the real source name visible to readers. SourceRef applies nofollow to
// competitor links, so transparency does not require hiding who published the
// price or specification.
const PUBLIC_SOURCE_NAMES: Record<string, string> = {
  "zigwheels.ph": "Zigwheels Philippines",
  "motortrade.com.ph": "Motortrade",
  "carmudi.com.ph": "Carmudi Philippines",
  "motodeal.com.ph": "MotoDeal Philippines",
  "pinoymotospecs.com": "Pinoy Moto Specs",
  "fasterwheeler.com": "Fasterwheeler"
};

export function sourceDisplayName(label: string | undefined, url?: string, _kind?: string) {
  if (url) {
    try {
      const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
      const matched = Object.keys(PUBLIC_SOURCE_NAMES).find((domain) => host === domain || host.endsWith(`.${domain}`));
      if (matched) return PUBLIC_SOURCE_NAMES[matched];
    } catch {
      // Fall back to the stored label when the URL is malformed.
    }
  }
  return label || "Source";
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

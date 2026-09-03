import { allCatalogProducts } from "./catalog";
import generatedAffiliateData from "../data/affiliate-links.generated.json";

export type AffiliateMerchant = "shopee";
export type AffiliateNetwork = "shopee_direct" | "involve_asia";

export type AffiliateLinkConfig = {
  productId: string;
  merchant: AffiliateMerchant;
  network: AffiliateNetwork;
  url: string;
};

export type AffiliateConfigIssue = {
  productId?: string;
  message: string;
};

const allowedShopeeHost = (hostname: string) => {
  const host = hostname.toLowerCase();
  return host === "shopee.ph" || host.endsWith(".shopee.ph") || host === "shope.ee" || host.endsWith(".shope.ee");
};

const allowedInvolveAsiaHost = (hostname: string) => {
  const host = hostname.toLowerCase();
  return host === "invol.co" || host.endsWith(".invol.co") || host === "involve.asia" || host.endsWith(".involve.asia") || host === "invl.me" || host.endsWith(".invl.me");
};

function catalogIds() {
  return new Set(allCatalogProducts().map((product) => product.id));
}

function inferNetwork(url: URL): AffiliateNetwork | undefined {
  if (allowedShopeeHost(url.hostname)) return "shopee_direct";
  if (allowedInvolveAsiaHost(url.hostname)) return "involve_asia";
  return undefined;
}

function validateEntry(productId: string, rawValue: unknown, issues: AffiliateConfigIssue[]): AffiliateLinkConfig | undefined {
  const knownIds = catalogIds();
  if (!knownIds.has(productId)) {
    issues.push({ productId, message: "Affiliate link is keyed to an unknown catalog product." });
    return undefined;
  }

  let merchant: AffiliateMerchant = "shopee";
  let network: AffiliateNetwork | undefined;
  let rawUrl: unknown;

  if (typeof rawValue === "string") {
    rawUrl = rawValue;
  } else if (rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)) {
    const entry = rawValue as Record<string, unknown>;
    rawUrl = entry.url;
    if (entry.merchant !== undefined && entry.merchant !== "shopee") {
      issues.push({ productId, message: "Unsupported merchant. Current catalog affiliate offers support Shopee destinations." });
      return undefined;
    }
    merchant = "shopee";
    if (entry.network === "shopee_direct" || entry.network === "involve_asia") network = entry.network;
    else if (entry.network !== undefined) {
      issues.push({ productId, message: "Affiliate network must be shopee_direct or involve_asia." });
      return undefined;
    }
  } else {
    issues.push({ productId, message: "Affiliate entry must be an HTTPS URL string or an object with url/network fields." });
    return undefined;
  }

  if (typeof rawUrl !== "string" || !rawUrl.trim()) {
    issues.push({ productId, message: "Affiliate link must be a non-empty HTTPS URL." });
    return undefined;
  }

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") {
      issues.push({ productId, message: "Affiliate URL must use HTTPS." });
      return undefined;
    }
    const inferred = inferNetwork(url);
    if (!inferred) {
      issues.push({ productId, message: "Affiliate URL must use an approved Shopee or Involve Asia tracking host." });
      return undefined;
    }
    if (network && network !== inferred) {
      issues.push({ productId, message: "Configured affiliate network does not match the URL host." });
      return undefined;
    }
    return { productId, merchant, network: network ?? inferred, url: url.toString() };
  } catch {
    issues.push({ productId, message: "Affiliate link is not a valid URL." });
    return undefined;
  }
}

function parseMap(raw: string | undefined, sourceLabel: string): { links: Record<string, AffiliateLinkConfig>; issues: AffiliateConfigIssue[] } {
  const value = raw?.trim();
  if (!value) return { links: {}, issues: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { links: {}, issues: [{ message: `${sourceLabel} is not valid JSON.` }] };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { links: {}, issues: [{ message: `${sourceLabel} must be a JSON object keyed by MotoIndex product ID.` }] };
  }
  const links: Record<string, AffiliateLinkConfig> = {};
  const issues: AffiliateConfigIssue[] = [];
  for (const [productId, entry] of Object.entries(parsed as Record<string, unknown>)) {
    const validated = validateEntry(productId, entry, issues);
    if (validated) links[productId] = validated;
  }
  return { links, issues };
}

function generatedMap(): { links: Record<string, AffiliateLinkConfig>; issues: AffiliateConfigIssue[] } {
  const rawLinks = generatedAffiliateData && typeof generatedAffiliateData === "object" && "links" in generatedAffiliateData
    ? (generatedAffiliateData as { links?: unknown }).links
    : undefined;
  if (!rawLinks || typeof rawLinks !== "object" || Array.isArray(rawLinks)) return { links: {}, issues: [] };
  const links: Record<string, AffiliateLinkConfig> = {};
  const issues: AffiliateConfigIssue[] = [];
  for (const [productId, entry] of Object.entries(rawLinks as Record<string, unknown>)) {
    const validated = validateEntry(productId, entry, issues);
    if (validated) links[productId] = validated;
  }
  return { links, issues };
}

function readAffiliateMap(): { links: Record<string, AffiliateLinkConfig>; issues: AffiliateConfigIssue[] } {
  const generated = generatedMap();
  const legacy = parseMap(process.env.SHOPEE_AFFILIATE_LINKS_JSON, "SHOPEE_AFFILIATE_LINKS_JSON");
  const unified = parseMap(process.env.AFFILIATE_LINKS_JSON, "AFFILIATE_LINKS_JSON");
  // Generated cache is the baseline; deploy-time maps can override it without editing the repository.
  return {
    links: { ...generated.links, ...legacy.links, ...unified.links },
    issues: [...generated.issues, ...legacy.issues, ...unified.issues]
  };
}

export function getAffiliateLink(productId: string) {
  return readAffiliateMap().links[productId];
}

export function hasAffiliateLink(productId: string) {
  return Boolean(getAffiliateLink(productId));
}

// Backwards-compatible aliases for v2.2.1 deployments while they migrate to AFFILIATE_LINKS_JSON.
export function getShopeeAffiliateUrl(productId: string) {
  return getAffiliateLink(productId)?.url;
}
export function hasShopeeAffiliateUrl(productId: string) {
  return hasAffiliateLink(productId);
}

export function getAffiliateConfigSummary() {
  const { links, issues } = readAffiliateMap();
  const all = allCatalogProducts();
  const configuredLinks = Object.values(links);
  return {
    configured: configuredLinks.length,
    catalogProducts: all.length,
    configuredProductIds: Object.keys(links).sort(),
    byNetwork: {
      shopeeDirect: configuredLinks.filter((link) => link.network === "shopee_direct").length,
      involveAsia: configuredLinks.filter((link) => link.network === "involve_asia").length
    },
    issues
  };
}

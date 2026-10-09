import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";

/**
 * Only an item listing, with shop and item identifiers, qualifies as an
 * "exact product" link. Search, store and campaign pages do not.
 */
export function isExactShopeeProductUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "shopee.ph" && host !== "www.shopee.ph") || url.username || url.password || url.port) return false;
    const path = decodeURIComponent(url.pathname);
    return /^\/product\/\d+\/\d+\/?$/i.test(path) || /-i\.\d+\.\d+\/?$/i.test(path);
  } catch {
    return false;
  }
}

/**
 * Two older MotoIndex redirects were shared between unrelated helmets and
 * lead to general marketplace destinations, not to individual product pages.
 * Do not accept them from generated data, env overrides or admin entries.
 */
export function isKnownGenericAffiliateDestination(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    if (host === "invl.me" || host.endsWith(".invl.me")) {
      if (path === "/clo1b14" || path === "/clo1b1b") return true;
    }
    if (host === "shopee.ph" || host === "www.shopee.ph") {
      return !isExactShopeeProductUrl(url.toString());
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Opaque affiliate-network links cannot prove what item they reach just from
 * the short URL. Store an independently reviewed exact merchant item URL
 * alongside each tracked shortlink (and recheck it in the provider console).
 */
export function isExactMerchantProductUrl(merchant: "shopee" | "lazada", value: string): boolean {
  if (merchant === "shopee") return isExactShopeeProductUrl(value);
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "lazada.com.ph" && host !== "www.lazada.com.ph")) return false;
    if (url.username || url.password || url.port) return false;
    return /^\/products\/[^/?#]+-i\d+-s\d+\.html$/i.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Editorial reference only. The linked source is NOT an automatically
 * commissioned affiliate URL, and the listing can become unavailable.
 */
export function sourcedShopeeProductListing(productId: string): { url: string; checkedAt: string } | undefined {
  // The lightweight allCatalogProducts() index deliberately omits source
  // URLs; use the verified helmet research record with its item-level source.
  const product = helmetProducts.find(entry => entry.id === productId);
  if (!product || !("priceSourceUrl" in product) || typeof product.priceSourceUrl !== "string" || !isExactShopeeProductUrl(product.priceSourceUrl)) return undefined;
  return {
    url: new URL(product.priceSourceUrl).toString(),
    checkedAt: product.lastChecked || "not recently verified"
  };
}

/**
 * A source-checked retailer product detail page is an editorial reference,
 * not an approved marketplace affiliate link or evidence of today's stock.
 * Restrict this to previously researched direct product pages. Official
 * model pages, retailer homepages and filtered category/search pages are
 * deliberately excluded from purchase-link fallback.
 */
const verifiedRetailerHosts = new Set([
  "www.motoworld.com.ph", "shop.motoworld.com.ph",
  "secmotosupply.com", "www.teamspyder.com", "evohelmet.com",
  "kranosgears.com", "www.tenplus.ph", "gbrands.ph",
  "motomaster.ph", "pieza.ph", "leksmotogears.com",
  "teamgraphitee.com", "ridemanila.com", "shopmotoman.com"
]);

export function isSpecificRetailerProductUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    if (!verifiedRetailerHosts.has(url.hostname.toLowerCase())) return false;
    const parts = decodeURIComponent(url.pathname).split("/").filter(Boolean);
    let detailIndex = -1;
    for (let i = parts.length - 1; i >= 0; i--) {
      if (["product", "products", "shop"].includes(parts[i].toLowerCase())) { detailIndex = i; break; }
    }
    if (detailIndex < 0 || detailIndex !== parts.length - 2) return false;
    const slug = parts[detailIndex + 1]?.toLowerCase();
    return Boolean(slug && slug.length >= 4 && !["page", "search", "category", "collections", "all", "shop"].includes(slug));
  } catch {
    return false;
  }
}

export function sourcedRetailerProductListing(productId: string):
  { url: string; checkedAt: string; sourceName: string; merchant: "retailer" } | undefined {
  // Shopee sources take precedence when a product has more than one recorded source.
  if (sourcedShopeeProductListing(productId)) return undefined;
  const product = [...helmetProducts, ...tireProducts, ...topBoxProducts]
    .find(entry => entry.id === productId && entry.status === "verified");
  if (!product) return undefined;
  const sources = [
    "priceSourceUrl" in product ? product.priceSourceUrl : undefined,
    "sourceUrl" in product ? product.sourceUrl : undefined
  ];
  const exact = sources.find((value): value is string =>
    typeof value === "string" && isSpecificRetailerProductUrl(value));
  if (!exact) return undefined;
  return {
    url: new URL(exact).toString(),
    checkedAt: product.lastChecked || "not recently verified",
    sourceName: product.sourceLabel || "Previously checked retailer item",
    merchant: "retailer"
  };
}

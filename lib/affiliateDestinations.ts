import { helmetProducts } from "@/lib/catalog";

/**
 * Only an item listing, with shop and item identifiers, qualifies as an
 * "exact product" link. Search, store and campaign pages do not.
 */
export function isExactShopeeProductUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (host !== "shopee.ph" && host !== "www.shopee.ph")) return false;
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

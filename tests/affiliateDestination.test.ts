import { describe, expect, it } from "vitest";
import { getAffiliateLinks } from "../lib/affiliate";
import { sourcedShopeeProductListing, isExactShopeeProductUrl, isKnownGenericAffiliateDestination } from "../lib/affiliateDestinations";
import { allCatalogProducts } from "../lib/catalog";
import { validateRuntimeAffiliateUrl } from "../lib/runtimeAffiliate";

describe("product-specific marketplace redirects", () => {
  it("never gives every helmet a shared Shopee or Lazada homepage CTA", () => {
    expect(getAffiliateLinks("gille-kerena-ff007")).toEqual([]);
    expect(getAffiliateLinks("spyder-surge-v2")).toEqual([]);
    expect(getAffiliateLinks("gille-883-falcon")).toEqual([]);
    expect(allCatalogProducts().filter(x => x.category === "Helmet" && getAffiliateLinks(x.id).length)).toEqual([]);
  });

  it("preserves an exact Kerena FF007 listing as an editorial, non-affiliate source", () => {
    const source = sourcedShopeeProductListing("gille-kerena-ff007");
    expect(source?.url).toContain("-i.505955057.25840894725");
    expect(source?.checkedAt).toBe("2026-09-09");
    expect(isExactShopeeProductUrl(source?.url || "")).toBe(true);
  });

  it("rejects Shopee homepages, searches and generic network shortcuts", () => {
    for (const url of [
      "https://shopee.ph/",
      "https://shopee.ph/search?keyword=Gille%20Kerena%20FF007",
      "https://shopee.ph/universal-link/",
      "https://invl.me/clo1b14",
      "https://invl.me/clo1b14?url=https%3A%2F%2Fshopee.ph%2Funiversal-link%2F",
      "https://invl.me/clo1b1b"
    ]) {
      expect(isKnownGenericAffiliateDestination(url)).toBe(true);
      expect(validateRuntimeAffiliateUrl("gille-kerena-ff007", url).ok).toBe(false);
    }
  });

  it("accepts an exact item URL without inventing tracking attribution", () => {
    const url = sourcedShopeeProductListing("gille-kerena-ff007")!.url;
    const checked = validateRuntimeAffiliateUrl("gille-kerena-ff007", url);
    expect(checked.ok).toBe(true);
    if (checked.ok) expect(checked.network).toBe("shopee_direct");
  });

  it("does not turn an unknown product ID or arbitrary retailer URL into an exact Shopee source", () => {
    expect(sourcedShopeeProductListing("unknown-product")).toBeUndefined();
    expect(isExactShopeeProductUrl("https://attacker.example/product/123/456")).toBe(false);
  });
});

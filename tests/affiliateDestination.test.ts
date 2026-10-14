import { afterEach, describe, expect, it, vi } from "vitest";
import { getAffiliateLinks } from "../lib/affiliate";
import { sourcedShopeeProductListing, isExactShopeeProductUrl, isExactMerchantProductUrl, isKnownGenericAffiliateDestination } from "../lib/affiliateDestinations";
import { allCatalogProducts } from "../lib/catalog";
import { validateRuntimeAffiliateUrl } from "../lib/runtimeAffiliate";

afterEach(() => vi.unstubAllEnvs());

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
  it("requires an explicit item-level destination for every opaque Involve Asia link", () => {
    const id="gille-kerena-ff007";
    const target=sourcedShopeeProductListing(id)!.url;
    const url="https://invl.me/a-unique-product-level-token";
    expect(validateRuntimeAffiliateUrl(id,url).ok).toBe(false);
    const checked=validateRuntimeAffiliateUrl(id,url,target);
    expect(checked.ok).toBe(true);
    if(checked.ok){
      expect(checked.network).toBe("involve_asia");
      expect(checked.destinationUrl).toBe(target);
    }
    expect(validateRuntimeAffiliateUrl(id,url,"https://shopee.ph/search?keyword=FF007").ok).toBe(false);
    expect(validateRuntimeAffiliateUrl(id,url,"https://shopee.ph/universal-link/").ok).toBe(false);
  });

  it("does not accept Lazada offers that claim Shopee listing proof", () => {
    expect(isExactMerchantProductUrl("lazada","https://shopee.ph/product/505955057/25840894725")).toBe(false);
    expect(isExactMerchantProductUrl("lazada","https://www.lazada.com.ph/products/helmet-ff007-i12345-s67890.html")).toBe(true);
    expect(validateRuntimeAffiliateUrl("gille-kerena-ff007","https://invl.me/a-token","https://shopee.ph/product/505955057/25840894725","lazada").ok).toBe(false);
  });

  it("does not publish a tracked env link with no original product URL", () => {
    vi.stubEnv("AFFILIATE_LINKS_JSON", JSON.stringify({
      "gille-kerena-ff007": {merchant:"shopee",network:"involve_asia",url:"https://invl.me/unique"}
    }));
    expect(getAffiliateLinks("gille-kerena-ff007")).toEqual([]);
  });

  it("keeps an exact tracked product mapping when accompanied by its checked item URL", () => {
    const target=sourcedShopeeProductListing("gille-kerena-ff007")!.url;
    vi.stubEnv("AFFILIATE_LINKS_JSON", JSON.stringify({
      "gille-kerena-ff007": {merchant:"shopee",network:"involve_asia",url:"https://invl.me/unique",destinationUrl:target}
    }));
    const offer=getAffiliateLinks("gille-kerena-ff007")[0];
    expect(offer?.url).toBe("https://invl.me/unique");
    expect(offer?.destinationUrl).toBe(target);
  });

});

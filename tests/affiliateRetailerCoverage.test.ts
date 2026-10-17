import { describe, expect, it } from "vitest";
import { allCatalogProducts } from "../lib/catalog";
import { isSpecificRetailerProductUrl, sourcedRetailerProductListing, sourcedShopeeProductListing } from "../lib/affiliateDestinations";
import { getAffiliateLinks } from "../lib/affiliate";

describe("item-specific source coverage across MotoIndex gear", () => {
  it("classifies all verified catalog IDs without duplicating item sources", () => {
    const all = allCatalogProducts();
    const ids = new Set(all.map(row => row.id));
    expect(ids.size).toBe(all.length);
    expect(all.length).toBeGreaterThanOrEqual(246);
    const sources = all.map(row => ({
      id: row.id,
      shopee: sourcedShopeeProductListing(row.id),
      retailer: sourcedRetailerProductListing(row.id)
    }));
    expect(sources.filter(x => x.shopee && x.retailer)).toEqual([]);
    expect(sources.filter(x => x.shopee)).toHaveLength(18);
    expect(sources.filter(x => x.retailer).length).toBeGreaterThanOrEqual(80);
    expect(sources.every(x => !x.shopee || !getAffiliateLinks(x.id).some(link => link.url === x.shopee?.url))).toBe(true);
  });

  it("points Spyder and SEC helmets to their specific merchant product pages", () => {
    expect(sourcedRetailerProductListing("spyder-surge-v2")?.url).toBe("https://www.teamspyder.com/products/spyder-surge-p-plain-v2");
    expect(sourcedRetailerProductListing("sec-windstorm-v3")?.url).toBe("https://secmotosupply.com/products/i009657");
  });

  it("supports a checked GIVI accessory retailer item and preserves its product identity", () => {
    expect(sourcedRetailerProductListing("givi-v58-maxia-5")?.url).toContain("givi-v58-maxia-5-topcase");
  });

  it("rejects catalog pages, off-domain links and retailer homepages", () => {
    for(const url of [
      "https://evohelmet.com/product/",
      "https://evohelmet.com/product/page/2/",
      "https://www.motoworld.com.ph/collections/helmets",
      "https://www.teamspyder.com/",
      "https://attacker.example/products/fake-helmet",
      "http://www.teamspyder.com/products/spyder-surge-p-plain-v2"
    ]) expect(isSpecificRetailerProductUrl(url)).toBe(false);
  });

  it("does not invent a Shopee affiliate link for a retail-source-only model", () => {
    expect(sourcedShopeeProductListing("spyder-surge-v2")).toBeUndefined();
    expect(getAffiliateLinks("spyder-surge-v2")).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { getAffiliateLinks } from "../lib/affiliate";
import { allCatalogProducts } from "../lib/catalog";

describe("Spyder merchant destination", () => {
  it("preserves the supplied tracking URL and identifies its general store destination", () => {
    const offer = getAffiliateLinks("spyder-surge-v2").find(link => link.merchant === "shopee");
    expect(offer?.url).toBe("https://invl.me/clo1b14?url=https%3A%2F%2Fshopee.ph%2Funiversal-link%2F");
    expect(offer?.destination).toBe("merchant_homepage");
  });
  it("uses the approved global Lazada link", () => {
    expect(getAffiliateLinks("spyder-surge-v2").find(link => link.merchant === "lazada")?.url).toBe("https://invl.me/clo1b1b");
  });
  it("provides both marketplace defaults for every verified helmet", () => {
    for (const helmet of allCatalogProducts().filter(product => product.category === "Helmet")) {
      expect(getAffiliateLinks(helmet.id).map(link => link.merchant)).toEqual(["shopee", "lazada"]);
    }
  });
  it("does not apply helmet defaults to unknown products or other categories", () => {
    expect(getAffiliateLinks("not-a-product")).toEqual([]);
    const tire = allCatalogProducts().find(product => product.category === "Tire")!;
    expect(getAffiliateLinks(tire.id)).toEqual([]);
  });
});

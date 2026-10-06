import { describe, expect, it } from "vitest";
import { getAffiliateLinks } from "../lib/affiliate";

describe("Spyder merchant destination", () => {
  it("preserves the supplied tracking URL and identifies its general store destination", () => {
    const offer = getAffiliateLinks("spyder-surge-v2").find(link => link.merchant === "shopee");
    expect(offer?.url).toBe("https://invl.me/clo1b14?url=https%3A%2F%2Fshopee.ph%2Funiversal-link%2F");
    expect(offer?.destination).toBe("merchant_homepage");
  });
  it("does not invent a Lazada tracking link", () => {
    expect(getAffiliateLinks("spyder-surge-v2").some(link => link.merchant === "lazada")).toBe(false);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { getAffiliateLinks, getAffiliateConfigSummary } from "../lib/affiliate";

afterEach(() => vi.unstubAllEnvs());

describe("duplicate merchant destinations across catalog items", () => {
  const gille = "https://shopee.ph/product/505955057/25840894725";

  it("suppresses both product CTAs if the same item link is mapped to unrelated products", () => {
    vi.stubEnv("AFFILIATE_LINKS_JSON", JSON.stringify({
      "gille-kerena-ff007": gille,
      "spyder-surge-v2": gille
    }));
    expect(getAffiliateLinks("gille-kerena-ff007")).toEqual([]);
    expect(getAffiliateLinks("spyder-surge-v2")).toEqual([]);
    expect(getAffiliateConfigSummary().issues.filter(x => x.message.includes("shared across")).length).toBe(2);
  });

  it("keeps independent exact product URLs available", () => {
    vi.stubEnv("AFFILIATE_LINKS_JSON", JSON.stringify({
      "gille-kerena-ff007": gille,
      "spyder-surge-v2": "https://shopee.ph/product/888888/999999"
    }));
    expect(getAffiliateLinks("gille-kerena-ff007")).toHaveLength(1);
    expect(getAffiliateLinks("spyder-surge-v2")).toHaveLength(1);
  });
});

import { describe, expect, it } from "vitest";
import { getHelmetBrand } from "../lib/data";
import { getHelmetProduct, isIndexableHelmetBrand } from "../lib/catalog";
import { helmetCatalogAliasTarget } from "../lib/helmetBrandLineups";
import { getHelmetSeoComparison, isIndexableHelmetSeoComparison } from "../lib/helmetSeoComparisons";

describe("helmet market expansion", () => {
  it("publishes the new Philippine helmet brand hubs", () => {
    for (const slug of ["studds", "scorpion", "nolan", "ryo"]) {
      expect(getHelmetBrand(slug)).toBeTruthy();
      expect(isIndexableHelmetBrand(slug)).toBe(true);
    }
  });

  it("keeps the priority exact helmet entities verified", () => {
    for (const [brand, slug] of [
      ["studds", "helios"],
      ["studds", "trooper-sport"],
      ["scorpion", "exo-r1-air-carbon"],
      ["scorpion", "exo-adx-2"],
      ["nolan", "n120-1"],
      ["nolan", "n70-2-x"],
      ["ryo", "rf-5v-fs-v8"],
      ["ryo", "ro-4sv-fs-766"],
      ["evo", "vxr-5000"],
      ["evo", "dx-7"],
      ["sec", "windstorm-v3"],
      ["sec", "rise-v2"],
    ] as const) {
      expect(getHelmetProduct(brand, slug)?.status).toBe("verified");
    }
  });

  it("canonicalizes the EVO Riot II lineup name to the verified product page", () => {
    expect(helmetCatalogAliasTarget("evo", "riot-ii-xt-300")).toBe("xt-300-riot-ii");
  });

  it("publishes the new brand comparison intents", () => {
    for (const slug of ["ls2-vs-hjc", "agv-vs-hjc", "nolan-vs-shoei"] as const) {
      expect(getHelmetSeoComparison(slug)).toBeTruthy();
      expect(isIndexableHelmetSeoComparison(slug)).toBe(true);
    }
  });
});

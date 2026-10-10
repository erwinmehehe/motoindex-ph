import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { motorcycles, isIndexableModel } from "../lib/data";
import { observedMarketRange } from "../lib/marketChecks";
import { php } from "../lib/utils";
import {
  motorcycleBrandDisplayName,
  motorcycleBrandPriceListDescription,
  motorcycleBrandPriceListTitle
} from "../lib/brandPriceListSeo";

const brandSlugs = [...new Set(motorcycles.map((model) => model.makeSlug))].sort();

describe("motorcycle brand price-list SEO", () => {
  it("derives brand pages from every catalog make and keeps one canonical keyword template", () => {
    expect(brandSlugs.length).toBeGreaterThanOrEqual(25);
    const brandRoute = readFileSync(new URL("../app/motorcycles/[make]/page.tsx", import.meta.url), "utf8");

    expect(brandRoute).toContain("new Set(motorcycles.map((m) => m.makeSlug))");
    expect(brandRoute).toContain("title: motorcycleBrandPriceListTitle(brand)");
    expect(brandRoute).toContain("description: motorcycleBrandPriceListDescription(brand, low, high)");
    expect(brandRoute).toContain("const priceListTitle = motorcycleBrandPriceListTitle(brand)");
    expect(brandRoute.match(/title=\\{priceListTitle\\}/g)?.length).toBeGreaterThanOrEqual(4);
    expect(brandRoute).toContain("description={`${priceListTitle}:");
    expect(brandRoute).toContain("name: priceListTitle");
    expect(brandRoute).not.toContain("brandGrowth?.seoTitle");
    expect(brandRoute).not.toContain("brandGrowth?.seoDescription");
    expect(brandRoute).not.toContain("brandGrowth?.heroTitle");
  });

  it("keeps KYMCO capitalized consistently even when data sources use Kymco", () => {
    expect(motorcycleBrandDisplayName("kymco", "Kymco")).toBe("KYMCO");
    expect(motorcycleBrandDisplayName("kymco", "KYMCO")).toBe("KYMCO");
  });

  for (const make of brandSlugs) {
    it(`uses the exact primary keyword for ${make} metadata, H1 and supporting content`, () => {
      const models = motorcycles
        .filter((model) => model.makeSlug === make)
        .filter((model, index, matching) => matching.findIndex((candidate) => candidate.id === model.id) === index);
      expect(models.length).toBeGreaterThan(0);

      const brand = motorcycleBrandDisplayName(make, models[0].make);
      const title = motorcycleBrandPriceListTitle(brand);
      expect(title).toBe(`${brand} Motorcycle Philippines Price List`);

      const current = models.filter(isIndexableModel).filter(
        (model) => !["previous", "uncertain", "discontinued"].includes(model.marketStatus ?? "")
      );
      const low = current.length ? Math.min(...current.map((model) => observedMarketRange(model).from)) : undefined;
      const high = current.length ? Math.max(...current.map((model) => observedMarketRange(model).to || observedMarketRange(model).from)) : undefined;
      const description = motorcycleBrandPriceListDescription(brand, low, high);

      expect(description.startsWith(`${title}:`)).toBe(true);
      expect(description).toContain("model prices");
      expect(description).toContain("engine sizes");
      expect(description).toContain("seat heights");
      expect(description.length).toBeLessThanOrEqual(158);

      if (low !== undefined && high !== undefined) {
        expect(description).toContain(php(low));
        expect(description).toContain(php(high));
      } else {
        expect(description).toContain("Confirm current dealer quotes");
      }
    });
  }
});

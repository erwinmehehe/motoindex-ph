import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { motorcycles, isIndexableModel } from "../lib/data";
import { latestPriceReference, observedMarketRange } from "../lib/marketChecks";
import { brandSeoGrowthProfile } from "../lib/brandSeoGrowth";
import { php } from "../lib/utils";
import {
  latestBrandPriceCheckYear,
  motorcycleBrandDisplayName,
  motorcycleBrandPriceListDescription,
  motorcycleBrandPriceListTitle,
  motorcycleBrandSearchDescription,
  motorcycleBrandSearchTitle
} from "../lib/brandPriceListSeo";

const brandSlugs = [...new Set(motorcycles.map((model) => model.makeSlug))].sort();
const brandRoute = readFileSync(new URL("../app/motorcycles/[make]/page.tsx", import.meta.url), "utf8");

describe("motorcycle brand price-list SEO", () => {
  it("keeps one canonical brand hub while using source-dated search metadata", () => {
    expect(brandSlugs.length).toBeGreaterThanOrEqual(25);
    expect(brandRoute).toContain("new Set(motorcycles.map((m) => m.makeSlug))");
    expect(brandRoute).toContain("motorcycleBrandSearchTitle(brand, checkedYear)");
    expect(brandRoute).toContain("motorcycleBrandSearchDescription(brand, current.length, low, high, checkedYear)");
    expect(brandRoute).toContain("const priceListTitle = motorcycleBrandPriceListTitle(brand)");
    expect(brandRoute.split("title={priceListTitle}").length - 1).toBeGreaterThanOrEqual(4);
    expect(brandRoute).toContain("name: priceListTitle");
    expect(brandRoute).not.toContain("brandGrowth?.seoTitle");
    expect(brandRoute).not.toContain("brandGrowth?.seoDescription");
    expect(brandRoute).not.toContain("brandGrowth?.heroTitle");
  });

  it("keeps KYMCO capitalized consistently even when data sources use Kymco", () => {
    expect(motorcycleBrandDisplayName("kymco", "Kymco")).toBe("KYMCO");
    expect(motorcycleBrandDisplayName("kymco", "KYMCO")).toBe("KYMCO");
  });

  it("puts the full price table before model cards and displays the actual source check", () => {
    expect(brandRoute.indexOf('<section id="price-list"')).toBeLessThan(brandRoute.indexOf('<section id="models"'));
    expect(brandRoute).toContain('reference.kind === "price-check"');
    expect(brandRoute).toContain("Model details checked");
    expect(brandRoute).toContain("<time dateTime={reference.date}>");
    expect(brandRoute).toContain('id="sources"');
    expect(brandRoute).toContain("phBrandSupportFor(make)");
    expect(brandRoute).toContain('href="/research/motorcycle-price-index-philippines"');
    expect(brandRoute).toContain('id="buying-guide"');
    expect(brandRoute).toContain("relatedBrands");
  });

  it("does not claim the current calendar year without a separate price observation", () => {
    const unpriced = { ...motorcycles[0], id: "synthetic-unpriced-brand-model", marketPriceCheckedAt: undefined, verifiedAt: "2024-01-01" };
    expect(latestPriceReference(unpriced).kind).toBe("model-source");
    expect(latestBrandPriceCheckYear([unpriced])).toBeUndefined();
    expect(motorcycleBrandSearchTitle("Suzuki")).not.toMatch(/20\d{2}/);
    expect(motorcycleBrandSearchTitle("Suzuki", 2026)).toBe("Suzuki Motorcycle Price List Philippines 2026 | MotoIndex");
    expect(motorcycleBrandSearchTitle("Royal Enfield", 2026).length).toBeLessThanOrEqual(62);
  });

  for (const make of brandSlugs) {
    it(`keeps truthful, concise metadata and model counts for ${make}`, () => {
      const models = motorcycles.filter((model) => model.makeSlug === make)
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
      const checkedYear = latestBrandPriceCheckYear(current);
      const fallback = motorcycleBrandPriceListDescription(brand, low, high);
      expect(fallback.startsWith(`${title}:`)).toBe(true);
      expect(fallback).toContain("model prices");
      expect(fallback).toContain("engine sizes");
      expect(fallback).toContain("seat heights");
      expect(fallback.length).toBeLessThanOrEqual(158);
      const searchTitle = current.length ? motorcycleBrandSearchTitle(brand, checkedYear) : title;
      const searchDescription = current.length
        ? motorcycleBrandSearchDescription(brand, current.length, low, high, checkedYear)
        : motorcycleBrandPriceListDescription(brand);
      expect(searchTitle.length).toBeLessThanOrEqual(62);
      expect(searchDescription.length).toBeLessThanOrEqual(158);
      if (low !== undefined && high !== undefined) {
        expect(searchDescription).toContain(php(low));
        expect(searchDescription).toContain(php(high));
      }
      if (checkedYear !== undefined) expect(searchTitle).toContain(String(checkedYear));
    });
  }

  for (const make of ["honda", "yamaha", "suzuki", "kawasaki"]) {
    it(`includes model-backed, distinct buying paths for ${make}`, () => {
      const paths = brandSeoGrowthProfile(make)?.buyingPaths;
      const current = motorcycles.filter((model) => model.makeSlug === make && isIndexableModel(model) &&
        !["previous", "uncertain", "discontinued"].includes(model.marketStatus ?? ""));
      expect(paths?.length).toBeGreaterThanOrEqual(3);
      for (const path of paths ?? []) {
        expect(path.description.length).toBeGreaterThan(40);
        expect(path.modelNames.some((name) => current.some((model) => model.model.toLowerCase() === name.toLowerCase()))).toBe(true);
      }
    });
  }
});

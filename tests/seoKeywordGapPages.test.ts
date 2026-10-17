import { describe, expect, it } from "vitest";
import { getEditorialGuide, editorialGuides } from "../lib/editorialGuides";
import { getModelById, getRecommendationGuide, getRecommendationModels, isIndexableRecommendation } from "../lib/data";
import { coreSitemapEntries } from "../lib/sitemaps";
import { recommendationSitemapEntries } from "../lib/recommendationSitemap";
import { getTireModelSeoHub, tireGuideHrefForModel } from "../lib/tireSeo";

const newEditorialSlugs = [
  "semi-automatic-motorcycles-philippines",
  "motorcycle-brands-philippines",
  "motorcycle-loan-philippines",
] as const;

describe("2026 keyword-gap guides: unique, sourced and indexable", () => {
  it("publishes three full-length guides through the canonical editorial registry", () => {
    expect(new Set(editorialGuides.map(g => g.slug)).size).toBe(editorialGuides.length);
    for (const slug of newEditorialSlugs) {
      const guide = getEditorialGuide(slug);
      expect(guide).toBeDefined();
      expect(guide?.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide?.faqs.length).toBeGreaterThanOrEqual(5);
      expect(guide?.related.length).toBeGreaterThan(2);
      expect(guide?.lastChecked).toBe("2026-10-17");
      expect(guide?.sources.every(s => /^https:\/\//.test(s.url))).toBe(true);
      expect(guide?.seoTitle.length).toBeLessThanOrEqual(72);
      expect(guide?.description.length).toBeLessThanOrEqual(180);
      expect(coreSitemapEntries().some(x=>x.url.endsWith("/guides/"+slug))).toBe(true);
    }
  });

  it("never presents the ten editorial brands as measured sales leaders", () => {
    const guide = getEditorialGuide("motorcycle-brands-philippines")!;
    expect(guide.intro).toMatch(/not a verified national sales-volume ranking/i);
    expect(guide.faqs.some(x=>/sales/.test(x.answer))).toBe(true);
    expect(guide.sections[0].body.join(" ")).toContain("alphabetically");
  });

  it("distinguishes verified automatic-clutch underbones from CVT and manual clutch", () => {
    const guide = getEditorialGuide("semi-automatic-motorcycles-philippines")!;
    expect(guide.sources.some(x=>x.url.includes("SMASH-FI.pdf"))).toBe(true);
    expect(guide.intro).toContain("foot lever");
    expect(guide.sections.flatMap(x=>x.body).join(" ")).toMatch(/centrifugal clutch/i);
    expect(guide.faqs.some(x=>/\b(no|not)\b/i.test(x.answer) && x.answer.includes("CVT"))).toBe(true);
  });

  it("treats modeled financing as educational, not a lender quote", () => {
    const guide = getEditorialGuide("motorcycle-loan-philippines")!;
    expect(guide.sources.some(x=>x.url.includes("bsp.gov.ph"))).toBe(true);
    expect(guide.related.some(x=>x.href==="/tools/motorcycle-loan-calculator")).toBe(true);
    expect(guide.intro).toMatch(/not credit offers/i);
    expect(guide.sections.flatMap(x=>x.body).join(" ")).toMatch(/effective interest rate/i);
  });

  it("compares 140–155cc motorcycles across categories instead of duplicating scooter-only intent", () => {
    const guide = getRecommendationGuide("150cc-motorcycles-philippines");
    const models = getRecommendationModels("150cc-motorcycles-philippines");
    expect(guide).toBeDefined();
    expect(models.length).toBeGreaterThanOrEqual(3);
    expect(models.every(m => m.engineCc >= 140 && m.engineCc <= 155)).toBe(true);
    expect(models.some(m => /scooter/i.test(m.category))).toBe(true);
    expect(models.some(m => !/scooter/i.test(m.category))).toBe(true);
    expect(guide?.relatedGuideSlugs).toContain("150cc-scooters-philippines");
    expect(guide?.relatedGuideSlugs).toContain("motorcycles-below-150cc-philippines");
    expect(isIndexableRecommendation("150cc-motorcycles-philippines")).toBe(true);
    expect(recommendationSitemapEntries().some(x=>x.url.endsWith("/recommendations/150cc-motorcycles-philippines"))).toBe(true);
  });

  it("creates a dedicated BeAT tire URL backed by the exact Honda stock sizes", () => {
    const beat = getModelById("honda-beat");
    const tire = getTireModelSeoHub("honda-beat-tire-size");
    expect(beat?.frontTire).toBe("80/90-14");
    expect(beat?.rearTire).toBe("90/90-14");
    expect(beat?.sourceUrl).toBe("https://cms.hondaph.com/files/products/650bce64c3201.pdf");
    expect(tire?.modelId).toBe("honda-beat");
    expect(tireGuideHrefForModel("honda-beat")).toBe("/tires/honda-beat-tire-size");
    expect(coreSitemapEntries().some(x=>x.url.endsWith("/tires/honda-beat-tire-size"))).toBe(true);
  });
});

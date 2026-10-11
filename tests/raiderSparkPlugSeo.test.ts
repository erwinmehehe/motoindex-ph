import { describe, expect, it } from "vitest";
import { getModelById, isIndexableModel } from "../lib/data";
import { modelSparkPlugGuide } from "../lib/modelSparkPlugGuides";
import { motorcycleSitemapEntries } from "../lib/sitemaps";

const expected = "https://motoindexph.com/motorcycles/suzuki/raider-r150/spark-plug";

describe("Raider R150 FI spark plug SEO page", () => {
  it("uses a verified official source, not a generic model-wide fitment claim", () => {
    const guide = modelSparkPlugGuide("suzuki-raider-r150");
    expect(guide).toBeDefined();
    expect(guide?.partCode).toBe("MR8E-9");
    expect(guide?.gapMinMm).toBe(0.8);
    expect(guide?.gapMaxMm).toBe(0.9);
    expect(guide?.appliesTo).toContain("FI");
    expect(guide?.sourceUrl).toContain("mc.suzuki.com.ph/");
    expect(modelSparkPlugGuide("honda-click-125i")).toBeUndefined();
  });

  it("publishes one indexable page with no duplicate sitemap entry", () => {
    const model = getModelById("suzuki-raider-r150");
    expect(model && isIndexableModel(model)).toBeTruthy();
    const urls = motorcycleSitemapEntries().map(entry => entry.url);
    expect(urls.filter(url => url === expected)).toHaveLength(1);
  });
});

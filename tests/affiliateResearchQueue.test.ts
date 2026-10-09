import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allCatalogProducts } from "../lib/catalog";
import { isExactShopeeProductUrl, isSpecificRetailerProductUrl, sourcedRetailerProductListing, sourcedShopeeProductListing } from "../lib/affiliateDestinations";
import { getAffiliateLinks } from "../lib/affiliate";
import { getAffiliateResearchCandidate, listAffiliateResearchCandidates } from "../lib/affiliateResearch";

describe("affiliate research is a review queue, not a monetized source", () => {
  it("keeps unique, catalog-backed item candidates pending live browser QA", () => {
    const rows = listAffiliateResearchCandidates();
    expect(rows.length).toBeGreaterThanOrEqual(24);
    expect(new Set(rows.map(row => row.productId)).size).toBe(rows.length);
    expect(new Set(rows.map(row => row.sourceUrl)).size).toBe(rows.length);
    const catalog = new Set(allCatalogProducts().map(product => product.id));
    for (const row of rows) {
      expect(catalog.has(row.productId)).toBe(true);
      expect(row.reviewStatus).toBe("needs_live_browser_review");
      expect(row.sourceUrl.startsWith("https://")).toBe(true);
      expect(row.sourceKind === "shopee"
        ? isExactShopeeProductUrl(row.sourceUrl)
        : isSpecificRetailerProductUrl(row.sourceUrl)).toBe(true);
      expect(row.reviewNote.length).toBeGreaterThan(10);
    }
  });

  it("keeps candidate references synchronized with the item-level research inventory", () => {
    const csv = fs.readFileSync(path.join(process.cwd(), "docs/affiliate-product-coverage-2026-10-09.csv"), "utf8");
    const rows = csv.trim().split(/\r?\n/).slice(1);
    const indexed = new Map(rows.map(row => {
      const cells = row.split('","');
      return [cells[0].replace(/^"/, ""), cells];
    }));
    for (const item of listAffiliateResearchCandidates()) {
      const row = indexed.get(item.productId);
      expect(row).toBeDefined();
      expect(row?.[5]).toBe(item.sourceUrl);
      expect(row?.[4]).toBe(item.sourceKind === "shopee" ? "shopee_exact_editorial" : "exact_retailer_editorial");
    }
  });

  it("does not automatically activate an unreviewed reference as a public offer", () => {
    const item = getAffiliateResearchCandidate("ls2-storm-iii");
    expect(item?.reviewStatus).toBe("needs_live_browser_review");
    expect(sourcedShopeeProductListing("ls2-storm-iii")).toBeUndefined();
    expect(sourcedRetailerProductListing("ls2-storm-iii")).toBeUndefined();
    expect(getAffiliateLinks("ls2-storm-iii")).toEqual([]);
  });

  it("flags the mixed-variant Explorer and marketplace Gullwing candidates for review", () => {
    expect(getAffiliateResearchCandidate("ls2-explorer")?.reviewNote).toMatch(/variant|carbon/i);
    expect(getAffiliateResearchCandidate("smk-gullwing")?.reviewNote).toMatch(/seller|variation|listing/i);
  });
});

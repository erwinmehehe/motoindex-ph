import { describe, expect, it } from "vitest";
import { getModelById } from "../lib/data";
import { latestPriceReference } from "../lib/marketChecks";
import { priceFaqsForModel } from "../lib/priceSeo";
import { latestResearchCheck, PRICE_INDEX_BASELINE_DATE, researchBrandPriceBenchmarks, researchPriceRows } from "../lib/researchData";

function model(id: string) {
  const result = getModelById(id);
  if (!result) throw new Error(`Missing test motorcycle: ${id}`);
  return result;
}

describe("source-dated motorcycle price FAQs", () => {
  it("uses the most recent price observation when it is newer than the catalog baseline", () => {
    const pcx = model("honda-pcx-160");
    expect(latestPriceReference(pcx)).toEqual({
      date: "2026-10-01",
      kind: "price-check"
    });
    const dateFaq = priceFaqsForModel(pcx, "₱133,500–₱155,000")
      .find((item) => item.question.startsWith("When was"));
    expect(dateFaq?.answer).toContain("2026-10-01");
    expect(dateFaq?.answer).not.toContain(pcx.marketPriceCheckedAt || "not-a-date");
  });

  it("keeps a newer explicit model-level price check when observations are older", () => {
    expect(latestPriceReference(model("yamaha-aerox-v3"))).toEqual({
      date: "2026-09-22",
      kind: "price-check"
    });
  });

  it("does not misrepresent a specification verification as an independent price check", () => {
    const unpriced = {
      ...model("yamaha-aerox-v3"),
      id: "regression-unpriced-model",
      marketPriceCheckedAt: undefined,
      verifiedAt: "2026-09-17"
    };
    expect(latestPriceReference(unpriced)).toEqual({
      date: "2026-09-17",
      kind: "model-source"
    });
    const faq = priceFaqsForModel(unpriced, "₱125,900")
      .find((item) => item.question.startsWith("When was"));
    expect(faq?.answer).toContain("no separate dated price check");
    expect(faq?.answer).not.toContain("latest recorded price-source check");
  });
});

describe("original motorcycle price research integrity", () => {
  it("does not split Kymco into separate brand statistics by casing", () => {
    const rows = researchPriceRows().filter((row) => row.model.makeSlug === "kymco");
    expect(rows.length).toBeGreaterThan(0);
    const brands = researchBrandPriceBenchmarks(1).filter((row) => row.makeSlug === "kymco");
    expect(brands).toHaveLength(1);
    expect(brands[0].count).toBe(rows.length);
    expect(brands[0].make).toBe("KYMCO");
    expect(new Set(researchBrandPriceBenchmarks(1).map((row) => row.makeSlug)).size)
      .toBe(researchBrandPriceBenchmarks(1).length);
  });

  it("exports true price-check dates and preserves the dataset baseline", () => {
    const rows = researchPriceRows();
    expect(rows.find((row) => row.model.id === "honda-pcx-160")?.checkedAt).toBe("2026-10-01");
    expect(rows.every((row) => row.checkedAt === "" || /^\d{4}-\d{2}-\d{2}$/.test(row.checkedAt))).toBe(true);
    expect(latestResearchCheck() >= PRICE_INDEX_BASELINE_DATE).toBe(true);
  });
});

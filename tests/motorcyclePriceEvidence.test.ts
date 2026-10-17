import { describe, expect, it } from "vitest";
import { getModelById } from "../lib/data";
import { latestPriceReference, priceChecksForModel } from "../lib/marketChecks";
import { priceFaqsForModel } from "../lib/priceSeo";
import { latestResearchCheck, PRICE_INDEX_BASELINE_DATE, researchPriceRows } from "../lib/researchData";

function getModel(id: string) {
  const model = getModelById(id);
  if (!model) throw new Error("Missing fixture motorcycle: " + id);
  return model;
}

describe("price evidence is distinct from general model verification", () => {
  it("uses the latest dated source price observation rather than an older catalog check", () => {
    const model = getModel("honda-pcx-160");
    const candidateDates = [
      model.marketPriceCheckedAt,
      ...priceChecksForModel(model.id).map((item) => item.checkedAt),
    ].filter((date): date is string => Boolean(date));
    expect(candidateDates.length).toBeGreaterThan(0);
    const expected = candidateDates.sort().at(-1)!;
    expect(latestPriceReference(model)).toEqual({ date: expected, kind: "price-check" });
    const item = priceFaqsForModel(model, "sample price").find((faq) => faq.question.startsWith("When was"));
    expect(item?.answer).toContain(expected);
  });

  it("does not mislabel an undated specification check as fresh price research", () => {
    const base = getModel("yamaha-aerox-v3");
    const model = { ...base, id: "test-no-price-observations", marketPriceCheckedAt: undefined, verifiedAt: "2026-09-17" };
    expect(priceChecksForModel(model.id)).toEqual([]);
    expect(latestPriceReference(model)).toEqual({ date: "2026-09-17", kind: "model-source" });
    const faq = priceFaqsForModel(model, "sample price").find((item) => item.question.startsWith("When was"));
    expect(faq?.answer).toContain("no separate dated price check");
  });

  it("does not invent a date in price CSV data where no price observation exists", () => {
    const rows = researchPriceRows();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.checkedAt === "" || /^\d{4}-\d{2}-\d{2}$/.test(row.checkedAt))).toBe(true);
    expect(latestResearchCheck() >= PRICE_INDEX_BASELINE_DATE).toBe(true);
  });
});

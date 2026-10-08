import { describe, expect, it } from "vitest";
import { getModelById } from "../lib/data";
import { latestPriceReference } from "../lib/marketChecks";
import { priceFaqsForModel } from "../lib/priceSeo";

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

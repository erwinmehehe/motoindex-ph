import { describe, expect, it } from "vitest";
import { answerAbsGuideQuestion } from "../lib/absGuideFaq";
import { getModelById, getRecommendationModels } from "../lib/data";
import { researchBrandPriceBenchmarks, researchPriceRows } from "../lib/researchData";

describe("ABS guide questions use the relevant motorcycle subset", () => {
  const models = getRecommendationModels("motorcycles-with-abs-philippines");

  it("answers a scooter question about scooters, not the total motorcycle count", () => {
    const answer = answerAbsGuideQuestion("Which scooters have ABS?", models);
    expect(answer).toMatch(/scooter models with ABS/i);
    expect(answer).toMatch(/variant/i);
  });

  it("distinguishes Honda Click CBS from ABS, even though the Click is not in the ABS guide", () => {
    const answer = answerAbsGuideQuestion("Does the Honda Click have ABS?", models, getModelById("honda-click-160"));
    expect(answer).toMatch(/Combined Braking System|CBS/i);
    expect(answer).toMatch(/not ABS/i);
  });

  it("explains single and dual channel ABS independently of the total guide count", () => {
    const answer = answerAbsGuideQuestion("What is single-channel vs dual-channel ABS?", models);
    expect(answer).toMatch(/front and rear wheels separately/i);
    expect(answer).toMatch(/CBS/i);
  });

  it("does not claim ABS is standard on all trims", () => {
    expect(answerAbsGuideQuestion("Is ABS standard on every variant?", models)).toMatch(/^No\./);
  });
});

describe("price research uses one canonical brand identity", () => {
  it("groups all KYMCO casing variants under one brand benchmark", () => {
    const kymco = researchPriceRows().filter((row) => row.model.makeSlug.toLowerCase() === "kymco");
    const benchmarks = researchBrandPriceBenchmarks(1).filter((row) => row.makeSlug === "kymco");
    if (!kymco.length) return;
    expect(benchmarks).toHaveLength(1);
    expect(benchmarks[0].make).toBe("KYMCO");
    expect(benchmarks[0].count).toBe(kymco.length);
  });
});

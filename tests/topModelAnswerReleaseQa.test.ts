import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getModelById } from "../lib/data";
import { latestPriceReference, observedMarketPriceLabel } from "../lib/marketChecks";
import { highIntentModelAnswer } from "../lib/highIntentModelAnswers";

const targets = [
  "yamaha-aerox-v3", "yamaha-nmax-v3", "honda-adv-160", "honda-click-160",
] as const;

describe("priority model AEO and SEO release contracts", () => {
  it("answers the four GSC-priority model questions without fabricating prices or live stock", () => {
    for (const id of targets) {
      const model = getModelById(id);
      const answer = highIntentModelAnswer(id);
      expect(model).toBeDefined();
      expect(answer?.question).toMatch(/\?$/);
      expect(answer?.answer.length).toBeGreaterThan(100);
      expect(answer?.answer).not.toMatch(/guaranteed|live price|in stock today|best deal/i);
      expect(answer?.answer).not.toMatch(/₱[\d,]+/);
      expect(answer?.compareHref).toMatch(/^\/motorcycles\/[a-z0-9-]+\/[a-z0-9-]+$/);
      const [, , make, slug] = answer!.compareHref.split("/");
      expect(getModelById(make + "-" + slug)).toBeDefined();
      expect(observedMarketPriceLabel(model!)).toContain("₱");
      expect(latestPriceReference(model!).date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("leaves unrelated and previous-generation pages alone", () => {
    expect(highIntentModelAnswer("yamaha-aerox-v2")).toBeUndefined();
    expect(highIntentModelAnswer("honda-beat")).toBeUndefined();
    const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
    expect(hero).toContain("highIntentModelAnswer(model.id)");
    expect(hero).toContain('latestPrice?.kind === "price-check"');
    expect(hero).toContain('href="#price"');
  });

  it("checks all five newly added canonical SEO gap routes in production smoke QA", () => {
    const smoke = readFileSync(new URL("../scripts/smoke-public-core.mjs", import.meta.url), "utf8");
    for (const route of [
      "/guides/motorcycle-loan-philippines",
      "/guides/semi-automatic-motorcycles-philippines",
      "/recommendations/150cc-motorcycles-philippines",
      "/tires/honda-beat-tire-size",
      "/guides/motorcycle-brands-philippines",
    ]) expect(smoke).toContain('"' + route + '"');
    expect(smoke).toContain("seoReleaseRoutes.includes(path)");
    expect(smoke).toContain("canonical mismatch");
    expect(smoke).toContain("unexpectedly noindex");
    expect(smoke).toContain("missing JSON-LD");
  });
});

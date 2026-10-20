import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getModelById } from "../lib/data";
import { highIntentModelAnswer } from "../lib/highIntentModelAnswers";
import { motorcycleEntityFaqs } from "../lib/motorcycleEntitySeo";
import { latestPriceReference, observedMarketPriceLabel } from "../lib/marketChecks";

const targets = [
  { id: "rusi-classic-250i", question: "Does the Rusi Classic 250i have confirmed ABS?" },
  { id: "yamaha-fazzio", question: "Does the current Yamaha Fazzio specification list ABS?" },
  { id: "yamaha-mio-gear", question: "Does the Yamaha Mio Gear have ABS?" },
  { id: "yamaha-sniper-155", question: "Is ABS standard on every Yamaha Sniper 155 variant?" },
] as const;

describe("AEO Batch 2: source-scoped canonical motorcycle buyer answers", () => {
  it("adds answer-first research to four current models, not new routes or invented prices", () => {
    for (const { id } of targets) {
      const model = getModelById(id);
      const answer = highIntentModelAnswer(id);
      expect(model).toBeDefined();
      expect(model?.marketStatus).toBe("current");
      expect(model?.freshness).toBe("verified");
      expect(model?.sourceUrl).toMatch(/^https:\/\//);
      expect(model?.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(latestPriceReference(model!).date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(observedMarketPriceLabel(model!)).toContain("₱");
      expect(answer?.question).toMatch(/\?$/);
      expect(answer?.answer.length).toBeGreaterThan(150);
      expect(answer?.answer).not.toMatch(/₱[\d,]+|guaranteed|official dealer quote|live inventory|in stock today|best deal/i);
      expect(answer?.compareHref).toMatch(/^\/motorcycles\/[a-z0-9-]+\/[a-z0-9-]+$/);
      const [, , make, slug] = answer!.compareHref.split("/");
      expect(getModelById(make + "-" + slug)).toBeDefined();
    }
  });

  it("keeps safety/availability FAQ wording visible and aligned to the existing FAQ schema", () => {
    for (const { id, question } of targets) {
      const model = getModelById(id)!;
      const faqs = motorcycleEntityFaqs(model);
      const safety = faqs.find(faq => faq.question === question);
      expect(safety, "Missing target question for " + id).toBeDefined();
      expect(safety!.answer.length).toBeGreaterThan(70);
      expect(safety!.answer).not.toMatch(/all variants have ABS|every model includes ABS|guaranteed/i);
      const entity = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
      expect(entity).toContain("mainEntity: faqs.map((item) => (");
      expect(entity).toContain("<FaqSection title={`${model.make} ${model.model} FAQs`} items={faqs} />");
    }
  });

  it("keeps visible dated source links and manual canonical-route smoke coverage", () => {
    const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
    const smoke = readFileSync(new URL("../scripts/smoke-public-core.mjs", import.meta.url), "utf8");
    expect(hero).toContain("highIntentModelAnswer(model.id)");
    expect(hero).toContain("Model specification reference checked {model.verifiedAt}");
    expect(hero).toContain('<SourceRef url={model.sourceUrl} label="View cited model source" />');
    expect(hero).toContain('href="#price"');
    for (const { id } of targets) {
      const model = getModelById(id)!;
      expect(smoke).toContain(`"/motorcycles/${model.makeSlug}/${model.slug}"`);
    }
    expect(smoke).toContain("aeoModelBatch2Routes.includes(path)");
    expect(smoke).toContain("missing visible model-source attribution");
    expect(smoke).toContain("canonical mismatch");
    expect(smoke).toContain("unexpectedly noindex");
  });
});

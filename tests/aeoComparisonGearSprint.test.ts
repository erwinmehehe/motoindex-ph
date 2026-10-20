import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getComparison } from "../lib/data";
import { priorityComparisonAnswers } from "../lib/priorityComparisonAnswers";
import { faqPageSchema } from "../lib/structuredData";
import { getVerifiedVariantsForModel } from "../lib/variants";
import { latestPriceReference, observedMarketPriceLabel } from "../lib/marketChecks";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const targetSlugs = ["aerox-v3-vs-nmax-v3", "adv-160-vs-pcx-160"] as const;

describe("AEO: priority comparison answers and gear authority hubs", () => {
  it("answers from the correct verified model and variant records", () => {
    for (const slug of targetSlugs) {
      const pair = getComparison(slug);
      expect(pair).toBeDefined();
      const answers = priorityComparisonAnswers(slug, pair!.a, pair!.b);
      expect(answers).toHaveLength(3);
      expect(new Set(answers!.map(item => item.question)).size).toBe(3);
      for (const item of answers!) {
        expect(item.question).toMatch(/\?$/);
        expect(item.answer.length).toBeGreaterThan(120);
        expect(item.answer).not.toMatch(/guaranteed|in stock today|live dealer quote|universal winner/i);
      }
      for (const model of [pair!.a, pair!.b]) {
        expect(model.marketStatus).toBe("current");
        expect(model.sourceUrl).toMatch(/^https:\/\//);
        expect(model.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(latestPriceReference(model).date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(getVerifiedVariantsForModel(model.id).length).toBeGreaterThanOrEqual(2);
        expect(answers!.some(item => item.answer.includes(observedMarketPriceLabel(model)))).toBe(true);
      }
      const faq = faqPageSchema(answers!);
      expect(faq.mainEntity.map(row => [row.name, row.acceptedAnswer.text]))
        .toEqual(answers!.map(item => [item.question, item.answer]));
    }
  });

  it("does not fabricate missing Honda PCX160 clearance data or generic other-pair QAs", () => {
    const pair = getComparison("adv-160-vs-pcx-160")!;
    expect(pair.b.groundClearanceMm).toBeUndefined();
    const answer = priorityComparisonAnswers(pair.slug, pair.a, pair.b)![0].answer;
    expect(answer).toContain("does not normalize a matching clearance figure");
    const unrelated = getComparison("click-160-vs-aerox-v3")!;
    expect(priorityComparisonAnswers(unrelated.slug, unrelated.a, unrelated.b)).toBeUndefined();
  });

  it("renders top-of-page answers before large tables with evidence and exact FAQ markup", () => {
    const route = read("app/compare/[slug]/page.tsx");
    const component = read("components/PriorityComparisonAnswer.tsx");
    expect(route.indexOf("<PriorityComparisonAnswer")).toBeGreaterThan(0);
    expect(route.indexOf("<PriorityComparisonAnswer")).toBeLessThan(route.indexOf("<ComparisonProductCards"));
    expect(route).toContain("faqPageSchema(priorityAnswers)");
    expect(component).toContain("data-priority-comparison-answer");
    expect(component).toContain("<QuickAnswer");
    expect(component).toContain("items.slice(1).map");
    expect(component).toContain("latestPriceReference(model)");
    expect(component).toContain("model.verifiedAt");
    expect(component).toContain('model.slug + "#price"');
    expect(component).toContain("<SourceRef");
  });

  it("keeps each gear FAQ visible and shares its exact Q&A array with JSON-LD", () => {
    for (const [route, faqArg] of [
      ["app/gear/helmets/page.tsx", "faqs"],
      ["app/tires/page.tsx", "tireFaqs"],
      ["app/accessories/page.tsx", "accessoryFaqs"]
    ]) {
      const src = read(route);
      expect(src).toContain("<QuickAnswer");
      expect(src).toContain("<FaqSection");
      expect(src).toContain("faqPageSchema(" + faqArg + ")");
      expect(src).not.toContain('dynamic = "force-static"');
    }
    expect(read("app/gear/helmets/page.tsx")).toContain("PS or ICC");
    expect(read("app/tires/page.tsx")).toContain("90/90-14 M/C 46P TL");
    expect(read("app/accessories/page.tsx")).toContain("Does a top box fit any motorcycle");
  });

  it("adds canonical post-release smoke checks without changing published titles", () => {
    const smoke = read("scripts/smoke-public-core.mjs");
    for (const slug of targetSlugs) expect(smoke).toContain('"/compare/' + slug + '"');
    for (const route of ["/gear/helmets", "/tires", "/accessories"]) expect(smoke).toContain('"' + route + '"');
    expect(smoke).toContain("data-aeo-quick-answer");
    expect(smoke).toContain("missing matching visible FAQ JSON-LD");
    expect(smoke).toContain("canonical mismatch");
    expect(smoke).toContain("unexpectedly noindex");
  });
});

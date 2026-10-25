import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";

const targets = [
  { id: "yamaha-aerox-v3", title: "Aerox V3 Price Philippines | MotoIndex", h1: "Aerox V3 Price Philippines" },
  { id: "yamaha-nmax-v3", title: "NMAX V3 Price Philippines | MotoIndex", h1: "NMAX V3 Price Philippines" },
  { id: "honda-adv-160", title: "ADV 160 Price Philippines | MotoIndex", h1: "ADV 160 Price Philippines" }
] as const;

describe("model-first price SEO titles and H1s", () => {
  const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");

  it("uses the requested metadata on the canonical model route, including the ADV160 override", () => {
    expect(route).toContain("title: intentDepth?.seoTitle || growth?.seoTitle || seo.title");
    for (const { id, title } of targets) {
      expect(priorityModelGrowthProfile(id)?.seoTitle).toBe(title);
      const resolvedTitle = modelIntentDepthProfile(id)?.seoTitle || priorityModelGrowthProfile(id)?.seoTitle;
      expect(resolvedTitle).toBe(title);
    }
  });

  it("renders the requested model-specific H1 without changing the hero fallback for other bikes", () => {
    expect(route).toContain("<ReviewedModelHero model={model} />");
    for (const { id, h1 } of targets) {
      expect(hero).toContain(`"${id}": "${h1}"`);
    }
    expect(hero).toContain("<h1>{priceFocusedHeading || <>{model.make}<br />{model.model}</>}</h1>");
  });
});

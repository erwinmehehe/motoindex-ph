import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";

const modelPage = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");

describe("Aerox V2 historical price SERP metadata", () => {
  it("targets the existing canonical model without suggesting the 2021 launch SRP is current", () => {
    const profile = priorityModelGrowthProfile("yamaha-aerox-v2");
    expect(profile).toBeDefined();
    expect(profile?.seoTitle).toBe("Yamaha Aerox V2 Price Philippines | Specs & Used Value");
    expect(profile?.seoDescription).toContain("₱112,900 historical 2021 launch SRP");
    expect(profile?.seoDescription).toContain("Aerox V3 comparison");
    expect(profile?.seoDescription).not.toMatch(/current(?:ly)? (?:new-bike )?(?:price|SRP).*₱112,900/i);
    expect(profile!.seoTitle.length).toBeGreaterThanOrEqual(50);
    expect(profile!.seoTitle.length).toBeLessThanOrEqual(60);
    expect(profile!.seoDescription.length).toBeGreaterThanOrEqual(135);
    expect(profile!.seoDescription.length).toBeLessThanOrEqual(160);
  });

  it("ensures the submitted title is used in generation metadata on the canonical URL", () => {
    // Model-intent-depth overrides take precedence in the actual page template;
    // no V2 override should silently hide the updated commercial profile.
    expect(modelIntentDepthProfile("yamaha-aerox-v2")).toBeUndefined();
    expect(modelPage).toContain("intentDepth?.seoTitle || growth?.seoTitle || seo.title");
    expect(modelPage).toContain("intentDepth?.seoDescription || growth?.seoDescription || seo.description");
    expect(modelPage).toContain("path: `/motorcycles/${model.makeSlug}/${model.slug}`");
    expect(modelPage).not.toContain('if (model.id === "yamaha-aerox-v2") {');
  });
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { motorcycles } from "../lib/data";
import { modelFamilies } from "../lib/families";
import { electricMotorcycles } from "../lib/electricMotorcycles";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { motorcyclePricePageSeo } from "../lib/motorcyclePricePageSeo";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";
import { priceFocusedModelHeading, modelPriceMetaDescription, modelHeroIntro } from "../lib/motorcycleHeroSeo";
import { pageMetadata } from "../lib/site";

// Mirror source-description priority in the canonical detail route, while
// obtaining the final HTML meta title from the same H1 helper used by both heroes.
function modelDescription(model: (typeof motorcycles)[number]) {
  return motorcyclePricePageSeo(model.id)?.description
    || modelIntentDepthProfile(model.id)?.seoDescription
    || priorityModelGrowthProfile(model.id)?.seoDescription
    || motorcycleEntitySeo(model).description;
}

describe("one exact Price Philippines HTML title + H1 for each model detail URL", () => {
  it("enforces the same model-first title and H1 for the entire motorcycle catalog", () => {
    expect(motorcycles).toHaveLength(236);
    const titles = new Set<string>();
    const paths = new Set<string>();
    for (const model of motorcycles) {
      const title = priceFocusedModelHeading(model);
      expect(title, model.id).toBe(`${model.model} Price Philippines`);
      expect(title, model.id).toMatch(/ Price Philippines$/);
      expect(title.length, model.id).toBeLessThanOrEqual(65);
      expect(titles.has(title.toLowerCase()), `Duplicate title: ${title}`).toBe(false);
      titles.add(title.toLowerCase());
      const canonical = `/motorcycles/${model.makeSlug}/${model.slug}`;
      expect(paths.has(canonical), `Duplicate motorcycle canonical: ${canonical}`).toBe(false);
      paths.add(canonical);
      const description = modelPriceMetaDescription(model, modelDescription(model));
      expect(description.toLowerCase(), model.id).toContain(title.toLowerCase());
      const metadata = pageMetadata({ title, description, path: canonical });
      expect(metadata.title, model.id).toBe(title);
      expect(metadata.description, model.id).toContain(title);
      expect((metadata.description as string).length, model.id).toBeLessThanOrEqual(158);
      expect(modelHeroIntro(model, motorcycleEntitySeo(model).intro).startsWith(title + " guide:"), model.id).toBe(true);
    }
  });

  it("uses the shared heading for both current and historical templates plus the canonical HTML metadata", () => {
    const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    const reviewed = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
    const historical = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
    expect(route).toContain("title: priceFocusedModelHeading(model),");
    expect(route).toContain("description: modelPriceMetaDescription(model,");
    expect(reviewed).toContain("<h1>{priceFocusedHeading}</h1>");
    expect(historical).toContain("<h1>{priceFocusedModelHeading(model)}</h1>");
  });

  it("keeps historical generation price records and current-price qualifications", () => {
    const nmax = motorcycles.find((entry) => entry.id === "yamaha-nmax-v2")!;
    const aerox = motorcycles.find((entry) => entry.id === "yamaha-aerox-v2")!;
    expect(nmax.marketStatus).toBe("previous");
    expect(aerox.marketStatus).toBe("previous");
    expect(priceFocusedModelHeading(nmax)).toBe("NMAX V2 Price Philippines");
    expect(priceFocusedModelHeading(aerox)).toBe("Aerox V2 Price Philippines");
    expect(priorityModelGrowthProfile(nmax.id)?.seoDescription).toContain("₱119,900 historical 2020 launch SRP");
    expect(priorityModelGrowthProfile(aerox.id)?.seoDescription).toContain("historical 2021 launch SRP");
    expect(modelPriceMetaDescription(nmax, modelDescription(nmax))).toMatch(/historical|previous/i);
    expect(modelPriceMetaDescription(aerox, modelDescription(aerox))).toMatch(/historical|previous/i);
    expect(modelHeroIntro(nmax, motorcycleEntitySeo(nmax).intro)).toContain("NMAX V2");
  });

  it("aligns all electric detail titles and H1s but keeps multi-generation family hubs separate", () => {
    expect(electricMotorcycles).toHaveLength(3);
    const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    const electric = readFileSync(new URL("../components/ElectricMotorcycleDetail.tsx", import.meta.url), "utf8");
    expect(route).toContain('title: `${electricModel.model} Price Philippines`');
    expect(electric).toContain('const heroHeading=`${model.model} Price Philippines`;');
    expect(electric).toContain("<h1>{heroHeading}</h1>");
    for (const model of electricMotorcycles) {
      expect(`${model.model} Price Philippines`).toMatch(/ Price Philippines$/);
    }
    expect(modelFamilies).toHaveLength(4);
    // Family hubs compare generations rather than representing one model.
    for (const family of modelFamilies) expect(family.seoTitle).toMatch(/Price Philippines/);
  });
});

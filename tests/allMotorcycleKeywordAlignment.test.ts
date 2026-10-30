import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { motorcycles } from "../lib/data";
import { electricMotorcycles } from "../lib/electricMotorcycles";
import { modelFamilies } from "../lib/families";
import { getRenderableMedia } from "../lib/renderableMedia";
import { licensedHistoricalMotorcycleImage } from "../lib/licensedMotorcycleReference";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { motorcyclePricePageSeo } from "../lib/motorcyclePricePageSeo";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";
import { contextualHeroImageAlt, modelHeroImageAlt, modelHeroIntro, modelPriceMetaDescription, priceFocusedModelHeading } from "../lib/motorcycleHeroSeo";
import { pageMetadata } from "../lib/site";

function sourceDescription(id: string) {
  const model = motorcycles.find((bike) => bike.id === id)!;
  return motorcyclePricePageSeo(id)?.description
    || modelIntentDepthProfile(id)?.seoDescription
    || priorityModelGrowthProfile(id)?.seoDescription
    || motorcycleEntitySeo(model).description;
}

describe("catalog-wide keyword audit for all single-model pages", () => {
  it("requires the exact keyword in all 236 standard meta titles, descriptions, H1s, and hero intros", () => {
    expect(motorcycles).toHaveLength(236);
    expect(priceFocusedModelHeading(motorcycles.find((m) => m.id === "honda-click-160")!)).toBe("Honda Click 160 Price Philippines");
    const keywords = new Set<string>();
    for (const model of motorcycles) {
      const keyword = model.make + " " + model.model + " Price Philippines";
      expect(priceFocusedModelHeading(model), model.id).toBe(keyword);
      expect(keywords.has(keyword.toLowerCase()), model.id).toBe(false);
      keywords.add(keyword.toLowerCase());

      const description = modelPriceMetaDescription(model, sourceDescription(model.id));
      const metadata = pageMetadata({
        title: keyword,
        description,
        path: "/motorcycles/" + model.makeSlug + "/" + model.slug
      });
      expect(metadata.title, model.id).toBe(keyword);
      const snippet = String(metadata.description);
      expect(snippet.startsWith(keyword), model.id).toBe(true);
      expect(snippet.length, model.id).toBeLessThanOrEqual(158);
      const intro = modelHeroIntro(model, motorcycleEntitySeo(model).intro);
      expect(intro.startsWith(keyword + " guide:"), model.id).toBe(true);
      expect(intro.toLowerCase(), model.id).toContain((model.make + " " + model.model).toLowerCase());

      if (model.marketStatus === "previous" || model.marketStatus === "discontinued") {
        expect(snippet, model.id).toMatch(/historical|previous|discontinued|dated|last published|used|not a current/i);
        expect(intro, model.id).toMatch(/historical|previous|discontinued|dated|used|not a current/i);
      }
      if (model.marketStatus === "uncertain") {
        expect(snippet, model.id).toMatch(/availability|confirm|verify|uncertain/i);
      }
    }
  });

  it("normalizes compact model-name aliases without duplicating the price query", () => {
    const pcx = motorcycles.find((model) => model.id === "honda-pcx-160")!;
    const original = modelIntentDepthProfile(pcx.id)?.seoDescription;
    expect(original).toBeDefined();
    expect(original).toContain("Honda PCX160 price Philippines");
    const resolved = modelPriceMetaDescription(pcx, original!);
    expect(resolved).toMatch(/^Honda PCX 160 Price Philippines 2026/i);
    expect(resolved).not.toContain("Honda PCX160 price Philippines");

    const nmax = motorcycles.find((model) => model.id === "yamaha-nmax-v2")!;
    const historical = modelPriceMetaDescription(nmax, sourceDescription(nmax.id));
    expect(historical).toContain("NMAX V2 Price Philippines");
    expect(historical).toMatch(/historical|previous/i);
  });

  it("includes each H1 keyword in primary image alts, including correctly labeled placeholders", () => {
    const placeholders: string[] = [];
    for (const model of motorcycles) {
      const keyword = priceFocusedModelHeading(model);
      const media = getRenderableMedia("motorcycle", model.id)[0];
      expect(media, model.id).toBeDefined();
      const licensedPhoto = licensedHistoricalMotorcycleImage(model.id);
      const alt = modelHeroImageAlt(model, licensedPhoto?.alt || media.alt);
      expect(alt, model.id).toContain(keyword);
      if (media.src.includes("/media/placeholders/") && !licensedPhoto) {
        placeholders.push(model.id);
        expect(alt, model.id).toMatch(/placeholder/i);
      } else if (!licensedPhoto) {
        expect(alt.toLowerCase(), model.id).toContain(media.alt.toLowerCase());
      }
      if (licensedPhoto) expect(licensedPhoto.licenseUrl).toContain("/by-sa/4.0/");
    }
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it("connects keyword alts to actual HTML hero images, previews and fallback assets", () => {
    const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
    const gallery = readFileSync(new URL("../components/ReviewedModelGallery.tsx", import.meta.url), "utf8");
    const historical = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
    const fallback = readFileSync(new URL("../components/EntityVerificationFallback.tsx", import.meta.url), "utf8");
    expect(route).toContain("title: priceFocusedModelHeading(model),");
    expect(route).toContain("description: modelPriceMetaDescription(model,");
    expect(route).toContain("imageAlt: modelHeroImageAlt(model, historicalPhoto?.alt || media?.alt");
    expect(hero).toContain("alt:modelHeroImageAlt(model,alt)");
    expect(hero).toContain("<h1>{priceFocusedHeading}</h1>");
    expect(gallery).toContain("alt={images[selected].alt}");
    expect(gallery).toContain("aria-label=");
    expect(historical).toContain("<h1>{priceFocusedModelHeading(model)}</h1>");
    expect(historical).toContain("keyword={priceFocusedModelHeading(model)}");
    expect(historical).toContain("alt={modelHeroImageAlt(model, historicalPhoto.alt)}");
    expect(fallback).toContain('alt={keyword ? accessibleLabel : ""}');
  });

  it("covers all three electric model pages while keeping four comparison-only hubs separate", () => {
    expect(electricMotorcycles).toHaveLength(3);
    const electric = readFileSync(new URL("../components/ElectricMotorcycleDetail.tsx", import.meta.url), "utf8");
    const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    expect(electric).toContain("alt={heroImageAlt}");
    expect(electric).toContain("{heroHeading} guide:");
    expect(electric).toContain("<h1>{heroHeading}</h1>");
    expect(route).toContain("title: priceFocusedModelHeading(electricModel),");
    for (const model of electricMotorcycles) {
      const keyword = model.make + " " + model.model + " Price Philippines";
      const alt = contextualHeroImageAlt(model.make + " " + model.model + " electric motorcycle", keyword);
      expect(alt).toContain(keyword);
      const desc = keyword + ": Compare " + model.make + " " + model.model + " battery, claimed range, charging, top speed and LTO classification.";
      const metadata = pageMetadata({ title: keyword, description: desc, path: "/motorcycles/electric/" + model.slug });
      expect(String(metadata.description)).toContain(keyword);
    }
    expect(modelFamilies).toHaveLength(4);
    for (const family of modelFamilies) {
      expect(family.generationIds.length).toBeGreaterThan(1);
      expect(family.seoTitle).toContain(`${family.make} ${family.name} Price Philippines`);
    }
  });
});

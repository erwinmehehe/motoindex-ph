import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { motorcycles } from "../lib/data";
import { getRenderableMedia } from "../lib/renderableMedia";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { contextualHeroImageAlt, modelHeroImageAlt, modelHeroIntro, priceFocusedModelHeading } from "../lib/motorcycleHeroSeo";

describe("motorcycle hero keyword alignment", () => {
  it("keeps every catalog model hero lede aligned with its name and Philippine price intent", () => {
    expect(motorcycles.length).toBeGreaterThan(200);
    for (const model of motorcycles) {
      const lede = modelHeroIntro(model, motorcycleEntitySeo(model).intro);
      expect(lede.toLowerCase(), model.id).toContain(`${model.make} ${model.model}`.toLowerCase());
      expect(lede, model.id).toMatch(/Philippine|Philippines/i);
      const expectedH1 = priceFocusedModelHeading(model);
      expect(lede.startsWith(`${expectedH1} guide:`), model.id).toBe(true);
    }
  });

  it("preserves accurate photo descriptions and adds the model keyword to hero image alt text", () => {
    for (const model of motorcycles) {
      const mainImage = getRenderableMedia("motorcycle", model.id)[0];
      expect(mainImage, model.id).toBeDefined();
      const alt = modelHeroImageAlt(model, mainImage.alt);
      const keyword = priceFocusedModelHeading(model);
      expect(alt, model.id).toContain(mainImage.alt);
      expect(alt, model.id).toContain(keyword);
      if (mainImage.src.includes("/placeholders/")) expect(alt, model.id).toMatch(/placeholder/i);
    }
  });

  it("does not turn placeholders into product photos or repeat existing keywords", () => {
    expect(contextualHeroImageAlt("Motorcycle product image placeholder", "NMAX V3 Price Philippines")).toBe("Motorcycle product image placeholder for NMAX V3 Price Philippines");
    const alt = "Yamaha NMAX V3 motorcycle in black, NMAX V3 Price Philippines";
    expect(contextualHeroImageAlt(alt, "NMAX V3 Price Philippines")).toBe(alt);
  });

  it("also aligns family and electric model hero text with their H1s", () => {
    const family = readFileSync(new URL("../components/ModelFamilyView.tsx", import.meta.url), "utf8");
    const electric = readFileSync(new URL("../components/ElectricMotorcycleDetail.tsx", import.meta.url), "utf8");
    expect(family).toContain("Explore {familyHeroHeading} in the Philippines.");
    expect(family).toContain("altOverride={familyHeroAlt}");
    expect(electric).toContain("{heroHeading} guide: Compare the {name} battery options");
    expect(electric).toContain("alt={heroImageAlt}");
  });
});

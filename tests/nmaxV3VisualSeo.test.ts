import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getModel } from "../lib/data";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Yamaha NMAX V3 visual redesign preserves indexed motorcycle research", () => {
  const page = source("app/motorcycles/[make]/[slug]/page.tsx");
  const hero = source("components/ReviewedModelHero.tsx");
  const entity = source("components/MotorcycleEntityPage.tsx");
  const css = source("public/styles/nmax-v3.css");

  it("isolates the design to NMAX V3 without changing other motorcycle templates", () => {
    expect(page).toContain('model.id === "yamaha-nmax-v3"');
    expect(page).toContain('<div className="nmax-v3-showcase"><link rel="stylesheet" href="/styles/nmax-v3.css" precedence="high" />{content}</div>');
    expect(page).not.toContain('import "./nmax-v3.css"');
    expect(page).toContain(": content;");
    expect(page).toContain('<ReviewedModelHero model={model} />');
    expect(page).toContain('<MotorcycleEntityPage model={model} omitHero=');
    expect(page).toContain('<PriorityModelBrief model={model} />');
    expect(page).toContain('<GrowthModelBrief model={model} />');
  });

  it("keeps the canonical metadata, original model intro and single current-model H1", () => {
    expect(page).toContain("export async function generateMetadata");
    expect(page).toContain("const seo = motorcycleEntitySeo(model);");
    expect(page).toContain("path: `/motorcycles/${model.makeSlug}/${model.slug}`");
    expect(page).toContain("index: isIndexableModel(model)");
    expect(hero).toContain("<h1>{model.make}<br />{model.model}</h1>");
    expect(hero).toContain("<p>{seo.intro}</p>");
    expect(hero).toContain("observedMarketPriceLabel(model)");
    const model = getModel("yamaha", "nmax-v3");
    expect(model?.id).toBe("yamaha-nmax-v3");
    expect(model?.model).toBe("NMAX V3");
    expect(model).toBeDefined();
    if (model) {
      const seo = motorcycleEntitySeo(model);
      expect(seo.title).toMatch(/NMAX/i);
      expect(seo.intro.length).toBeGreaterThan(40);
    }
  });

  it("retains priced evidence, original section anchors, internal links, FAQs and Product JSON-LD", () => {
    for (const anchor of ["price", "specs", "installment", "rider-fit", "ownership", "alternatives", "faq"]) {
      expect(entity).toContain(`id="${anchor}"`);
    }
    expect(entity).toContain("<VariantMatrix model={model} />");
    expect(entity).toContain("<PriceIntelligence model={model} />");
    expect(entity).toContain("<MarketPriceChecks model={model} />");
    expect(entity).toContain("<RiderFitCalculator model={forClient(model)} />");
    expect(entity).toContain("<Owner");
    expect(entity).toContain("const faqSchema = {");
    expect(entity).toContain('"@type": "Product"');
    expect(entity).toContain('"@type": "FAQPage"');
    expect(entity).toContain("<ProductEntityNav items={");
    expect(entity).toContain("getModelFamilyForModel(model.id)");
    expect(hero).toContain("<ReviewedModelGallery images={images}");
  });

  it("keeps styling specifically namespaced and avoids new image/licensing or copy dependencies", () => {
    expect(css).toContain(".nmax-v3-showcase .reviewed-model-hero");
    expect(css).toContain(".nmax-v3-showcase .motorcycle-entity-page #price");
    expect(css).not.toContain(":global(");
    expect(css).not.toContain("!important");
    expect(css).not.toMatch(/url\(['"]?https?:/);
    expect(css).not.toMatch(/background-image:\s*url\(/);
  });
});

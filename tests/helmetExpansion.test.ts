import { describe, expect, it } from "vitest";
import { getHelmetBrand } from "../lib/data";
import { gearSitemapEntries } from "../lib/sitemaps";
import { getHelmetCategoryProducts, getHelmetProduct, helmetProducts, isIndexableHelmetBrand } from "../lib/catalog";
import { helmetCatalogAliasTarget } from "../lib/helmetBrandLineups";
import { getHelmetSeoComparison, isIndexableHelmetSeoComparison } from "../lib/helmetSeoComparisons";
import { getHelmetSeoCollectionProducts, isIndexableHelmetSeoCollection } from "../lib/helmetSeoCollections";
import { hasRenderableProductMedia } from "../lib/renderableMedia";
import { getVerifiedHelmetSizing } from "../lib/helmetSizing";
import { effectiveHelmetCertification, getVerifiedHelmetCertification } from "../lib/helmetCertification";

describe("helmet market expansion", () => {

  it("excludes unsupported HNJ A607 from the public helmet catalog and sitemap", () => {
    expect(helmetProducts.some(product => product.id === "hnj-a607")).toBe(false);
    expect(getHelmetProduct("hnj", "a607")).toBeUndefined();
    expect(gearSitemapEntries().some(entry => entry.url.endsWith("/gear/helmets/hnj/a607"))).toBe(false);
  });

  it("publishes the new Philippine helmet brand hubs", () => {
    for (const slug of ["studds", "scorpion", "nolan", "ryo", "oneal"]) {
      expect(getHelmetBrand(slug)).toBeTruthy();
      expect(isIndexableHelmetBrand(slug)).toBe(true);
    }
  });

  it("keeps the priority exact helmet entities verified", () => {
    for (const [brand, slug] of [
      ["studds", "helios"],
      ["studds", "trooper-sport"],
      ["scorpion", "exo-r1-air-carbon"],
      ["scorpion", "exo-adx-2"],
      ["nolan", "n120-1"],
      ["nolan", "n70-2-x"],
      ["ryo", "rf-5v-fs-v8"],
      ["ryo", "ro-4sv-fs-766"],
      ["evo", "vxr-5000"],
      ["evo", "dx-7"],
      ["sec", "windstorm-v3"],
      ["sec", "rise-v2"],
      ["oneal", "2srs"],
      ["oneal", "3srs"],
      ["oneal", "3srs-ii"],
      ["gille", "astral"],
      ["gille", "astral-pro"],
      ["evo", "gsx3000-v2"],
      ["sec", "surge"],
      ["sec", "dynasty"],
      ["sec", "sportgrade-v2"],
      ["sec", "ace"],
    ] as const) {
      expect(getHelmetProduct(brand, slug)?.status).toBe("verified");
    }
  });

  it("keeps helmet type landing pages distinct and substantial", () => {
    const fullFace = getHelmetCategoryProducts("full-face");
    const modular = getHelmetCategoryProducts("modular");
    const halfFace = getHelmetCategoryProducts("half-face");
    const openFace = getHelmetCategoryProducts("open-face");
    const adventure = getHelmetCategoryProducts("adventure");
    const offRoad = getHelmetCategoryProducts("off-road");

    expect(fullFace.length).toBeGreaterThanOrEqual(100);
    expect(modular.length).toBeGreaterThanOrEqual(30);
    expect(openFace.length).toBeGreaterThanOrEqual(30);
    expect(halfFace.length).toBeGreaterThanOrEqual(3);
    expect(adventure.length).toBeGreaterThanOrEqual(10);
    expect(offRoad.length).toBeGreaterThanOrEqual(10);

    expect(halfFace.every(item => item.helmetType === "Half face")).toBe(true);
    expect(openFace.every(item => item.helmetType === "Open face" || item.helmetType === "Hybrid")).toBe(true);
    expect(adventure.every(item => item.helmetType === "Adventure")).toBe(true);
    expect(offRoad.every(item => item.helmetType === "Off-road")).toBe(true);
  });

  it("publishes the curated helmet collection intents", () => {
    for (const slug of ["under-3000", "under-5000", "ece-22-06", "intercom-ready", "for-commuting"] as const) {
      expect(getHelmetSeoCollectionProducts(slug).length).toBeGreaterThanOrEqual(3);
      expect(isIndexableHelmetSeoCollection(slug)).toBe(true);
    }
  });

  it("has exact renderable media for the helmet expansion", () => {
    for (const id of [
      "studds-helios","studds-trooper-sport",
      "scorpion-exo-r1-air-carbon","scorpion-exo-adx-2","scorpion-exo-adf-9000-air","scorpion-exo-covert-fx","scorpion-covert-2",
      "nolan-n120-1","nolan-n70-2-x","nolan-n21-visor","nolan-x-804rs-ultra-carbon","nolan-x-552-ultra-carbon",
      "ryo-rf-4sv","ryo-rf-5v","ryo-rf-6v","ryo-ro-4sv",
      "evo-vxr-5000","evo-gt-sport","evo-xt-300-riot-ii","evo-gx-1","evo-dx-7",
      "sec-windstorm-v3","sec-whirlwind","sec-rise-v2","sec-element",
      "oneal-2srs","oneal-3srs","oneal-3srs-ii",
      "gille-astral","gille-astral-pro","evo-gsx3000-v2",
      "sec-surge","sec-dynasty","sec-sportgrade-v2","sec-ace"
    ]) {
      expect(hasRenderableProductMedia(id)).toBe(true);
    }
  });

  it("expands centimeter size-chart coverage from verified manufacturer sources", () => {
    const effectiveCoverage = helmetProducts.filter((product) =>
      product.status === "verified" &&
      (Boolean(product.sizeChart?.length) || Boolean(getVerifiedHelmetSizing(product)?.chart.length))
    );

    expect(effectiveCoverage.length).toBeGreaterThanOrEqual(85);

    const representatives = [
      ["kyt", "nz-race", "XS", "53-54"],
      ["ls2", "ff808-stream-ii", "2XS", "51-52"],
      ["ls2", "ff812-kid", "S", "47-48"],
      ["agv", "k1-s", "XS", "53-54"],
      ["hjc", "c10", "3XS", "50-51"],
      ["shark", "spartan-gt-pro", "XXL", "63"],
    ] as const;

    for (const [brand, slug, size, headCm] of representatives) {
      const product = getHelmetProduct(brand, slug);
      expect(product).toBeTruthy();
      const sizing = product && getVerifiedHelmetSizing(product);
      expect(sizing?.chart).toContainEqual({ size, headCm });
      expect(sizing?.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("closes high-confidence helmet certification gaps", () => {
    const covered = helmetProducts.filter((product) =>
      product.status === "verified" && Boolean(effectiveHelmetCertification(product))
    );
    expect(covered.length).toBeGreaterThanOrEqual(205);

    const expected = [
      ["scorpion", "exo-r1-air-carbon", "ECE 22.06"],
      ["scorpion", "exo-adf-9000-air", "ECE R22.06"],
      ["scorpion", "exo-covert-fx", "ECE 22.06"],
      ["scorpion", "covert-2", "DOT FMVSS No. 218"],
      ["ryo", "rf-4sv-fs-868", "ECE 22.06"],
      ["evo", "gt-sport", "ECE certified"],
      ["evo", "gx-1", "ICC certified"],
      ["nolan", "n120-1", "UNECE R 22-06"],
      ["nolan", "x-804rs-ultra-carbon", "UNECE R 22-06"],
      ["nolan", "x-552-ultra-carbon", "ECE 22.06"],
    ] as const;

    for (const [brand, slug, certificationText] of expected) {
      const product = getHelmetProduct(brand, slug);
      expect(product).toBeTruthy();
      if (!product) continue;
      const evidence = getVerifiedHelmetCertification(product);
      expect(evidence?.certification).toContain(certificationText);
      expect(evidence?.sourceUrl).toMatch(/^https:\/\//);
    }

    const eceIds = new Set(getHelmetSeoCollectionProducts("ece-22-06").map((product) => product.id));
    for (const id of ["scorpion-exo-r1-air-carbon", "scorpion-exo-adf-9000-air", "scorpion-exo-covert-fx", "ryo-rf-4sv", "nolan-n120-1", "nolan-x-804rs-ultra-carbon", "nolan-x-552-ultra-carbon"]) {
      expect(eceIds.has(id)).toBe(true);
    }
  });

  it("canonicalizes the EVO Riot II lineup name to the verified product page", () => {
    expect(helmetCatalogAliasTarget("evo", "riot-ii-xt-300")).toBe("xt-300-riot-ii");
    expect(helmetCatalogAliasTarget("sec", "sportgrade")).toBe("sportgrade-v2");
  });

  it("publishes the new brand comparison intents", () => {
    for (const slug of ["ls2-vs-hjc", "agv-vs-hjc", "nolan-vs-shoei", "full-face-vs-modular"] as const) {
      expect(getHelmetSeoComparison(slug)).toBeTruthy();
      expect(isIndexableHelmetSeoComparison(slug)).toBe(true);
    }
  });
});

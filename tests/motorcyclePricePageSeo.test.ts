import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getModelById } from "../lib/data";
import { motorcyclePricePageSeo, MOTORCYCLE_PRICE_PAGE_TARGET_IDS } from "../lib/motorcyclePricePageSeo";
import { priceFocusedModelHeading, modelHeroIntro } from "../lib/motorcycleHeroSeo";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { getRenderableMedia } from "../lib/renderableMedia";
import { licensedHistoricalMotorcycleImage } from "../lib/licensedMotorcycleReference";

const expected = {
  "honda-click-125i": {
    "title": "Click 125i Price Philippines",
    "h1": "Click 125i Price Philippines"
  },
  "yamaha-sniper-155": {
    "title": "Sniper 155 Price Philippines",
    "h1": "Sniper 155 Price Philippines"
  },
  "rusi-classic-250i": {
    "title": "Classic 250i Price Philippines",
    "h1": "Classic 250i Price Philippines"
  },
  "rusi-rfi-175": {
    "title": "RFI 175 Price Philippines",
    "h1": "RFI 175 Price Philippines"
  },
  "yamaha-yzf-r15-v3": {
    "title": "YZF-R15 V3 Price Philippines",
    "h1": "YZF-R15 V3 Price Philippines"
  },
  "yamaha-mio-i-125": {
    "title": "Mio i 125 Price Philippines",
    "h1": "Mio i 125 Price Philippines"
  },
  "yamaha-xmax": {
    "title": "XMAX Price Philippines",
    "h1": "XMAX Price Philippines"
  },
  "kawasaki-klx150": {
    "title": "KLX150 Price Philippines",
    "h1": "KLX150 Price Philippines"
  }
} as const;

describe("requested motorcycle Price Philippines SEO pages", () => {
  it("limits the override to eight model pages with unique metadata and aligned hero copy", () => {
    expect(MOTORCYCLE_PRICE_PAGE_TARGET_IDS).toHaveLength(8);
    expect(new Set(MOTORCYCLE_PRICE_PAGE_TARGET_IDS)).toEqual(new Set(Object.keys(expected)));
    const titles = new Set<string>();
    for (const [id, phrase] of Object.entries(expected)) {
      const model = getModelById(id);
      expect(model, id).toBeDefined();
      const seo = motorcyclePricePageSeo(id);
      expect(seo).toBeDefined();
      expect(seo?.heading).toBe(phrase.h1);
      expect(seo?.title).toBe(phrase.title);
      expect(seo?.description.startsWith(phrase.h1 + ":")).toBe(true);
      expect(seo?.intro.startsWith(phrase.h1 + " guide:")).toBe(true);
      expect(seo?.intro).toContain(`${model!.make} ${model!.model}`);
      expect(seo?.title.length).toBeLessThanOrEqual(65);
      expect(seo?.description.length).toBeLessThanOrEqual(158);
      expect(priceFocusedModelHeading(model!)).toBe(phrase.h1);
      expect(modelHeroIntro(model!, motorcycleEntitySeo(model!).intro)).toBe(seo?.intro);
      expect(titles.has(seo!.title)).toBe(false);
      titles.add(seo!.title);
    }
  });

  it("gives requested metadata priority, including for models with stronger existing SEO overrides", () => {
    const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    expect(route).toContain("title: priceFocusedModelHeading(model),");
    expect(route).toContain("description: modelPriceMetaDescription(model, targetSeo?.description || intentDepth?.seoDescription || growth?.seoDescription || seo.description)");
    const hero = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
    expect(hero).toContain("<h1>{priceFocusedModelHeading(model)}</h1>");
    expect(hero).toContain("modelHeroIntro(model, seo.intro)");
  });

  it("retains accurate previous-generation R15 V3 price status", () => {
    expect(getModelById("yamaha-yzf-r15-v3")?.marketStatus).toBe("previous");
    const seo = motorcyclePricePageSeo("yamaha-yzf-r15-v3")!;
    expect(seo.description).toContain("historical ₱164,000");
    expect(seo.description).toContain("Not a current new-bike quote");
    expect(seo.intro).toContain("previous generation");
  });

  it("keeps the local WebP image catalog strict while displaying a licensed historical R15 photo", () => {
    const image = licensedHistoricalMotorcycleImage("yamaha-yzf-r15-v3");
    expect(image).toBeDefined();
    expect(image?.src).toContain("thumb.wikimedia.org/wikipedia/commons/thumb/");
    expect(image?.src).toContain("Yamaha_R15_V3.0.jpg");
    expect(image?.alt).toContain("YZF-R15 V3");
    expect(image?.sourceUrl).toBe("https://commons.wikimedia.org/wiki/File:Yamaha_R15_V3.0.jpg");
    expect(image?.licenseUrl).toBe("https://creativecommons.org/licenses/by-sa/4.0/");
    expect(licensedHistoricalMotorcycleImage("yamaha-sniper-155")).toBeUndefined();

    const mediaSource = readFileSync(new URL("../lib/media.ts", import.meta.url), "utf8");
    expect(mediaSource).not.toContain("thumb.wikimedia.org");
    const catalogPhoto = getRenderableMedia("motorcycle", "yamaha-yzf-r15-v3")[0];
    expect(catalogPhoto.src).toContain("/media/placeholders/motorcycle.svg");

    const hero = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
    expect(hero).toContain('historicalPhoto ? <div className="motorcycle-hero-media">');
    expect(hero).toContain("<SafeEntityImage src={historicalPhoto.src}");
    expect(hero).toContain('href={historicalPhoto.licenseUrl}');
    expect(hero).toContain('href={historicalPhoto.sourceUrl}');

    const metadata = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");
    expect(metadata).toContain('const image = getRenderableMedia("motorcycle", model.id)[0]?.src;');
    expect(metadata).toContain("image: historicalPhoto?.src || image,");
    expect(existsSync(resolve("public/media/motorcycles/yamaha-yzf-r15-v3.webp"))).toBe(false);
  });});

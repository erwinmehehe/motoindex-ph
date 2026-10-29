import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { motorcycles } from "../lib/data";
import { modelFamilies } from "../lib/families";
import { electricMotorcycles } from "../lib/electricMotorcycles";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { motorcyclePricePageSeo } from "../lib/motorcyclePricePageSeo";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";

function modelMetaTitle(model: (typeof motorcycles)[number]) {
  // Mirror the precedence in app/motorcycles/[make]/[slug]/page.tsx.
  return motorcyclePricePageSeo(model.id)?.title
    || modelIntentDepthProfile(model.id)?.seoTitle
    || priorityModelGrowthProfile(model.id)?.seoTitle
    || motorcycleEntitySeo(model).title;
}

const approvedModelFirstTitles = new Map([
  ["yamaha-aerox-v3", "Aerox V3 Price Philippines | MotoIndex"],
  ["yamaha-nmax-v3", "NMAX V3 Price Philippines | MotoIndex"],
  ["honda-adv-160", "ADV 160 Price Philippines | MotoIndex"],
  ["honda-click-125i", "Click 125i Price Philippines | Honda SRP & Installment"],
  ["yamaha-sniper-155", "Sniper 155 Price Philippines | Yamaha Specs & SRP"],
  ["rusi-classic-250i", "Classic 250i Price Philippines | Rusi Specs & Costs"],
  ["rusi-rfi-175", "RFI 175 Price Philippines | Rusi Specs & Installment"],
  ["yamaha-yzf-r15-v3", "YZF-R15 V3 Price Philippines | Yamaha Historic SRP"],
  ["yamaha-mio-i-125", "Mio i 125 Price Philippines | Yamaha SRP & Specs"],
  ["yamaha-xmax", "XMAX Price Philippines | Yamaha ABS & Installment"],
  ["kawasaki-klx150", "KLX150 Price Philippines | Kawasaki Specs & SRP"]
]);

describe("motorcycle detail page SEO titles", () => {
  it("keeps every catalog motorcycle price-first and branded without duplicate titles", () => {
    expect(motorcycles.length).toBeGreaterThan(200);
    const titles = new Set<string>();
    for (const model of motorcycles) {
      const title = modelMetaTitle(model);
      expect(title, model.id).toMatch(/ Price Philippines\b/i);
      const approvedModelFirstTitle = approvedModelFirstTitles.get(model.id);
      if (approvedModelFirstTitle) {
        expect(title, model.id).toBe(approvedModelFirstTitle);
      } else {
        expect(title.toLowerCase().startsWith(model.make.toLowerCase() + " "), model.id).toBe(true);
      }
      expect(title.length, model.id).toBeLessThanOrEqual(65);
      expect(titles.has(title), `Duplicate model SEO title: ${title}`).toBe(false);
      titles.add(title);
    }
  });

  it("uses the exact requested NMAX V2 primary-keyword title and dated price metadata", () => {
    const model = motorcycles.find((entry) => entry.id === "yamaha-nmax-v2");
    expect(model).toBeDefined();
    expect(modelMetaTitle(model!)).toBe("Yamaha NMAX V2 Price Philippines");
    const description = priorityModelGrowthProfile("yamaha-nmax-v2")?.seoDescription;
    expect(description).toContain("₱119,900 historical 2020 launch SRP");
    expect(description).toContain("NMAX V3");
    expect(description!.length).toBeLessThanOrEqual(158);
  });

  it("keeps earlier Aerox V2 historical-price metadata distinct from V3", () => {
    const model = motorcycles.find((entry) => entry.id === "yamaha-aerox-v2");
    expect(model).toBeDefined();
    expect(modelMetaTitle(model!)).toBe("Yamaha Aerox V2 Price Philippines | Specs & Used Value");
    const description = priorityModelGrowthProfile("yamaha-aerox-v2")?.seoDescription;
    expect(description).toContain("historical 2021 launch SRP");
    expect(description).toContain("Aerox V3");
  });

  it("keeps generation-family and electric detail page titles price-first", () => {
    for (const family of modelFamilies) {
      expect(family.seoTitle, family.slug).toMatch(/ Price Philippines\b/);
    }
    expect(electricMotorcycles.length).toBeGreaterThan(0);
    const detailRoute = readFileSync(
      new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url),
      "utf8"
    );
    expect(detailRoute).toContain(
      'title: `${electricModel.make} ${electricModel.model} Price Philippines | Range & Specs`'
    );
  });
});

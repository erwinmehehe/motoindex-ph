import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { modelIntentDepthProfile } from "../lib/modelIntentDepth2026";
import { getModelById } from "../lib/data";
import { priceFocusedModelHeading } from "../lib/motorcycleHeroSeo";
import { motorcyclePricePageSeo } from "../lib/motorcyclePricePageSeo";
import { priorityModelGrowthProfile } from "../lib/priorityModelGrowth";

const targets = [
  { id: "yamaha-aerox-v3", title: "Aerox V3 Price Philippines | MotoIndex", h1: "Aerox V3 Price Philippines" },
  { id: "yamaha-nmax-v3", title: "NMAX V3 Price Philippines | MotoIndex", h1: "NMAX V3 Price Philippines" },
  { id: "honda-adv-160", title: "ADV 160 Price Philippines | MotoIndex", h1: "ADV 160 Price Philippines" },
  { id: "honda-click-125i", title: "Click 125i Price Philippines | Honda SRP & Installment", h1: "Click 125i Price Philippines" },
  { id: "yamaha-sniper-155", title: "Sniper 155 Price Philippines | Yamaha Specs & SRP", h1: "Sniper 155 Price Philippines" },
  { id: "rusi-classic-250i", title: "Classic 250i Price Philippines | Rusi Specs & Costs", h1: "Classic 250i Price Philippines" },
  { id: "rusi-rfi-175", title: "RFI 175 Price Philippines | Rusi Specs & Installment", h1: "RFI 175 Price Philippines" },
  { id: "yamaha-yzf-r15-v3", title: "YZF-R15 V3 Price Philippines | Yamaha Historic SRP", h1: "YZF-R15 V3 Price Philippines" },
  { id: "yamaha-mio-i-125", title: "Mio i 125 Price Philippines | Yamaha SRP & Specs", h1: "Mio i 125 Price Philippines" },
  { id: "yamaha-xmax", title: "XMAX Price Philippines | Yamaha ABS & Installment", h1: "XMAX Price Philippines" },
  { id: "kawasaki-klx150", title: "KLX150 Price Philippines | Kawasaki Specs & SRP", h1: "KLX150 Price Philippines" }
] as const;

describe("model-first price SEO titles and H1s", () => {
  const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");

  it("uses the requested metadata on the canonical model route, including the ADV160 override", () => {
    expect(route).toContain("title: targetSeo?.title || intentDepth?.seoTitle || growth?.seoTitle || seo.title");
    for (const { id, title } of targets) {
      if (!motorcyclePricePageSeo(id)) expect(priorityModelGrowthProfile(id)?.seoTitle).toBe(title);
      const resolvedTitle = motorcyclePricePageSeo(id)?.title || modelIntentDepthProfile(id)?.seoTitle || priorityModelGrowthProfile(id)?.seoTitle;
      expect(resolvedTitle).toBe(title);
    }
  });

  it("renders the requested model-specific H1 without changing the hero fallback for other bikes", () => {
    expect(route).toContain("<ReviewedModelHero model={model} />");
    expect(hero).toContain("priceFocusedModelHeading(model)");
    for (const { id, h1 } of targets) {
      const model = getModelById(id);
      expect(model, id).toBeDefined();
      expect(priceFocusedModelHeading(model!), id).toBe(h1);
    }
    expect(hero).toContain("<h1>{priceFocusedHeading || <>{model.make}<br />{model.model}</>}</h1>");
  });
});

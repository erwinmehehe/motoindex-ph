import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getModelById } from "../lib/data";
import { priceFocusedModelHeading, modelHeroIntro } from "../lib/motorcycleHeroSeo";
import { motorcyclePricePageSeo } from "../lib/motorcyclePricePageSeo";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";

const priorityModels = [
  ["yamaha-aerox-v3", "Aerox V3 Price Philippines"],
  ["yamaha-nmax-v3", "NMAX V3 Price Philippines"],
  ["honda-adv-160", "ADV 160 Price Philippines"],
  ["honda-click-125i", "Click 125i Price Philippines"],
  ["yamaha-sniper-155", "Sniper 155 Price Philippines"],
  ["rusi-classic-250i", "Classic 250i Price Philippines"],
  ["rusi-rfi-175", "RFI 175 Price Philippines"],
  ["yamaha-yzf-r15-v3", "YZF-R15 V3 Price Philippines"],
  ["yamaha-mio-i-125", "Mio i 125 Price Philippines"],
  ["yamaha-xmax", "XMAX Price Philippines"],
  ["kawasaki-klx150", "KLX150 Price Philippines"]
] as const;

describe("model-first price SEO titles and H1s", () => {
  const hero = readFileSync(new URL("../components/ReviewedModelHero.tsx", import.meta.url), "utf8");
  const oldHero = readFileSync(new URL("../components/MotorcycleEntityPage.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../app/motorcycles/[make]/[slug]/page.tsx", import.meta.url), "utf8");

  it("applies the same exact keyword to the HTML metadata title and all hero types", () => {
    expect(route).toContain("title: priceFocusedModelHeading(model),");
    expect(hero).toContain("<h1>{priceFocusedHeading}</h1>");
    expect(oldHero).toContain("<h1>{priceFocusedModelHeading(model)}</h1>");
    expect(route).toContain("<ReviewedModelHero model={model} />");
    for (const [id, expected] of priorityModels) {
      const model = getModelById(id);
      expect(model, id).toBeDefined();
      expect(priceFocusedModelHeading(model!), id).toBe(expected);
      expect(modelHeroIntro(model!, motorcycleEntitySeo(model!).intro)).toMatch(/Price Philippines guide:/);
      const reviewed = motorcyclePricePageSeo(id);
      if (reviewed) expect(reviewed.title, id).toBe(expected);
    }
  });
});

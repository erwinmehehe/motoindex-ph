import { describe, expect, it } from "vitest";
import { getModel } from "../lib/data";
import { editorialGuides } from "../lib/editorialGuides";
import { motorcycleEntitySeo } from "../lib/motorcycleEntitySeo";
import { priceFaqsForModel } from "../lib/priceSeo";

describe("discontinued motorcycle presentation", () => {
  it("keeps the Yamaha R6 as a canonical motorcycle model", () => {
    const r6 = getModel("yamaha", "yzf-r6");
    expect(r6).toBeDefined();
    expect(r6?.marketStatus).toBe("discontinued");
    expect(r6?.srp).toBe(749000);
    expect(r6?.engineCc).toBe(599);
  });

  it("does not turn discontinued motorcycles into archive-first SEO pages", () => {
    const r6 = getModel("yamaha", "yzf-r6");
    expect(r6).toBeDefined();
    const seo = motorcycleEntitySeo(r6!);
    expect(seo.title).toContain("Price Philippines");
    expect(seo.heading).toContain("price, specs and ownership guide");
    expect(seo.title).not.toMatch(/Historical|Used Value/i);
    expect(seo.heading).not.toMatch(/historical/i);
  });

  it("answers discontinued price intent in the present tense without pretending it is a current SRP", () => {
    const r6 = getModel("yamaha", "yzf-r6");
    expect(r6).toBeDefined();
    const faqs = priceFaqsForModel(r6!, "₱749,000");
    expect(faqs[0]?.question).toBe("How much is the Yamaha YZF-R6 in the Philippines?");
    expect(faqs[0]?.answer).toContain("last published Philippine new-bike price");
    expect(faqs[0]?.answer).toContain("rather than a current dealer SRP");
  });

  it("removes the R6 duplicate editorial guide", () => {
    expect(editorialGuides.some((guide) => guide.slug === "yamaha-r6-price-philippines")).toBe(false);
  });
});

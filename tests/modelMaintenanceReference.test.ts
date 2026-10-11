import { describe, expect, it } from "vitest";
import { getModelById } from "../lib/data";
import { maintenanceForModel, maintenanceSchedules } from "../lib/maintenance";
import { motorcycleSitemapEntries } from "../lib/sitemaps";

const expected = [
  ["honda-click-160", 0.8, 0.12, "NGK LMAR8L-9", "Philippines"],
  ["honda-pcx-160", 0.8, 0.12, "NGK LMAR8L-9", "Philippines"],
  ["honda-adv-160", 0.75, 0.11, "NGK LMAR8L-9", "Philippines"],
  ["yamaha-nmax-v3", 0.9, 0.1, "NGK CPR8EA-9", "Regional manual"],
  ["yamaha-aerox-v3", 1, 0.1, "NGK CPR8EA-9", "Regional manual"]
] as const;

describe("source-backed model maintenance specifications", () => {
  it.each(expected)("keeps manufacturer figures tied to %s and its exact manual", (modelId, oil, finalDrive, plug, market) => {
    const schedule = maintenanceForModel(modelId);
    const model = getModelById(modelId);
    expect(model).toBeDefined();
    expect(schedule?.exact).toBe(true);
    expect(schedule?.sourceUrl.startsWith("https://")).toBe(true);
    expect(schedule?.serviceSpecs?.engineOilAfterDrainL).toBe(oil);
    expect(schedule?.serviceSpecs?.finalDriveOilAfterDrainL).toBe(finalDrive);
    expect(schedule?.serviceSpecs?.sparkPlugCode).toBe(plug);
    expect(schedule?.serviceSpecs?.sourceMarket).toBe(market);
    expect(schedule?.serviceSpecs?.sparkPlugGapMm).toBe("0.8–0.9 mm");
    expect(schedule?.serviceSpecs?.manualModelCode).toBeTruthy();
    expect(schedule?.serviceSpecs?.checkedAt).toBe("2026-10-11");
    expect(schedule?.serviceSpecs?.applicability.length).toBeGreaterThan(30);
  });

  it("never promotes a generic brand-level schedule into an exact service specification", () => {
    expect(maintenanceForModel("honda-click-125i")).toBeUndefined();
    expect(maintenanceForModel("suzuki-raider-r150")).toBeUndefined();
    expect(maintenanceSchedules.filter(schedule => schedule.serviceSpecs)).toHaveLength(5);
  });

  it("does not create new duplicate model-maintenance URLs in the sitemap", () => {
    const urls = motorcycleSitemapEntries().map(entry => entry.url);
    for (const [modelId] of expected) {
      const model = getModelById(modelId);
      expect(model).toBeDefined();
      const suffix = "/motorcycles/" + model!.makeSlug + "/" + model!.slug + "/maintenance";
      expect(urls.some(url => url.endsWith(suffix))).toBe(false);
    }
  });
});

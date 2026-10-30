import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import snapshot from "../data/fuel-pump-prices.ncr.json";

describe("Dated NCR retail pump-price snapshot", () => {
  it("shows real per-liter ranges with an explicit region, period and source", () => {
    expect(snapshot.coverage).toBe("Metro Manila (NCR)");
    expect(snapshot.weekStart).toBe("2026-10-20");
    expect(snapshot.weekEnd).toBe("2026-10-26");
    expect(snapshot.sourceUrl).toMatch(/^https:\/\/doe\.gov\.ph\//);
    expect(snapshot.compiledSourceUrl).toMatch(/^https:\/\/wiseph\.net\//);
    expect(snapshot.fuels.map((fuel) => fuel.id)).toEqual(["ron91", "ron95", "diesel", "kerosene"]);
    for (const fuel of snapshot.fuels) {
      expect(Number.isFinite(fuel.low)).toBe(true);
      expect(Number.isFinite(fuel.high)).toBe(true);
      expect(fuel.low).toBeGreaterThan(0);
      expect(fuel.high).toBeGreaterThanOrEqual(fuel.low);
      expect(fuel.high).toBeLessThan(250);
    }
  });
  it("keeps retail prices separate from weekly DOE price movements", () => {
    const page = readFileSync(new URL("../app/gas-price-philippines/page.tsx", import.meta.url), "utf8");
    expect(page).toContain('id="pump-prices"');
    expect(page).toContain("These are low-to-high pump prices");
    expect(page).toContain("pumpIsOlder");
    expect(page).toContain('id="weekly"');
    expect(page).toContain("<FuelCostImpactCalculator summary={latest.summary}/>");
  });
});

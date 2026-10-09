import fs from "node:fs";
import { describe, expect, it } from "vitest";

const component = fs.readFileSync("components/InstallmentCalculator.tsx", "utf8");

/**
 * Static JSX contract only. The actual client-side rendered calculator, layout,
 * values and breakpoints are covered by priority-model browser Visual QA.
 */
describe("installment planner public UI contracts", () => {
  it("surfaces monthly financing and total cash paid in the same result card", () => {
    expect(component).toContain('data-calculator="installment"');
    expect(component).toContain("Estimated monthly payment");
    expect(component).toContain("Total estimated cash paid");
    expect(component).toContain("Cash to prepare upfront");
    expect(component).toContain("Estimated interest");
    expect(component).toContain("result.totalCashOutlayPhp");
  });

  it("keeps all six keyboard-pressable quick presets", () => {
    expect(component).toContain("PRESET_DOWNS = [10, 20, 30]");
    expect(component).toContain("PRESET_TERMS = [24, 36, 48]");
    expect(component).toContain("aria-pressed={down === value}");
    expect(component).toContain("aria-pressed={months === value}");
  });

  it("requires labelled rate, fee, and purchase-price inputs", () => {
    for (const id of ["finance-purchase-price", "finance-upfront-fees", "finance-rate-slider", "finance-month-slider", "finance-down-slider"]) {
      expect(component).toContain('htmlFor="' + id + '"');
      expect(component).toContain('id="' + id + '"');
    }
    expect(component).toContain("not a dealer offer or approval");
    expect(component).toContain('aria-label="Editable motorcycle installment estimate"');
  });

  it("offers verified variant references without implying dealer finance terms", () => {
    expect(component).toContain("priceOptions.map(");
    expect(component).toContain("not guaranteed dealer cash prices");
    expect(component).toContain("copyEstimate");
    expect(component).toContain("setCopyStatus");
  });
});

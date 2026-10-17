import { describe, expect, it } from "vitest";
import { calculateInstallmentPlan } from "../lib/installmentPlan";

describe("installment payment transparency", () => {
  const baseline = { pricePhp: 133400, downPaymentPct: 20, months: 36, annualRatePct: 12 };

  it("keeps monthly, downpayment, interest, and full cash cost consistent", () => {
    const plan = calculateInstallmentPlan(baseline);
    expect(plan.downPaymentPhp).toBe(26680);
    expect(plan.financedPhp).toBe(106720);
    expect(plan.monthlyPhp).toBeGreaterThan(3500);
    expect(plan.monthlyPhp).toBeLessThan(3600);
    expect(plan.totalCashOutlayPhp).toBeCloseTo(plan.cashNeededUpfrontPhp + plan.monthlyPhp * 36, 6);
    expect(plan.additionalCostPhp).toBeCloseTo(plan.totalCashOutlayPhp - 133400, 6);
  });

  it("treats explicitly cash-paid fees as upfront—not financed", () => {
    const plan = calculateInstallmentPlan(baseline);
    const withFees = calculateInstallmentPlan({ ...baseline, upfrontFeesPhp: 5400 });
    expect(withFees.monthlyPhp).toBeCloseTo(plan.monthlyPhp, 8);
    expect(withFees.cashNeededUpfrontPhp - plan.cashNeededUpfrontPhp).toBe(5400);
    expect(withFees.totalCashOutlayPhp - plan.totalCashOutlayPhp).toBeCloseTo(5400, 8);
  });

  it("does not invent interest for a zero-rate scenario", () => {
    const plan = calculateInstallmentPlan({ ...baseline, annualRatePct: 0 });
    expect(plan.monthlyPhp).toBeCloseTo(106720 / 36, 8);
    expect(plan.interestPhp).toBe(0);
    expect(plan.totalCashOutlayPhp).toBeCloseTo(133400, 8);
  });

  it("clamps invalid rates and terms rather than displaying NaN or negative payment", () => {
    const plan = calculateInstallmentPlan({ pricePhp: Number.NaN, downPaymentPct: -20, months: 0, annualRatePct: 800, upfrontFeesPhp: -100 });
    expect(plan.pricePhp).toBe(1000);
    expect(plan.downPaymentPct).toBe(0);
    expect(plan.months).toBe(12);
    expect(plan.annualRatePct).toBe(30);
    expect(plan.upfrontFeesPhp).toBe(0);
    expect(Number.isFinite(plan.monthlyPhp)).toBe(true);
  });

  it("reduces the monthly payment when downpayment rises under unchanged terms", () => {
    const lower = calculateInstallmentPlan({ ...baseline, downPaymentPct: 10 });
    const higher = calculateInstallmentPlan({ ...baseline, downPaymentPct: 30 });
    expect(higher.monthlyPhp).toBeLessThan(lower.monthlyPhp);
    expect(higher.cashNeededUpfrontPhp).toBeGreaterThan(lower.cashNeededUpfrontPhp);
  });
});

import { estimateMonthlyPayment } from "@/lib/financing";

export type InstallmentPlanInput = {
  pricePhp: number;
  downPaymentPct: number;
  months: number;
  annualRatePct: number;
  upfrontFeesPhp?: number;
};

function finiteClamp(value: number, fallback: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : fallback));
}

/**
 * One consistent payment breakdown for the installment UI.
 * Annual interest is a nominal amortizing rate, NOT a dealer add-on/flat rate.
 * Upfront fees are cash-paid separately and are never silently financed.
 */
export function calculateInstallmentPlan(input: InstallmentPlanInput) {
  const pricePhp = finiteClamp(input.pricePhp, 1000, 1000, 10_000_000);
  const downPaymentPct = finiteClamp(input.downPaymentPct, 20, 0, 90);
  const months = Math.round(finiteClamp(input.months, 36, 12, 60));
  const annualRatePct = finiteClamp(input.annualRatePct, 12, 0, 30);
  const upfrontFeesPhp = finiteClamp(input.upfrontFeesPhp ?? 0, 0, 0, 1_000_000);
  const amount = estimateMonthlyPayment(pricePhp, downPaymentPct, months, annualRatePct);
  const totalLoanPaymentsPhp = amount.monthlyPhp * months;
  const interestPhp = Math.max(0, totalLoanPaymentsPhp - amount.financedPhp);

  return {
    pricePhp,
    downPaymentPct,
    months,
    annualRatePct,
    upfrontFeesPhp,
    downPaymentPhp: amount.downPaymentPhp,
    financedPhp: amount.financedPhp,
    monthlyPhp: amount.monthlyPhp,
    totalLoanPaymentsPhp,
    interestPhp,
    cashNeededUpfrontPhp: amount.downPaymentPhp + upfrontFeesPhp,
    totalCashOutlayPhp: amount.downPaymentPhp + upfrontFeesPhp + totalLoanPaymentsPhp,
    additionalCostPhp: interestPhp + upfrontFeesPhp
  };
}

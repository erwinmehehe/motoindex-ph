export type FinancingScenario = {
  downPaymentPct: number;
  termMonths: number;
  annualRatePct: number;
  downPaymentPhp: number;
  financedPhp: number;
  monthlyPhp: number;
};

export function estimateMonthlyPayment(price: number, downPaymentPct: number, termMonths: number, annualRatePct: number) {
  const safePrice = Math.max(1_000, Number.isFinite(price) ? price : 1_000);
  const downPaymentPhp = safePrice * (downPaymentPct / 100);
  const financedPhp = Math.max(0, safePrice - downPaymentPhp);
  const monthlyRate = annualRatePct / 100 / 12;
  const monthlyPhp = monthlyRate === 0
    ? financedPhp / termMonths
    : financedPhp * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  return { downPaymentPhp, financedPhp, monthlyPhp };
}

export function financingScenario(price: number, downPaymentPct = 20, termMonths = 36, annualRatePct = 12): FinancingScenario {
  return {
    downPaymentPct,
    termMonths,
    annualRatePct,
    ...estimateMonthlyPayment(price, downPaymentPct, termMonths, annualRatePct)
  };
}

export function defaultFinancingExamples(price: number) {
  return [10, 20, 30].map((downPaymentPct) => financingScenario(price, downPaymentPct, 36, 12));
}

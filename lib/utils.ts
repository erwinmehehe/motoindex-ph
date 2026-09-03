export function php(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0
  }).format(value);
}

export function phpRange(from: number, to?: number) {
  return to && to > from ? `${php(from)}–${php(to)}` : php(from);
}

export function number(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

export function monthlyPayment(price: number, downPaymentPct = 20, months = 36, annualRatePct = 12) {
  const principal = price * (1 - downPaymentPct / 100);
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

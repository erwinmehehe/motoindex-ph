import { publicMotorcycles } from "./data";
import { observedMarketRange } from "./marketChecks";
import { financingScenario } from "./financing";

export const researchMotorcycles = [...publicMotorcycles].sort((a, b) =>
  observedMarketRange(a).from - observedMarketRange(b).from || a.make.localeCompare(b.make) || a.model.localeCompare(b.model)
);

export function latestResearchCheck() {
  return researchMotorcycles
    .map((model) => model.marketPriceCheckedAt || model.verifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || "2026-08-27";
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const rows = [...values].sort((a, b) => a - b);
  const middle = Math.floor(rows.length / 2);
  return rows.length % 2 ? rows[middle] : (rows[middle - 1] + rows[middle]) / 2;
}

export function researchPriceRows() {
  return researchMotorcycles.map((model) => {
    const range = observedMarketRange(model);
    return {
      model,
      fromPhp: range.from,
      toPhp: range.to,
      checkedAt: model.marketPriceCheckedAt || model.verifiedAt,
    };
  });
}

export function researchSeatRows() {
  return [...researchMotorcycles]
    .sort((a, b) => a.seatHeightMm - b.seatHeightMm || a.curbWeightKg - b.curbWeightKg || a.model.localeCompare(b.model))
    .map((model) => ({ model, range: observedMarketRange(model) }));
}

export function researchFinancingRows() {
  return researchMotorcycles
    .map((model) => {
      const range = observedMarketRange(model);
      return {
        model,
        pricePhp: range.from,
        scenario: financingScenario(range.from, 20, 36, 12),
      };
    })
    .sort((a, b) => a.scenario.monthlyPhp - b.scenario.monthlyPhp || a.pricePhp - b.pricePhp);
}

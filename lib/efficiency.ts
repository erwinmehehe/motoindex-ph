import type { Motorcycle } from "./types";
import { estimatedEfficiency } from "./ownership";

export type EfficiencyEvidence = {
  kmPerL: number;
  status: "listed" | "planning-estimate";
  label: string;
  sourceUrl?: string;
  checkedAt?: string;
};

export function efficiencyEvidence(model: Motorcycle): EfficiencyEvidence {
  if (model.fuelConsumptionKmL) {
    return {
      kmPerL: model.fuelConsumptionKmL,
      status: "listed",
      label: "Listed for this model",
      sourceUrl: model.sourceUrl,
      checkedAt: model.verifiedAt,
    };
  }
  return {
    kmPerL: estimatedEfficiency(model),
    status: "planning-estimate",
    label: "MotoIndex planning estimate from engine size and motorcycle category",
  };
}

export function theoreticalRangeKm(model: Motorcycle) {
  const evidence = efficiencyEvidence(model);
  return Math.round(evidence.kmPerL * model.fuelTankL);
}

export function planningRangeKm(model: Motorcycle) {
  return Math.round(theoreticalRangeKm(model) * 0.85);
}

export function fuelCostForDistance(model: Motorcycle, distanceKm: number, fuelPricePerL: number) {
  const economy = efficiencyEvidence(model).kmPerL;
  return Math.max(0, distanceKm) / Math.max(1, economy) * Math.max(0, fuelPricePerL);
}

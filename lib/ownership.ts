import type { Motorcycle } from "./types";

export type ConditionBand = "fair" | "good" | "excellent";

export type OwnershipDefaults = {
  kmPerMonth: number;
  estimatedKmPerL: number;
  fuelPricePerL: number;
  maintenancePerMonth: number;
  annualInsurance: number;
  annualRegistration: number;
  tiresPerYear: number;
};

export function estimatedEfficiency(model: Motorcycle) {
  const cat = model.category.toLowerCase();
  if (model.engineCc <= 125) return /underbone|business|mini/.test(cat) ? 48 : 44;
  if (model.engineCc <= 170) return /scooter/.test(cat) ? 40 : 43;
  if (model.engineCc <= 250) return 34;
  if (model.engineCc <= 400) return /scooter/.test(cat) ? 27 : 29;
  return 24;
}

export function ownershipDefaults(model: Motorcycle): OwnershipDefaults {
  return {
    kmPerMonth: 900,
    estimatedKmPerL: model.fuelConsumptionKmL || estimatedEfficiency(model),
    fuelPricePerL: 65,
    maintenancePerMonth: model.engineCc > 300 ? 1200 : model.engineCc > 160 ? 850 : 650,
    annualInsurance: model.srp > 250000 ? 9000 : model.srp > 150000 ? 6500 : 4500,
    annualRegistration: 1800,
    tiresPerYear: model.engineCc > 300 ? 6000 : 3500,
  };
}

const conditionFactor: Record<ConditionBand, number> = { fair: .90, good: 1, excellent: 1.06 };

export function depreciationFactor(ageYears: number) {
  const age = Math.max(0, Math.min(10, Math.round(ageYears)));
  let value = 1;
  for (let year=1; year<=age; year++) {
    value *= 1 - (year === 1 ? .15 : year === 2 ? .10 : year <= 5 ? .08 : .06);
  }
  return value;
}

export function estimatedUsedValue(model: Motorcycle, ageYears: number, condition: ConditionBand = "good") {
  return Math.round(model.srp * depreciationFactor(ageYears) * conditionFactor[condition] / 100) * 100;
}

export function usedValueCurve(model: Motorcycle) {
  return [1,2,3,4,5].map(age => ({ age, fair: estimatedUsedValue(model, age, "fair"), good: estimatedUsedValue(model, age, "good"), excellent: estimatedUsedValue(model, age, "excellent") }));
}

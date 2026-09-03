import type { Motorcycle } from "./types";
import { evaluateMotorcycle, type DecisionProfile } from "./decisionEngine";

export type ComparisonScenario = {
  key: string;
  label: string;
  description: string;
  profile: DecisionProfile;
};

const base: Omit<DecisionProfile, "useCase"> = {
  inseamIn: 30,
  passenger: false,
  highway: false,
  expresswayClass: false,
  luggage: false,
  traffic: "mixed",
  dailyKm: 20,
  downPaymentPct: 20,
  termMonths: 36,
  annualRatePct: 12,
};

export const comparisonScenarios: ComparisonScenario[] = [
  { key: "city", label: "Heavy city traffic", description: "Favors lower weight, automatic transmission, rider-fit starting point and efficient daily use.", profile: { ...base, useCase: "city", traffic: "heavy", dailyKm: 20 } },
  { key: "fit", label: "Lower / easier bike", description: "Favors lower published seat height and curb weight for a 30-inch inseam starting point.", profile: { ...base, useCase: "short", traffic: "heavy" } },
  { key: "performance", label: "Performance", description: "Favors recorded output, power-to-weight ratio and ABS listing.", profile: { ...base, useCase: "performance", traffic: "light", highway: true, dailyKm: 30 } },
  { key: "touring", label: "Longer rides", description: "Favors fuel-tank capacity, touring-oriented category context and ABS listing.", profile: { ...base, useCase: "touring", traffic: "light", highway: true, luggage: true, dailyKm: 60 } },
  { key: "two-up", label: "Passenger + luggage", description: "Adds passenger and luggage context while keeping fit, road and ownership factors visible.", profile: { ...base, useCase: "touring", traffic: "mixed", highway: true, passenger: true, luggage: true, dailyKm: 40 } },
];

export function scenarioComparison(a: Motorcycle, b: Motorcycle, scenario: ComparisonScenario) {
  const ar = evaluateMotorcycle(a, scenario.profile);
  const br = evaluateMotorcycle(b, scenario.profile);
  const difference = Math.abs(ar.score - br.score);
  const winner = difference < 3 ? undefined : ar.score > br.score ? a : b;
  return { scenario, a: ar, b: br, winner, difference };
}

export function allScenarioComparisons(a: Motorcycle, b: Motorcycle) {
  return comparisonScenarios.map((scenario) => scenarioComparison(a, b, scenario));
}

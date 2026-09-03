import type { Motorcycle } from "./types";
import { planningPurchasePrice } from "./marketChecks";
import { commuteMonthlyCosts } from "./commuteMath";
import { ownershipDefaults } from "./ownership";
import { monthlyPayment } from "./utils";

export type DecisionUseCase = "city" | "short" | "work" | "performance" | "touring";
export type TrafficLevel = "heavy" | "mixed" | "light";

export type DecisionProfile = {
  useCase: DecisionUseCase;
  inseamIn: number;
  passenger: boolean;
  highway: boolean;
  expresswayClass: boolean;
  luggage: boolean;
  traffic: TrafficLevel;
  dailyKm: number;
  monthlyBudgetPhp?: number;
  downPaymentPct?: number;
  termMonths?: number;
  annualRatePct?: number;
};

export type DecisionFactor = {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  detail: string;
  tone: "positive" | "neutral" | "caution";
};

export type DecisionResult = {
  score: number;
  label: "Strong fit" | "Good fit" | "Compare carefully" | "Weak fit";
  reasons: string[];
  cautions: string[];
  factors: DecisionFactor[];
  purchasePricePhp: number;
  purchasePriceBasis: "manufacturer" | "catalog-srp" | "median-observed";
  estimatedLoanMonthlyPhp: number;
  estimatedCommuteMonthlyPhp: number;
  estimatedAnnualReserveMonthlyPhp: number;
  estimatedRunningMonthlyPhp: number;
  estimatedTotalMonthlyPhp: number;
  affordabilityGapPhp?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function absAvailable(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}

function addFactor(factors: DecisionFactor[], key: string, label: string, score: number, maxScore: number, detail: string, tone: DecisionFactor["tone"] = "neutral") {
  factors.push({ key, label, score: clamp(score, 0, maxScore), maxScore, detail, tone });
}

export function evaluateMotorcycle(model: Motorcycle, profile: DecisionProfile): DecisionResult {
  const factors: DecisionFactor[] = [];
  const cautions: string[] = [];
  const reasons: string[] = [];
  const inseamMm = clamp(profile.inseamIn, 24, 40) * 25.4;
  const reachDelta = model.seatHeightMm - inseamMm;

  if (reachDelta <= 20) {
    addFactor(factors, "fit", "Rider fit starting point", 16, 16, `${model.seatHeightMm} mm seat is close to the selected inseam benchmark.`, "positive");
    reasons.push(`${model.seatHeightMm} mm seat is favorable on the selected inseam benchmark`);
  } else if (reachDelta <= 60) {
    addFactor(factors, "fit", "Rider fit starting point", 11, 16, `${model.seatHeightMm} mm seat creates a moderate seat-to-inseam gap.`, "neutral");
  } else if (reachDelta <= 100) {
    addFactor(factors, "fit", "Rider fit starting point", 6, 16, `${model.seatHeightMm} mm seat is relatively tall for the selected inseam.`, "caution");
    cautions.push("Published seat height suggests an in-person reach check is important");
  } else {
    addFactor(factors, "fit", "Rider fit starting point", 2, 16, `${model.seatHeightMm} mm seat is substantially above the selected inseam benchmark.`, "caution");
    cautions.push("Tall seat-to-inseam gap on the stored dimensions");
  }

  const auto = model.transmission === "Automatic";
  const ratio = model.powerHp / Math.max(1, model.curbWeightKg);
  const economy = model.fuelConsumptionKmL;

  if (profile.useCase === "city") {
    let score = 4;
    if (model.curbWeightKg <= 120) score += 6;
    else if (model.curbWeightKg <= 145) score += 3;
    if (auto) score += 6;
    if ((economy || 0) >= 45) score += 3;
    addFactor(factors, "use", "City-use match", score, 19, `${model.curbWeightKg} kg, ${model.transmission || "transmission not stored"}${economy ? `, ${economy} km/L published` : ""}.`, score >= 14 ? "positive" : score <= 8 ? "caution" : "neutral");
    if (auto) reasons.push("automatic transmission for stop-go riding");
    if (model.curbWeightKg <= 120) reasons.push(`${model.curbWeightKg} kg curb weight is relatively light in the current catalog`);
  } else if (profile.useCase === "short") {
    let score = model.seatHeightMm <= 760 ? 12 : model.seatHeightMm <= 790 ? 8 : 4;
    score += model.curbWeightKg <= 115 ? 7 : model.curbWeightKg <= 135 ? 4 : 1;
    addFactor(factors, "use", "Lower / easier-bike match", score, 19, `${model.seatHeightMm} mm seat and ${model.curbWeightKg} kg curb weight.`, score >= 14 ? "positive" : score <= 8 ? "caution" : "neutral");
    if (model.seatHeightMm <= 780) reasons.push("lower published seat height");
  } else if (profile.useCase === "work") {
    let score = /business|underbone|commuter/i.test(model.category) ? 11 : /scooter/i.test(model.category) ? 7 : 3;
    if ((economy || 0) >= 50) score += 5;
    if (model.curbWeightKg <= 120) score += 3;
    addFactor(factors, "use", "Work / utility match", score, 19, `${model.category}; ${model.curbWeightKg} kg${economy ? `; ${economy} km/L published` : ""}.`, score >= 14 ? "positive" : score <= 8 ? "caution" : "neutral");
    if (/business|underbone|commuter/i.test(model.category)) reasons.push(`${model.category.toLowerCase()} layout matches utility-oriented use`);
  } else if (profile.useCase === "performance") {
    let score = model.powerHp >= 40 ? 10 : model.powerHp >= 20 ? 8 : model.powerHp >= 15 ? 6 : 3;
    if (ratio >= 0.2) score += 6;
    else if (ratio >= 0.125) score += 4;
    if (absAvailable(model)) score += 3;
    addFactor(factors, "use", "Performance match", score, 19, `${model.powerHp} hp and ${(ratio * 100).toFixed(1)} hp per 100 kg${absAvailable(model) ? "; ABS listed" : ""}.`, score >= 14 ? "positive" : score <= 8 ? "caution" : "neutral");
    if (model.powerHp >= 20) reasons.push(`${model.powerHp} hp recorded output`);
  } else {
    let score = model.fuelTankL >= 15 ? 8 : model.fuelTankL >= 10 ? 6 : model.fuelTankL >= 7 ? 4 : 2;
    if (/adventure|touring|roadster|maxi|premium/i.test(model.category)) score += 7;
    if (absAvailable(model)) score += 4;
    addFactor(factors, "use", "Longer-ride match", score, 19, `${model.fuelTankL} L tank, ${model.category}${absAvailable(model) ? ", ABS listed" : ""}.`, score >= 14 ? "positive" : score <= 8 ? "caution" : "neutral");
    if (model.fuelTankL >= 10) reasons.push(`${model.fuelTankL} L fuel tank`);
  }

  let trafficScore = 8;
  if (profile.traffic === "heavy") {
    trafficScore = model.curbWeightKg <= 115 ? 10 : model.curbWeightKg <= 140 ? 7 : 4;
    if (auto) trafficScore = Math.min(10, trafficScore + 2);
  } else if (profile.traffic === "mixed") {
    trafficScore = model.curbWeightKg <= 160 ? 8 : 6;
  }
  addFactor(factors, "traffic", "Traffic match", trafficScore, 10, `${profile.traffic === "heavy" ? "Heavy stop-go" : profile.traffic === "mixed" ? "Mixed traffic" : "Mostly open roads"}; ${model.curbWeightKg} kg${auto ? "; automatic" : ""}.`, trafficScore >= 8 ? "positive" : trafficScore <= 5 ? "caution" : "neutral");

  let practicalScore = 6;
  if (profile.passenger) practicalScore += /premium|maxi|adventure|touring|roadster/i.test(model.category) ? 3 : 0;
  if (profile.luggage) practicalScore += /business|adventure|premium|maxi|scooter/i.test(model.category) ? 3 : 0;
  practicalScore = Math.min(12, practicalScore);
  addFactor(factors, "practicality", "Passenger / luggage context", practicalScore, 12, `${profile.passenger ? "Passenger requested" : "Solo-first"}${profile.luggage ? "; luggage requested" : ""}. Category: ${model.category}.`, practicalScore >= 10 ? "positive" : "neutral");

  let roadScore = 8;
  if (profile.highway) {
    roadScore = model.engineCc >= 150 ? 9 : 3;
    if (absAvailable(model)) roadScore = Math.min(12, roadScore + 3);
    if (model.engineCc < 150) cautions.push("Smaller engine class may be less aligned with sustained open-road use");
  }
  if (profile.expresswayClass) {
    if (model.engineCc >= 400) {
      roadScore = Math.max(roadScore, 12);
      reasons.push("400cc+ recorded displacement for expressway-class research");
    } else {
      roadScore = 0;
      cautions.push("Below the selected 400cc+ expressway-planning filter");
    }
  }
  addFactor(factors, "road", profile.expresswayClass ? "400cc+ expressway-planning class" : "Open-road match", roadScore, 12, profile.expresswayClass ? `${model.engineCc} cc recorded displacement. Confirm current tollway rules and registration classification separately.` : `${model.engineCc} cc${absAvailable(model) ? "; ABS listed" : ""}.`, roadScore >= 10 ? "positive" : roadScore <= 4 ? "caution" : "neutral");

  const planningPrice = planningPurchasePrice(model);
  const price = planningPrice.price;
  const downPct = clamp(profile.downPaymentPct ?? 20, 0, 95);
  const months = clamp(profile.termMonths ?? 36, 6, 84);
  const rate = clamp(profile.annualRatePct ?? 12, 0, 60);
  const loanMonthly = monthlyPayment(price, downPct, months, rate);
  const commuteMonthly = commuteMonthlyCosts(model, clamp(profile.dailyKm, 0, 300)).total;
  const ownership = ownershipDefaults(model);
  const annualReserveMonthly = (ownership.annualInsurance + ownership.annualRegistration + ownership.tiresPerYear) / 12;
  const running = commuteMonthly + annualReserveMonthly;
  const totalMonthly = loanMonthly + running;
  const monthlyBudget = profile.monthlyBudgetPhp && profile.monthlyBudgetPhp > 0 ? profile.monthlyBudgetPhp : undefined;
  let affordabilityScore = 8;
  let affordabilityGapPhp: number | undefined;
  if (monthlyBudget) {
    affordabilityGapPhp = monthlyBudget - totalMonthly;
    const ratioToBudget = totalMonthly / monthlyBudget;
    affordabilityScore = ratioToBudget <= 0.8 ? 12 : ratioToBudget <= 1 ? 10 : ratioToBudget <= 1.15 ? 5 : 1;
    if (ratioToBudget <= 1) reasons.push("planning estimate stays within the selected monthly ownership ceiling");
    else cautions.push("planning estimate exceeds the selected monthly ownership ceiling");
  }
  addFactor(factors, "affordability", "Monthly planning estimate", affordabilityScore, 12, `${Math.round(downPct)}% down, ${Math.round(months)} months, ${rate}% APR + commute costs + monthly reserves for insurance, registration and tires.`, affordabilityScore >= 10 ? "positive" : affordabilityScore <= 5 ? "caution" : "neutral");

  const raw = factors.reduce((sum, factor) => sum + factor.score, 0);
  const max = factors.reduce((sum, factor) => sum + factor.maxScore, 0);
  const score = Math.round((raw / Math.max(1, max)) * 100);
  const label: DecisionResult["label"] = score >= 82 ? "Strong fit" : score >= 70 ? "Good fit" : score >= 55 ? "Compare carefully" : "Weak fit";

  return {
    score,
    label,
    reasons: [...new Set(reasons)].slice(0, 5),
    cautions: [...new Set(cautions)].slice(0, 4),
    factors,
    purchasePricePhp: price,
    purchasePriceBasis: planningPrice.basis,
    estimatedLoanMonthlyPhp: loanMonthly,
    estimatedCommuteMonthlyPhp: commuteMonthly,
    estimatedAnnualReserveMonthlyPhp: annualReserveMonthly,
    estimatedRunningMonthlyPhp: running,
    estimatedTotalMonthlyPhp: totalMonthly,
    affordabilityGapPhp,
  };
}

export function rankMotorcycles(models: Motorcycle[], profile: DecisionProfile) {
  return models.map(model => ({ model, decision: evaluateMotorcycle(model, profile) })).sort((a, b) => b.decision.score - a.decision.score || a.decision.purchasePricePhp - b.decision.purchasePricePhp);
}

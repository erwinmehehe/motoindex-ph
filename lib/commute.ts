import type { Motorcycle } from "./types";
import { publicMotorcycles } from "./data";
import { observedMarketRange } from "./marketChecks";
import { hasAbs } from "./commuteMath";

export type CommuteGuide = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  criteria: string[];
};

export const commuteGuides: CommuteGuide[] = [
  {
    slug: "heavy-traffic",
    kicker: "Stop-go traffic",
    title: "Motorcycles for heavy traffic in the Philippines",
    description: "Compare current motorcycles for stop-go commuting using curb weight, transmission, published fuel economy, seat height and observed price.",
    criteria: ["Lower curb weight", "Automatic or utility-oriented transmission", "Published fuel economy where available", "Lower seat height", "Observed price"]
  },
  {
    slug: "affordable-under-80k",
    kicker: "Budget commute",
    title: "Commuter motorcycles under ₱80K in the Philippines",
    description: "Current motorcycles with an observed starting price below ₱80,000, ordered using practical commuting factors.",
    criteria: ["Observed starting price below ₱80,000", "Current Philippine-market model", "Fuel economy where published", "Weight and transmission"]
  },
  {
    slug: "delivery-riders",
    kicker: "Work / delivery",
    title: "Motorcycles for delivery and work riding in the Philippines",
    description: "Compare current models for high-mileage work using price, published fuel economy, weight, transmission and utility-oriented layout.",
    criteria: ["Published fuel economy where available", "Lower purchase price", "Manageable curb weight", "Utility-oriented layout", "Platform eligibility is not assessed"]
  },
  {
    slug: "passenger-commute",
    kicker: "Two-up commute",
    title: "Motorcycles to compare for frequent passenger commuting",
    description: "Compare current motorcycles for two-up use using engine class, brake equipment, fuel capacity, layout and price. Passenger comfort still needs an in-person check.",
    criteria: ["Engine class", "ABS where listed", "Fuel capacity", "Commuter or touring-oriented layout", "Passenger comfort must be checked in person"]
  }
];

function trafficScore(model: Motorcycle) {
  let score = 45;
  const reasons: string[] = [];
  if (model.transmission === "Automatic") { score += 18; reasons.push("automatic in stop-go traffic"); }
  else if (/underbone|business/i.test(model.category)) { score += 9; reasons.push("utility-oriented layout"); }
  if (model.curbWeightKg <= 105) { score += 20; reasons.push(`${model.curbWeightKg} kg curb weight`); }
  else if (model.curbWeightKg <= 120) { score += 14; reasons.push(`${model.curbWeightKg} kg curb weight`); }
  else if (model.curbWeightKg <= 135) { score += 6; }
  const economy = model.fuelConsumptionKmL;
  if (economy && economy >= 50) { score += 10; reasons.push(`${economy} km/L listed`); }
  else if (economy && economy >= 42) { score += 6; reasons.push(`${economy} km/L listed`); }
  if (model.seatHeightMm <= 780) { score += 5; reasons.push(`${model.seatHeightMm} mm seat`); }
  if (observedMarketRange(model).from <= 120000) score += 4;
  return { score: Math.min(99, score), reasons };
}

function deliveryScore(model: Motorcycle) {
  let score = 40;
  const reasons: string[] = [];
  const price = observedMarketRange(model).from;
  if (price <= 80000) { score += 18; reasons.push("lower purchase price"); }
  else if (price <= 110000) { score += 12; reasons.push("mid-range purchase price"); }
  const economy = model.fuelConsumptionKmL;
  if (economy && economy >= 50) { score += 18; reasons.push(`${economy} km/L listed`); }
  else if (economy && economy >= 42) { score += 10; reasons.push(`${economy} km/L listed`); }
  if (/business|underbone/i.test(model.category)) { score += 15; reasons.push("utility-oriented category"); }
  else if (/scooter/i.test(model.category) && model.transmission === "Automatic") { score += 9; reasons.push("automatic scooter"); }
  if (model.curbWeightKg <= 120) { score += 7; reasons.push(`${model.curbWeightKg} kg curb weight`); }
  return { score: Math.min(99, score), reasons };
}

function passengerScore(model: Motorcycle) {
  let score = 40;
  const reasons: string[] = [];
  if (model.engineCc >= 150) { score += 13; reasons.push(`${model.engineCc} cc engine class`); }
  if (hasAbs(model)) { score += 10; reasons.push("ABS listed"); }
  if (model.fuelTankL >= 7) { score += 10; reasons.push(`${model.fuelTankL} L tank`); }
  else if (model.fuelTankL >= 5.5) score += 5;
  if (/premium|maxi|adventure|touring|scooter/i.test(model.category)) { score += 10; reasons.push(model.category.toLowerCase()); }
  if (model.curbWeightKg >= 110 && model.curbWeightKg <= 170) score += 4;
  return { score: Math.min(99, score), reasons };
}

export function commuteGuideModels(slug: string) {
  const models = [...publicMotorcycles];
  if (slug === "affordable-under-80k") {
    return models.filter(m => observedMarketRange(m).from < 80000)
      .map(m => ({ model: m, score: trafficScore(m).score, reasons: ["under ₱80K observed starting price", ...trafficScore(m).reasons] }))
      .sort((a,b) => b.score-a.score || observedMarketRange(a.model).from-observedMarketRange(b.model).from)
      .slice(0, 12);
  }
  const scoreFn = slug === "delivery-riders" ? deliveryScore : slug === "passenger-commute" ? passengerScore : trafficScore;
  return models.map(model => ({ model, ...scoreFn(model) })).sort((a,b)=>b.score-a.score || observedMarketRange(a.model).from-observedMarketRange(b.model).from).slice(0,12);
}

export function getCommuteGuide(slug: string) { return commuteGuides.find(g=>g.slug===slug); }
export function isIndexableCommuteGuide(slug: string) { return commuteGuideModels(slug).length >= 3; }

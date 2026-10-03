import type { Motorcycle } from "./types";
import { highDemandIntentProfile2026, type HighDemandIntentKind } from "./highDemandIntentDepth2026";
import { observedMarketPriceLabel } from "./marketChecks";
import { getVerifiedVariantsForModel } from "./variants";
import { performanceAnswerFor } from "./modelPerformance";
import { efficiencyEvidence } from "./efficiency";
import { php } from "./utils";

export type HighDemandIntentAnswer = {
  kind: HighDemandIntentKind;
  title: string;
  question: string;
  answer: string;
};

function titleFor(kind: HighDemandIntentKind, model: Motorcycle) {
  const name = `${model.make} ${model.model}`;
  switch (kind) {
    case "price": return `${name} price Philippines`;
    case "colors": return `${name} colors`;
    case "variants": return `${name} variants`;
    case "specs": return `${name} specs`;
    case "top-speed": return `${name} top speed`;
    case "seat-height": return `${name} seat height`;
    case "fuel-tank": return `${name} fuel tank capacity`;
    case "fuel-economy": return `${name} fuel consumption`;
    case "tires": return `${name} tire size`;
    case "weight": return `${name} weight`;
    case "brakes": return `${name} brakes and ABS`;
  }
}

function questionFor(kind: HighDemandIntentKind, model: Motorcycle) {
  const name = `${model.make} ${model.model}`;
  switch (kind) {
    case "price": return `How much is the ${name} in the Philippines?`;
    case "colors": return `What colors are available for the ${name}?`;
    case "variants": return `What variants are available for the ${name}?`;
    case "specs": return `What are the ${name} specs?`;
    case "top-speed": return `What is the ${name} top speed?`;
    case "seat-height": return `What is the ${name} seat height?`;
    case "fuel-tank": return `What is the ${name} fuel tank capacity?`;
    case "fuel-economy": return `What is the ${name} fuel consumption?`;
    case "tires": return `What are the ${name} tire sizes?`;
    case "weight": return `How much does the ${name} weigh?`;
    case "brakes": return `Does the ${name} have ABS?`;
  }
}

function answerFor(kind: HighDemandIntentKind, model: Motorcycle) {
  const name = `${model.make} ${model.model}`;
  const variants = getVerifiedVariantsForModel(model.id);
  const performance = performanceAnswerFor(model.id);
  const efficiency = efficiencyEvidence(model);
  const colors = [...new Set([...model.colors, ...variants.flatMap((variant) => variant.colors || [])])];

  switch (kind) {
    case "price":
      return `MotoIndex currently shows ${observedMarketPriceLabel(model)} for the ${name}. Use it as a published price reference and confirm the exact variant, branch quote, registration, insurance and financing before purchase.`;
    case "colors":
      return colors.length
        ? `Current MotoIndex coverage lists ${colors.join(", ")}. Color availability can vary by variant and dealer stock, so confirm the exact unit before reserving.`
        : `MotoIndex does not currently have a verified Philippine color list for the ${name}. Confirm the exact model year and dealer stock before reserving a color.`;
    case "variants":
      return variants.length
        ? `Verified Philippine variants currently covered are ${variants.map((variant) => `${variant.name} at ${php(variant.srpPhp)}`).join("; ")}. Compare the equipment differences and confirm the current dealer quote.`
        : `MotoIndex does not currently split the ${name} into separately verified Philippine variants. Confirm the exact trim and equipment with the dealer before comparing prices.`;
    case "specs":
      return `The ${name} uses a ${model.engineCc} cc engine rated at ${model.powerHp} hp and ${model.torqueNm} Nm. Recorded curb weight is ${model.curbWeightKg} kg, seat height is ${model.seatHeightMm} mm, fuel capacity is ${model.fuelTankL} L, and the transmission is ${model.transmission || "not listed"}.`;
    case "top-speed":
      return performance?.answer || `MotoIndex does not currently publish a verified ${name} top-speed figure. Manufacturer-published engine output and a repeatable stock-bike GPS test are more reliable than isolated dashboard readings.`;
    case "seat-height":
      return `The recorded ${name} seat height is ${model.seatHeightMm} mm. Actual reach also depends on seat width, suspension sag, rider inseam and footwear, so test the motorcycle in person if fit is important.`;
    case "fuel-tank":
      return `The ${name} fuel tank capacity is ${model.fuelTankL} L in the MotoIndex specification record.`;
    case "fuel-economy":
      return efficiency.status === "listed"
        ? `MotoIndex currently lists ${efficiency.kmPerL} km/L for the ${name}. Real-world fuel use can change with traffic, speed, load, tire pressure and maintenance.`
        : `MotoIndex currently uses ${efficiency.kmPerL} km/L as a labeled planning estimate for the ${name} because a model-specific published figure is not on file. Real-world consumption can differ.`;
    case "tires":
      return `The stock tire sizes recorded for the ${name} are ${model.frontTire} front and ${model.rearTire} rear. Match the exact size, load/speed rating and wheel fitment before replacement.`;
    case "weight":
      return `The recorded ${name} curb weight is ${model.curbWeightKg} kg. Parking, reversing and low-speed balance can feel different from the number alone, so rider fit still matters.`;
    case "brakes":
      return `MotoIndex currently records the ${name} braking setup as: ${model.abs}. Verify the exact Philippine variant before assuming ABS or other rider aids are included.`;
  }
}

export function highDemandIntentAnswers2026(model: Motorcycle): HighDemandIntentAnswer[] {
  const profile = highDemandIntentProfile2026(model.id);
  if (!profile) return [];
  return profile.intents.map((kind) => ({
    kind,
    title: titleFor(kind, model),
    question: questionFor(kind, model),
    answer: answerFor(kind, model),
  }));
}

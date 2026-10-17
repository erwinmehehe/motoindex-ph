import { hasConfirmedAbs } from "./abs";
import type { Motorcycle } from "./types";

/**
 * Answer ABS-specific buyer questions using the actual guide population.
 * Generic FAQ fallbacks must not turn a trim, scooter, or equipment question
 * into an answer about the total number of motorcycles in the guide.
 */
export function answerAbsGuideQuestion(
  question: string,
  eligibleModels: readonly Motorcycle[],
  click160?: Motorcycle
): string | undefined {
  const lower = question.trim().toLowerCase().replace(/\s+/g, " ");

  if (lower.includes("which scooters have abs") || lower.includes("which scooters list abs")) {
    const scooters = eligibleModels.filter((model) =>
      /scooter/i.test(model.category) && hasConfirmedAbs(model.abs)
    );
    if (!scooters.length) return "No scooter in the current guide has a confirmed ABS listing. Check the exact model and variant before buying.";
    const examples = scooters.slice(0, 5)
      .map((model) => model.make + " " + model.model)
      .join(", ");
    return "This guide includes " + scooters.length +
      " current scooter models with ABS listed on at least one configuration, including " +
      examples + ". Check each model page for the exact ABS-equipped variant; some base trims use different braking equipment.";
  }

  if (lower.includes("does the honda click have abs")) {
    if (!click160) return "MotoIndex does not currently show a confirmed ABS-equipped Honda Click configuration. Check the exact model year and dealer specification.";
    return "The current MotoIndex record for " + click160.make + " " + click160.model +
      " lists " + click160.abs + ", not ABS. CBS and anti-lock braking are different systems. Check the exact year and variant with the dealer.";
  }

  if (lower.includes("is abs standard on every variant")) {
    const examples = eligibleModels
      .filter((model) => /variant|standard|roadsync|\bsp\b/i.test(model.abs))
      .slice(0, 2)
      .map((model) => model.make + " " + model.model + " (" + model.abs + ")")
      .join("; ");
    return "No. A motorcycle can qualify for this guide even when ABS is available on only one trim. " +
      (examples ? "Examples of trim-specific listings include " + examples + ". " : "") +
      "Confirm the model year, trim and dealer specification rather than assuming ABS is standard.";
  }

  if (lower.includes("single-channel") && lower.includes("dual-channel")) {
    return "Single-channel ABS typically regulates anti-lock braking on one wheel, usually the front. " +
      "Dual-channel ABS can regulate the front and rear wheels separately. " +
      "Neither is the same as Combined Braking System (CBS). Check the exact model and variant for its braking configuration.";
  }

  return undefined;
}

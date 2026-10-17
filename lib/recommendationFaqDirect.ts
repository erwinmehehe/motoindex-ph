import { hasConfirmedAbs } from "./abs";
import { observedMarketRange } from "./marketChecks";
import type { Motorcycle } from "./types";

function modelName(model: Motorcycle) {
  return model.make + " " + model.model;
}
function peso(value: number) {
  return "₱" + value.toLocaleString("en-PH");
}

/**
 * Exact, data-derived answers to recurring buyer questions across the guide
 * library. Runs before broad keyword matching, which can misanswer a yes/no
 * question with an irrelevant model count.
 */
export function preciseRecommendationFaq(question: string, models: readonly Motorcycle[]): string | undefined {
  if (!models.length) return undefined;
  const lower = question.toLowerCase().replace(/\s+/g, " ").trim();
  const byPrice = [...models].sort((a,b) => observedMarketRange(a).from - observedMarketRange(b).from);
  const group = models.slice(0, 8).map(modelName).join(", ");

  if (/^(do all|does every|are all)/.test(lower) && lower.includes("abs")) {
    const eligible = models.filter(model => hasConfirmedAbs(model.abs)).length;
    return "Do not assume ABS is fitted to every trim. " + eligible + " of " + models.length +
      " motorcycle records in this comparison list ABS on at least one configuration. Check the exact model year and variant.";
  }
  if (lower.includes("which scooters") && lower.includes("abs")) {
    const matched = models.filter(model => /scooter/i.test(model.category) && hasConfirmedAbs(model.abs));
    if (!matched.length) return "No current scooter in this guide explicitly lists confirmed ABS. Check the exact equipment of any scooter you consider.";
    return matched.length + " current scooters in this guide list ABS on at least one configuration: " +
      matched.slice(0, 8).map(modelName).join(", ") + (matched.length > 8 ? " and others." : ".") +
      " ABS can be trim-dependent.";
  }
  if (/^(are|is) all automatic motorcycles scooters/.test(lower)) {
    const nonScooters = models.filter(model => model.transmission === "Automatic" && !/scooter/i.test(model.category));
    return nonScooters.length
      ? "No. This comparison also includes automatic motorcycles outside the scooter category, including " + nonScooters.slice(0,5).map(modelName).join(", ") + "."
      : "All the automatic motorcycles in this particular comparison are categorized as scooters. That does not mean every automatic motorcycle is a scooter.";
  }
  if (lower.includes("are all 1000cc motorcycles expressway legal")) {
    return "Do not assume so from a catalog engine-size label. Check the exact motorcycle's registered displacement and OR/CR, plus the current limited-access roadway and tollway requirements, before planning an expressway trip.";
  }
  if (lower.includes("is the aerox v3 exactly 155cc") || lower.includes("is the nmax v3 exactly 155cc")) {
    const id = lower.includes("aerox") ? "yamaha-aerox-v3" : "yamaha-nmax-v3";
    const model = models.find(item => item.id === id);
    return model ? "The recorded " + modelName(model) + " engine displacement is " + model.engineCc +
      " cc. Confirm the model year and exact variant on its individual page." : undefined;
  }
  if (lower.includes("are 125cc scooters included")) {
    const count = models.filter(model => /scooter/i.test(model.category) && model.engineCc >= 115 && model.engineCc <= 130).length;
    return count ? "Yes. " + count + " current 125cc-class scooters are included alongside other motorcycle formats. Use the scooter-only guide if you want to remove underbones and business motorcycles." :
      "No 125cc-class scooter currently qualifies in this particular guide.";
  }
  if (lower.includes("which raider is fastest on paper")) {
    const leader = [...models].sort((a,b) => b.powerHp-a.powerHp)[0];
    return modelName(leader) + " has the highest recorded power figure in this comparison at " + leader.powerHp +
      " hp. Power alone cannot establish top speed; gearing, weight, conditions and verified speed testing are separate factors.";
  }
  if (/^what (?:.*) (?:are|is) available in the philippines\??$/.test(lower) ||
      /^which (?:.*) (?:are|is) available in the philippines\??$/.test(lower)) {
    return "The current MotoIndex comparison includes " + models.length + " qualifying motorcycle models, including " +
      group + (models.length > 8 ? " and others." : ".") +
      " The table lists the individual prices, specifications and exact variant notes.";
  }
  if (/^(how much (?:is|are) (?:a |the )?|what .* cost|which .* cost)/.test(lower) &&
      /motorcycle|scooter|price/i.test(lower) && !/financing|fuel|ownership/.test(lower)) {
    const first = byPrice[0], last = byPrice[byPrice.length-1];
    return "In this comparison, published starting-price references run from " +
      peso(observedMarketRange(first).from) + " for " + modelName(first) + " to " +
      peso(observedMarketRange(last).from) + " for " + modelName(last) +
      ". The exact dealer quote, variant and fees can differ.";
  }
  return undefined;
}

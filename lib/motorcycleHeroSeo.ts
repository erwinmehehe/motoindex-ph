import type { Motorcycle } from "./types";
import { motorcyclePricePageSeo } from "./motorcyclePricePageSeo";

// Canonical single-model pages use the exact same model-first keyword in the
// document title and the visible H1. The brand still appears in body copy,
// breadcrumbs, structured data and metadata keywords.
export function priceFocusedModelHeading(model: Pick<Motorcycle, "model">): string {
  return `${model.model.trim()} Price Philippines`;
}

// Keep dedicated reviewed SEO copy for the eight originally requested models.
// All remaining models inherit the same keyword-led intro without rewriting
// their sourced model facts or historical price qualifications.
export function modelHeroIntro(model: Motorcycle, defaultIntro: string): string {
  const requested = motorcyclePricePageSeo(model.id);
  if (requested) return requested.intro;
  const heading = priceFocusedModelHeading(model);
  if (model.id === "yamaha-aerox-v3" || model.id === "yamaha-nmax-v3" || model.id === "honda-adv-160") {
    return `${heading} guide: Compare published prices, variants, specs, rider fit and ownership costs for the ${model.make} ${model.model}, with reasons to buy or skip, direct alternatives and Philippine after-sales links.`;
  }
  return `${heading} guide: ${defaultIntro.trim()}`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Preserve detailed, model-specific price descriptions from the existing SEO
// profiles, while making the exact requested H1 keyword visible in the snippet.
// Do not replace a past-model warning with a claim of current PH availability.
export function modelPriceMetaDescription(model: Motorcycle, sourceDescription: string): string {
  const heading = priceFocusedModelHeading(model);
  const description = sourceDescription.replace(/\s+/g, " ").trim();
  const compactModel = model.model.replace(/\s+/g, "");
  const brandedNames = new Set([
    `${model.make} ${model.model}`,
    `${model.make} ${compactModel}`,
    model.model,
    compactModel,
    ...(model.alsoKnownAs || [])
  ]);
  let aligned = "";
  if (description.toLowerCase().startsWith(heading.toLowerCase())) {
    aligned = heading + description.slice(heading.length);
  } else {
    for (const alias of brandedNames) {
      const branded = new RegExp(`^${escapeRegex(alias)}\\s+price\\s+(?:in\\s+(?:the\\s+)?)?Philippines\\b`, "i");
      if (branded.test(description)) {
        // Trim the repeated branded price phrase while retaining facts and variants.
        aligned = description.replace(branded, heading);
        break;
      }
    }
    if (!aligned) aligned = `${heading}: ${description}`;
  }

  // Ensure status caveats are visible before generic meta-description trimming
  // can hide them. Do not relabel a previous or discontinued bike as new stock.
  const lead = aligned.slice(heading.length, 135).split(/\.\s/)[0];
  const statusMissing =
    (model.marketStatus === "previous" && !/historical|previous|dated|last published|used|not current/i.test(lead)) ||
    (model.marketStatus === "discontinued" && !/discontinued/i.test(lead)) ||
    (model.marketStatus === "uncertain" && !/availability|verify|confirm|uncertain|stock/i.test(lead));
  if (!statusMissing) return aligned;

  const caveat = model.marketStatus === "previous"
    ? "Previous-generation historical price. "
    : model.marketStatus === "discontinued"
      ? "Discontinued model; historical price. "
      : "Current dealer availability is unconfirmed. ";
  const remainder = aligned.slice(heading.length).replace(/^:\s*/, "").trim();
  return `${heading}: ${caveat}${remainder}`;
}

// Preserve the visual description first, then add one page-specific keyword.
// Do not portray a placeholder as a photograph or repeat an existing phrase.
export function contextualHeroImageAlt(visualAlt: string, keyword: string): string {
  const descriptive = visualAlt.trim();
  if (!descriptive) return `${keyword} image not available`;
  if (descriptive.includes(keyword)) return descriptive;
  // Normalize case when the exact phrase already appears in image metadata.
  if (descriptive.toLowerCase().includes(keyword.toLowerCase())) {
    return descriptive.replace(new RegExp(escapeRegex(keyword), "i"), keyword);
  }
  // An accurate placeholder alt can carry the keyword without claiming a
  // stock graphic or unavailable photo depicts this motorcycle.
  if (/placeholder/i.test(descriptive)) return `${descriptive} for ${keyword}`;
  return `${descriptive}, featured in the ${keyword} guide`;
}

export function modelHeroImageAlt(model: Motorcycle, visualAlt: string): string {
  return contextualHeroImageAlt(visualAlt, priceFocusedModelHeading(model));
}

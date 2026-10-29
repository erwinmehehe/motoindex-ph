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
  return value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
}

// Preserve detailed, model-specific price descriptions from the existing SEO
// profiles, while making the exact requested H1 keyword visible in the snippet.
// Do not replace a past-model warning with a claim of current PH availability.
export function modelPriceMetaDescription(model: Motorcycle, sourceDescription: string): string {
  const heading = priceFocusedModelHeading(model);
  const description = sourceDescription.replace(/\s+/g, " ").trim();
  if (description.toLowerCase().startsWith(heading.toLowerCase())) return description;

  // When an existing description starts with the fully branded price query,
  // replace only that query. Keep its unique model/variant details intact.
  const fullName = `${model.make} ${model.model}`;
  const branded = new RegExp(`^${escapeRegex(fullName)}\\s+price\\s+(?:in\\s+(?:the\\s+)?)?Philippines\\b`, "i");
  if (branded.test(description)) return description.replace(branded, heading);

  const qualifier = model.marketStatus === "previous"
    ? "Previous-generation historical price; not a current dealer quote. "
    : model.marketStatus === "discontinued"
      ? "Discontinued model; historical price, not a current dealer quote. "
      : model.marketStatus === "uncertain"
        ? "Current Philippine dealer availability must be confirmed. "
        : "";
  return `${heading}: ${qualifier}${description}`;
}

// Preserve the visual description first, then add one page-specific keyword.
// Do not portray a placeholder as a photograph or repeat an existing phrase.
export function contextualHeroImageAlt(visualAlt: string, keyword: string): string {
  const descriptive = visualAlt.trim();
  if (!descriptive || /placeholder/i.test(descriptive)) return descriptive;
  if (descriptive.toLowerCase().includes(keyword.toLowerCase())) return descriptive;
  return `${descriptive}, featured in the ${keyword} guide`;
}

export function modelHeroImageAlt(model: Motorcycle, visualAlt: string): string {
  return contextualHeroImageAlt(visualAlt, priceFocusedModelHeading(model));
}

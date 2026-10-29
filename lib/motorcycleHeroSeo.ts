import type { Motorcycle } from "./types";

// These three H1s are intentionally model-first and price-focused.
// Keep the hero lede and its main image aligned with their search intent.
const PRICE_FOCUSED_HEADINGS: Readonly<Record<string, string>> = {
  "yamaha-aerox-v3": "Aerox V3 Price Philippines",
  "yamaha-nmax-v3": "NMAX V3 Price Philippines",
  "honda-adv-160": "ADV 160 Price Philippines"
};

export function priceFocusedModelHeading(model: Motorcycle): string | undefined {
  return PRICE_FOCUSED_HEADINGS[model.id];
}

export function modelHeroIntro(model: Motorcycle, defaultIntro: string): string {
  const heading = priceFocusedModelHeading(model);
  if (!heading) return defaultIntro;
  return `${heading} guide: Compare published prices, variants, specs, rider fit and ownership costs for the ${model.make} ${model.model}, with reasons to buy or skip, direct alternatives and Philippine after-sales links.`;
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
  const keyword = priceFocusedModelHeading(model) || `${model.make} ${model.model} price Philippines`;
  return contextualHeroImageAlt(visualAlt, keyword);
}

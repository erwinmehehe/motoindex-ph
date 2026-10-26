import type { Motorcycle } from "./types";

// Keep the four previously featured models in view while adding higher-volume
// current models. Search volume is historical research used for internal shelf
// ordering, not a buyer recommendation or a live traffic claim.
export const HOMEPAGE_MOTORCYCLE_LIMIT = 15;

export const EXISTING_HOMEPAGE_MODEL_IDS = [
  "yamaha-aerox-v3",
  "yamaha-nmax-v3",
  "honda-adv-160",
  "honda-click-160",
] as const;

const existingIds = new Set<string>(EXISTING_HOMEPAGE_MODEL_IDS);

function byRecordedSearchVolume(a: Motorcycle, b: Motorcycle) {
  return (
    b.searchVolume - a.searchVolume ||
    a.make.localeCompare(b.make) ||
    a.model.localeCompare(b.model) ||
    a.id.localeCompare(b.id)
  );
}

/**
 * Accept only current, indexable public catalog models from the caller.
 * Avoid duplicate model cards, retain the original four when still eligible,
 * and use recorded Philippine query demand to choose the remaining slots.
 */
export function selectHomepageMotorcycles(models: readonly Motorcycle[]) {
  const uniqueModels = new Map<string, Motorcycle>();
  for (const model of models) {
    if (!uniqueModels.has(model.id)) uniqueModels.set(model.id, model);
  }

  const ranked = [...uniqueModels.values()].sort(byRecordedSearchVolume);
  const retained = ranked.filter((model) => existingIds.has(model.id));
  const slots = Math.max(0, HOMEPAGE_MOTORCYCLE_LIMIT - retained.length);
  const additions = ranked.filter((model) => !existingIds.has(model.id)).slice(0, slots);

  return [...retained, ...additions].sort(byRecordedSearchVolume);
}

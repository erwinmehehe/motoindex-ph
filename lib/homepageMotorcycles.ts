import type { Motorcycle } from "./types";

// This is an editorial homepage shelf, not a buyer recommendation ranking.
// Search volumes are historical PH keyword research estimates stored in the
// catalog, not live traffic, sales, or popularity figures.
export const HOMEPAGE_MOTORCYCLE_LIMIT = 15;

function compareRecordedDemand(a: Motorcycle, b: Motorcycle) {
  return (
    b.searchVolume - a.searchVolume ||
    a.make.localeCompare(b.make) ||
    a.model.localeCompare(b.model) ||
    a.id.localeCompare(b.id)
  );
}

/**
 * The caller supplies current, indexable public models. Select the 15
 * highest-demand unique models, without giving existing cards reserved slots
 * that would exclude a model with higher recorded search volume.
 */
export function selectHomepageMotorcycles(models: readonly Motorcycle[]): Motorcycle[] {
  const unique = new Map<string, Motorcycle>();
  for (const model of models) {
    if (!unique.has(model.id)) unique.set(model.id, model);
  }

  return [...unique.values()]
    .sort(compareRecordedDemand)
    .slice(0, HOMEPAGE_MOTORCYCLE_LIMIT);
}

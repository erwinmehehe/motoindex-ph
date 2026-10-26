import { describe, expect, it } from "vitest";
import { isIndexableModel, publicMotorcycles } from "../lib/data";
import {
  EXISTING_HOMEPAGE_MODEL_IDS,
  HOMEPAGE_MOTORCYCLE_LIMIT,
  selectHomepageMotorcycles,
} from "../lib/homepageMotorcycles";

describe("homepage current motorcycle selection", () => {
  const featured = selectHomepageMotorcycles(publicMotorcycles);
  const featuredIds = new Set(featured.map((model) => model.id));
  const originallyFeatured = new Set<string>(EXISTING_HOMEPAGE_MODEL_IDS);

  it("shows 15 unique, current and indexable model pages", () => {
    expect(featured).toHaveLength(Math.min(HOMEPAGE_MOTORCYCLE_LIMIT, publicMotorcycles.length));
    expect(featuredIds.size).toBe(featured.length);
    expect(featured.every((model) =>
      isIndexableModel(model) && !["previous", "uncertain", "discontinued"].includes(model.marketStatus || "")
    )).toBe(true);
  });

  it("retains all four original featured models while eligible", () => {
    for (const id of EXISTING_HOMEPAGE_MODEL_IDS) {
      if (publicMotorcycles.some((model) => model.id === id)) {
        expect(featuredIds.has(id)).toBe(true);
      }
    }
  });

  it("uses recorded query volumes for ordering and fills other slots by demand", () => {
    const volumes = featured.map((model) => model.searchVolume);
    expect(volumes).toEqual([...volumes].sort((a, b) => b - a));

    const additions = featured.filter((model) => !originallyFeatured.has(model.id));
    const excluded = publicMotorcycles.filter((model) =>
      !originallyFeatured.has(model.id) && !featuredIds.has(model.id)
    );
    if (additions.length > 0 && excluded.length > 0) {
      const smallestIncludedVolume = Math.min(...additions.map((model) => model.searchVolume));
      expect(excluded.every((model) => model.searchVolume <= smallestIncludedVolume)).toBe(true);
    }
  });

  it("does not mutate the caller's catalog order", () => {
    const models = publicMotorcycles.slice(0, 20);
    const ids = models.map((model) => model.id);
    selectHomepageMotorcycles(models);
    expect(models.map((model) => model.id)).toEqual(ids);
  });
});

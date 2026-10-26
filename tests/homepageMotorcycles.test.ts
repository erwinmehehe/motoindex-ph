import { describe, expect, it } from "vitest";
import { isIndexableModel, publicMotorcycles } from "../lib/data";
import { HOMEPAGE_MOTORCYCLE_LIMIT, selectHomepageMotorcycles } from "../lib/homepageMotorcycles";

describe("homepage current motorcycles by recorded Philippine search volume", () => {
  const featured = selectHomepageMotorcycles(publicMotorcycles);

  it("shows up to 15 unique, current and indexable model pages", () => {
    expect(featured).toHaveLength(Math.min(HOMEPAGE_MOTORCYCLE_LIMIT, publicMotorcycles.length));
    expect(new Set(featured.map((model) => model.id)).size).toBe(featured.length);
    expect(featured.every((model) =>
      isIndexableModel(model) && !["previous", "uncertain", "discontinued"].includes(model.marketStatus || "")
    )).toBe(true);
  });

  it("uses all 15 positions for the highest-demand eligible models, without pinned exceptions", () => {
    const expected = [...publicMotorcycles]
      .sort((a, b) =>
        b.searchVolume - a.searchVolume ||
        a.make.localeCompare(b.make) ||
        a.model.localeCompare(b.model) ||
        a.id.localeCompare(b.id))
      .slice(0, HOMEPAGE_MOTORCYCLE_LIMIT);
    expect(featured.map((model) => model.id)).toEqual(expected.map((model) => model.id));
    expect(featured.map((model) => model.searchVolume)).toEqual(
      [...featured.map((model) => model.searchVolume)].sort((a, b) => b - a)
    );
  });

  it("deduplicates input by model ID", () => {
    const sample = [publicMotorcycles[0], publicMotorcycles[0], publicMotorcycles[1]];
    expect(selectHomepageMotorcycles(sample).map((model) => model.id)).toHaveLength(2);
  });

  it("does not change the input catalog order", () => {
    const sample = publicMotorcycles.slice(0, 20);
    const before = sample.map((model) => model.id);
    selectHomepageMotorcycles(sample);
    expect(sample.map((model) => model.id)).toEqual(before);
  });
});

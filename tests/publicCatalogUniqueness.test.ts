import { describe, expect, it } from "vitest";
import { publicMotorcycles } from "../lib/data";
import { currentPublicMotorcycles, currentScooters } from "../lib/motorcycleMarket";

describe("public motorcycle catalog identities", () => {
  it.each([
    ["public catalog", publicMotorcycles],
    ["current market", currentPublicMotorcycles],
    ["scooter market", currentScooters],
  ] as const)("renders each ID once in the %s", (_name, models) => {
    expect(models.length).toBeGreaterThan(0);
    expect(new Set(models.map(model => model.id)).size).toBe(models.length);
  });
});

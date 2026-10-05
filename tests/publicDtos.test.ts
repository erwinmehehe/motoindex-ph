import { describe, expect, it } from "vitest";
import { toPublicMotorcycle } from "../lib/publicDtos";
import type { Motorcycle } from "../lib/types";

describe("public motorcycle DTO", () => {
  it("does not expose internal keyword research fields", () => {
    const model: Motorcycle = {
      id: "test-bike",
      make: "Test",
      makeSlug: "test",
      model: "Bike",
      slug: "bike",
      generation: "Current",
      category: "Scooter",
      srp: 100000,
      engineCc: 125,
      powerHp: 10,
      torqueNm: 10,
      curbWeightKg: 100,
      seatHeightMm: 760,
      fuelTankL: 5,
      frontTire: "90/90-14",
      rearTire: "100/90-14",
      abs: "ABS",
      colors: ["Black"],
      searchVolume: 12345,
      keywordDifficulty: 17,
      sourceLabel: "Source",
      sourceUrl: "https://example.com/source",
      verifiedAt: "2026-10-05",
      freshness: "verified",
      summary: "Test motorcycle",
    };

    const dto = toPublicMotorcycle(model);
    expect(dto).not.toHaveProperty("searchVolume");
    expect(dto).not.toHaveProperty("keywordDifficulty");
    expect(dto).toMatchObject({
      id: "test-bike",
      make: "Test",
      model: "Bike",
      srp: 100000,
    });
  });
});

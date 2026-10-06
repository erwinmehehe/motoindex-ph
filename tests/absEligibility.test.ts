import { describe, expect, it } from "vitest";
import { hasConfirmedAbs, getRecommendationModels } from "../lib/data";

describe("confirmed ABS guide eligibility", () => {
  it.each([
    "Front and rear disc brakes; the current Philippine product page does not list ABS",
    "Philippine third-party listings conflict on ABS, so verify the exact dealer unit",
    "ABS is not stated on the official product page",
    "Adventure braking package; confirm exact current-model ABS settings with the dealer",
  ])("excludes uncertain or negative wording: %s", wording => {
    expect(hasConfirmedAbs(wording)).toBe(false);
  });
  it.each(["Dual-channel ABS", "Variant-dependent; ABS on Premium and Racing variants", "CBS (Standard); ABS + HSTC (RoadSync)"])("retains confirmed equipment: %s", wording => {
    expect(hasConfirmedAbs(wording)).toBe(true);
  });
  it("excludes contradictory entries from the public ABS guide", () => {
    const ids=getRecommendationModels("motorcycles-with-abs-philippines").map(m=>m.id);
    expect(ids).not.toContain("kymco-like-125-italia");
    expect(ids).not.toContain("benelli-rfs-150i");
  });
});

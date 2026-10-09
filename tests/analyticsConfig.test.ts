import { describe, expect, it } from "vitest";
import { googleAnalyticsMeasurementId } from "../lib/analyticsConfig";

describe("explicit analytics configuration", () => {
  it("does not enable a hidden fallback when the variable is unset", () => {
    expect(googleAnalyticsMeasurementId(undefined)).toBe("");
    expect(googleAnalyticsMeasurementId("")).toBe("");
  });
  it("accepts a valid GA4 measurement identifier", () => {
    expect(googleAnalyticsMeasurementId(" G-20TKY10EPQ ")).toBe("G-20TKY10EPQ");
  });
  it("rejects untrusted or malformed ID values", () => {
    expect(googleAnalyticsMeasurementId("UA-12345-1")).toBe("");
    expect(googleAnalyticsMeasurementId("G-123';alert(1)")).toBe("");
    expect(googleAnalyticsMeasurementId("not-configured")).toBe("");
  });
});

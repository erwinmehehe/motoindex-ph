import { describe, expect, it } from "vitest";
import { googleAnalyticsMeasurementId, publicAnalyticsAllowed, safePageviewUrl, plausibleSiteScriptUrl } from "../lib/analyticsConfig";

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


describe("private URL tracking prevention", () => {
  it("excludes accounts, tokens and API paths", () => {
    for (const path of [
      "/quote-status/secret-access-token", "/dealer-lead/private-token",
      "/garage/sign-in/verify/secret", "/price-alerts/confirm/secret",
      "/price-alerts/unsubscribe/secret", "/admin", "/api/leads",
      "/my", "/dealer-portal", "/go/merchant-redirect",
    ]) expect(publicAnalyticsAllowed(path)).toBe(false);
  });

  it("allows ordinary motorcycle and dealer discovery pages", () => {
    for (const path of ["/", "/motorcycles/yamaha/aerox-v3", "/dealers", "/price-alerts"]) {
      expect(publicAnalyticsAllowed(path)).toBe(true);
    }
  });

  it("never constructs pageviews with private tokens or query strings", () => {
    expect(safePageviewUrl("https://motoindexph.com", "/motorcycles")).toBe("https://motoindexph.com/motorcycles");
    expect(safePageviewUrl("https://motoindexph.com", "/quote-status/secret")).toBe("");
    expect(safePageviewUrl("https://motoindexph.com", "/motorcycles?phone=1234567890")).toBe("");
    expect(safePageviewUrl("javascript:alert(1)", "/motorcycles")).toBe("");
  });


  it("fails closed on new or ambiguous private-looking routes", () => {
    for (const path of [
      "/get-quote/honda/adv-160", "/profile", "/account",
      "/dealer-portal/sign-in", "/quote-status/anything",
      "/price-alerts/confirm/t0ken", "/my/settings",
      "/%71uote-status/bearer", "/motorcycles/%2e%2e/quote-status/test",
      "/motorcycles//yamaha", "/guides/helmet-fit?email=person@example.com",
    ]) expect(publicAnalyticsAllowed(path)).toBe(false);
  });

  it("preserves expected non-sensitive editorial and catalogue paths", () => {
    for (const path of [
      "/guides/motorcycle-helmet-size-guide", "/motorcycles/yamaha/aerox-v3",
      "/recommendations", "/tools/motorcycle-loan-calculator", "/privacy", "/price-alerts",
    ]) expect(publicAnalyticsAllowed(path)).toBe(true);
  });

  it("requires a known per-site Plausible script, not a legacy automatic script", () => {
    expect(plausibleSiteScriptUrl(undefined)).toBe("");
    expect(plausibleSiteScriptUrl("https://plausible.io/js/script.js")).toBe("");
    expect(plausibleSiteScriptUrl("https://plausible.io/js/pa-AbC123_.js")).toBe("https://plausible.io/js/pa-AbC123_.js");
    expect(plausibleSiteScriptUrl("https://elsewhere.example/js/pa-AbC123_.js")).toBe("");
  });
});

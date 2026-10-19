import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { safeAnalyticsEventParams, trackEvent } from "../lib/track";

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE", "true"));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("application event tracking privacy guard", () => {
  it("refuses all tracking when the deployment has not explicitly opted in", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE", "false");
    const gtag = vi.fn(), plausible = vi.fn();
    vi.stubGlobal("window", { location: { origin: "https://motoindexph.com", pathname: "/motorcycles/honda/click-160" }, gtag, plausible });
    trackEvent("dealer_coverage_checked", { available: 1 });
    expect(gtag).not.toHaveBeenCalled();
    expect(plausible).not.toHaveBeenCalled();
  });

  it("does not dispatch custom analytics events on a private buyer status link", () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    vi.stubGlobal("window", { location: { pathname: "/quote-status/private-bearer-token" }, gtag, plausible });
    trackEvent("dealer_quote_request", { model_id: "aerox-v3" });
    expect(gtag).not.toHaveBeenCalled();
    expect(plausible).not.toHaveBeenCalled();
  });

  it("does not dispatch events from magic link verification or account routes", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { location: { pathname: "/garage/sign-in/verify/private-token" }, gtag });
    trackEvent("garage_login");
    expect(gtag).not.toHaveBeenCalled();
  });

  it("keeps non-personal public conversion events working", () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    vi.stubGlobal("window", { location: { origin: "https://motoindexph.com", pathname: "/motorcycles/yamaha/aerox-v3", search: "?email=sensitive%40example.com" }, gtag, plausible });
    trackEvent("dealer_coverage_checked", { model_id: "aerox-v3", available: 1 });
    expect(gtag).toHaveBeenCalledWith("event", "dealer_coverage_checked", { model_id: "aerox-v3", available: 1, page_location: "https://motoindexph.com/motorcycles/yamaha/aerox-v3", page_path: "/motorcycles/yamaha/aerox-v3" });
    expect(plausible).toHaveBeenCalledWith("dealer_coverage_checked", { props: { model_id: "aerox-v3", available: 1 }, url: "https://motoindexph.com/motorcycles/yamaha/aerox-v3" });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("sensitive");
    expect(JSON.stringify(plausible.mock.calls)).not.toContain("sensitive");
  });
  it("allows only reviewed catalogue identifiers and aggregate counters", () => {
    expect(safeAnalyticsEventParams({
      model_id: "honda-click-160", count: 2, available: 1, zero_results: false,
      query_length: 12, results: 3, a: "yamaha-aerox-v3",
      name: "Customer Name", phone: "+639123456789", email: "person@example.com",
      cityProvince: "Private city", query: "my phone is 09123456789",
      token: "bearer-token", location: "private address", price: 150000,
    })).toEqual({
      model_id: "honda-click-160", count: 2, available: 1, zero_results: false,
      query_length: 12, results: 3, a: "yamaha-aerox-v3",
    });
  });

  it("drops untrusted identifier values, malformed counts, and private metadata in both providers", () => {
    const gtag = vi.fn(), plausible = vi.fn();
    vi.stubGlobal("window", { location: {
      origin: "https://motoindexph.com", pathname: "/motorcycles/honda/click-160",
    }, gtag, plausible });
    trackEvent("dealer_coverage_checked", {
      model_id: "someone@example.com", available: 1, count: Number.POSITIVE_INFINITY,
      product_id: "a639123456789", merchant: "Shopee", placement: "model-page",
      token: "do-not-send", email: "customer@example.com",
      cityProvince: "City from lead", query: "search PII",
    });
    const expected = {
      available: 1, placement: "model-page",
      page_location: "https://motoindexph.com/motorcycles/honda/click-160",
      page_path: "/motorcycles/honda/click-160",
    };
    expect(gtag).toHaveBeenCalledWith("event", "dealer_coverage_checked", expected);
    expect(plausible).toHaveBeenCalledWith("dealer_coverage_checked", {
      props: { available: 1, placement: "model-page" },
      url: expected.page_location,
    });
    for (const forbidden of ["someone@example.com", "customer@example.com", "a639123456789", "do-not-send", "City from lead", "search PII"]) {
      expect(JSON.stringify([gtag.mock.calls, plausible.mock.calls])).not.toContain(forbidden);
    }
  });

  it("rejects dynamic event names containing visitor data", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      location: { origin: "https://motoindexph.com", pathname: "/guides/motorcycle-helmet-size-guide" }, gtag,
    });
    trackEvent("search_person@example.com", { count: 1 });
    expect(gtag).not.toHaveBeenCalled();
  });

});

import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "../lib/track";

afterEach(() => vi.unstubAllGlobals());

describe("application event tracking privacy guard", () => {
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
    vi.stubGlobal("window", { location: { pathname: "/motorcycles/yamaha/aerox-v3" }, gtag, plausible });
    trackEvent("dealer_coverage_checked", { model_id: "aerox-v3", available: 1 });
    expect(gtag).toHaveBeenCalledWith("event", "dealer_coverage_checked", { model_id: "aerox-v3", available: 1 });
    expect(plausible).toHaveBeenCalledWith("dealer_coverage_checked", { props: { model_id: "aerox-v3", available: 1 } });
  });
});

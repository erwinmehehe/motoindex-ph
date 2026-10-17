import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("privacy analytics release gates", () => {
  const component = readFileSync(new URL("../components/Analytics.tsx", import.meta.url), "utf8");
  const tracker = readFileSync(new URL("../lib/track.ts", import.meta.url), "utf8");
  const sample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
  const release = readFileSync(new URL("../.github/workflows/cloudflare-production-deploy.yml", import.meta.url), "utf8");

  it("does not bootstrap GA4 or Plausible without explicit build-time owner approval", () => {
    expect(component).toContain('process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE === "true"');
    expect(component).toContain('const ga = trackingEnabled ?');
    expect(component).toContain('const plausibleScript = trackingEnabled ?');
    expect(component).toContain("send_page_view:false");
    expect(component).toContain("autoCapturePageviews:false");
  });

  it("does not emit custom analytics events when the release is not approved", () => {
    expect(tracker).toContain('process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE !== "true"');
    expect(tracker).toContain("publicAnalyticsAllowed(window.location.pathname)");
  });

  it("keeps sample and manual production deployment OFF until separate privacy QA", () => {
    expect(sample).toContain("NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=false");
    expect(sample).toContain("NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=");
    expect(release).not.toMatch(/^\s+NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE:/m);
  });
});

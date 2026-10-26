import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("privacy analytics release gates", () => {
  const component = readFileSync(new URL("../components/Analytics.tsx", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const tracker = readFileSync(new URL("../lib/track.ts", import.meta.url), "utf8");
  const sample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
  const release = readFileSync(new URL("../.github/workflows/cloudflare-production-deploy.yml", import.meta.url), "utf8");

  it("puts the owner-requested GA4 tag in head without a second loader", () => {
    expect(layout).toContain('<head><script id="motoindex-ga4-head"');
    expect(layout).toContain("G-20TKY10EPQ");
    expect(layout).toContain("send_page_view: false");
    expect(component).toContain('const ga = googleAnalyticsMeasurementId("G-20TKY10EPQ")');
    expect(component).toContain("document.head.appendChild(script)");
    expect(component).toContain("if (!ga || !publicRoute) return;");
    expect(component).toContain('script[data-motoindex-ga4-loader]');
    expect(component).not.toContain('id="motoindex-ga"');
    expect(component).not.toContain('<Script src={`https://www.googletagmanager.com');
  });

  it("keeps Plausible, custom events, and production release controls gated", () => {
    expect(component).toContain('process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE === "true"');
    expect(component).toContain('const plausibleScript = trackingEnabled ?');
    expect(component).toContain("autoCapturePageviews:false");
  });

  it("does not emit custom analytics events when the release is not approved", () => {
    expect(tracker).toContain('process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE !== "true"');
    expect(tracker).toContain("publicAnalyticsAllowed(window.location.pathname)");
  });

  it("does not send raw search terms even if a legacy capture flag is set", () => {
    const search = readFileSync(new URL("../components/SearchClient.tsx", import.meta.url), "utf8");
    const tracker = readFileSync(new URL("../lib/track.ts", import.meta.url), "utf8");
    expect(search).not.toContain("NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS");
    expect(search).toContain("query_length:q.length");
    expect(tracker).toContain("safeAnalyticsEventParams(params)");
    expect(tracker).not.toContain("...params, page_location");
  });

  it("keeps the optional provider and release opt-in controls intact", () => {
    expect(sample).toContain("NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=false");
    expect(sample).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID=G-20TKY10EPQ");
    expect(release).toContain("vars.MOTOINDEX_GA_MEASUREMENT_ID || 'G-20TKY10EPQ'");
    expect(sample).toContain("NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=");
    expect(release).toContain("MOTOINDEX_ANALYTICS_SAFE_ENABLE || 'false'");
    expect(release).toContain("MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED || 'false'");
    expect(release).toContain("MOTOINDEX_ANALYTICS_SAFE_ENABLE == 'true' && vars.MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED == 'true'");
    expect(release.match(/node scripts\/verify-analytics-release\.mjs/g)).toHaveLength(2);
  });

  it("rejects unapproved or invalid GA4 activation, but allows an approved configured build", () => {
    const validator = fileURLToPath(new URL("../scripts/verify-analytics-release.mjs", import.meta.url));
    const check = (overrides: Record<string, string> = {}) => spawnSync(process.execPath, [validator], {
      encoding: "utf8",
      env: {
        ...process.env,
        MOTOINDEX_ANALYTICS_SAFE_ENABLE: "false",
        MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED: "false",
        NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE: "false",
        NEXT_PUBLIC_GA_MEASUREMENT_ID: "",
        NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC: "",
        ...overrides
      }
    });
    expect(check().status).toBe(0);
    expect(check({ MOTOINDEX_ANALYTICS_SAFE_ENABLE: "true" }).status).not.toBe(0);
    expect(check({
      MOTOINDEX_ANALYTICS_SAFE_ENABLE: "true",
      MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED: "true",
      NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE: "true"
    }).status).not.toBe(0);
    expect(check({ NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE: "true" }).status).not.toBe(0);
    expect(check({
      MOTOINDEX_ANALYTICS_SAFE_ENABLE: "true",
      MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED: "true",
      NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE: "true",
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "UA-123"
    }).status).not.toBe(0);
    expect(check({
      MOTOINDEX_ANALYTICS_SAFE_ENABLE: "true",
      MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED: "true",
      NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE: "true",
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-20TKY10EPQ"
    }).status).toBe(0);
  });
});

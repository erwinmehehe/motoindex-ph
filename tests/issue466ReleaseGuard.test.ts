import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

describe("issue #466 release and private URL guards", () => {
  it("sets no-store and no-referrer on private buyer, dealer, and token routes", () => {
    const middleware = read("middleware.ts");
    expect(middleware).toContain('pathname.startsWith("/quote-status/")');
    expect(middleware).toContain('pathname.startsWith("/dealer-lead/")');
    expect(middleware).toContain('pathname.startsWith("/price-alerts/unsubscribe/")');
    const privateGuard = middleware.slice(
      middleware.indexOf('if (pathname.startsWith("/dealer-lead/")'),
      middleware.indexOf('if (pathname === "/motorcycles")')
    );
    expect(privateGuard).toContain('response.headers.set("Cache-Control", "no-store")');
    expect(privateGuard).toContain('response.headers.set("Referrer-Policy", "no-referrer")');
  });

  it("keeps GA/Plausible opt-in separate from AdSense, never implicitly enabling either", () => {
    const analytics = read("components/Analytics.tsx");
    const ads = read("lib/adsense.ts");
    const deployment = read(".github/workflows/cloudflare-production-deploy.yml");
    expect(analytics).toContain('NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE === "true"');
    expect(ads).toContain('NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(deployment).toContain("MOTOINDEX_ADSENSE_ENABLED || 'false'");
    expect(deployment).not.toMatch(/^\s+NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE:/m);
  });

  it("provides preview-only synthetic browser evidence checks, not a silent all-off pass", () => {
    const qa = read("scripts/issue-466-browser-qa.mjs");
    expect(qa).toContain("QA_BASE_URL");
    expect(qa).toContain("QA_EXPECT_ADS");
    expect(qa).toContain("QA_EXPECT_ANALYTICS");
    expect(qa).toContain("QA_ALLOW_PRODUCTION");
    expect(qa).toContain("motoindex-synthetic-privacy-qa-466");
    expect(qa).toContain("AdSense script survives public-to-private history transition");
    expect(qa).toContain("Third-party analytics/ad request during");
    expect(qa).not.toContain("console.log(request.url())");
    const script = fileURLToPath(new URL("../scripts/issue-466-browser-qa.mjs", import.meta.url));
    const check = spawnSync(process.execPath, ["--check", script], { encoding: "utf8" });
    expect(check.status, check.stderr).toBe(0);
  });

  it("keeps provider, CSP, consent and browser acceptance outside code-only CI signoff", () => {
    const acceptance = read("docs/issue-466-release-acceptance.md");
    for (const token of [
      "GA4 history-pageview controls", "AdSense account", "Seller record",
      "CSP **P0 blocker**", "Consent/privacy", "Public → private → public",
      "Revenue, conversions and release", "manual", "OPEN",
    ]) expect(acceptance).toContain(token);
  });
});

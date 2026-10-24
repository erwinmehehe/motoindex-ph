import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { isAdSensePriorityDocument, isAdSensePublicDocument } from "../lib/adsenseGuideCsp";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
afterEach(() => vi.unstubAllEnvs());

const adRoutes = [
  "/tires", "/gear/helmets", "/research/motorcycle-price-index-philippines",
  "/motorcycles/scooters", "/recommendations/best-scooters-philippines",
];
const adPageFiles = [
  "app/tires/page.tsx", "app/gear/helmets/page.tsx",
  "app/research/motorcycle-price-index-philippines/page.tsx",
  "app/motorcycles/scooters/page.tsx", "app/recommendations/[slug]/page.tsx",
];

describe("selective high-traffic editorial AdSense expansion", () => {
  it("uses an exact public allowlist while excluding private, derivative and interactive pages", () => {
    for (const path of adRoutes) {
      expect(isAdSensePriorityDocument(path)).toBe(true);
      expect(isAdSensePublicDocument(path)).toBe(true);
      expect(isAdSensePriorityDocument(path + "/")).toBe(true);
    }
    for (const path of [
      "/tires/honda-beat-tire-size", "/gear/helmets/finder", "/gear/helmets/compare",
      "/gear/helmets/full-face", "/research", "/recommendations",
      "/recommendations/125cc-scooters-philippines",
      "/recommendations/best-scooters-philippines/private", "/motorcycles/electric",
      "/compare", "/my", "/garage", "/dealer-lead/token", "/quote-status/token",
      "/admin", "/api/leads", "/tires?email=private",
    ]) expect(isAdSensePriorityDocument(path)).toBe(false);
  });

  it("requires both approval flags and issues fresh direct-document nonces", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "false");
    expect((await middleware(new NextRequest("https://motoindexph.com/tires")))
      .headers.get("x-middleware-request-x-nonce")).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const path of adRoutes) {
      const req = () => new NextRequest("https://motoindexph.com" + path);
      const one = await middleware(req()), two = await middleware(req());
      const nonce = one.headers.get("x-middleware-request-x-nonce");
      const policy = one.headers.get("Content-Security-Policy") || "";
      expect(nonce).toBeTruthy();
      expect(policy).toContain("'strict-dynamic'");
      expect(policy).toContain("'nonce-" + nonce + "'");
      expect(one.headers.get("Cache-Control")).toContain("no-store");
      expect(one.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(policy).not.toBe(two.headers.get("Content-Security-Policy"));
    }
  });

  it("does not load advertising on query, RSC or prefetch documents", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const path of adRoutes) {
      const r = await middleware(new NextRequest("https://motoindexph.com" + path + "?email=synthetic-private"));
      expect(r.headers.get("x-middleware-request-x-nonce")).toBeNull();
      expect(r.headers.get("Content-Security-Policy")).toContain("script-src 'self'");
      expect(r.headers.get("Content-Security-Policy")).not.toContain("'strict-dynamic'");
      expect(r.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(r.headers.get("X-Robots-Tag")).toBe("noindex, follow");
      for (const h of ["rsc", "next-router-prefetch"]) {
        const prefetch = await middleware(new NextRequest("https://motoindexph.com" + path, { headers: { [h]: "1" } }));
        expect(prefetch.headers.get("x-middleware-request-x-nonce")).toBeNull();
        expect(prefetch.headers.get("Content-Security-Policy")).toContain("script-src 'self'");
      }
    }
  });

  it("renders a single labeled slot after substantive content, never in the root layout", () => {
    for (const file of adPageFiles) {
      const src = read(file);
      expect(src).toContain('<AdSense nonce={adNonce} />');
      expect(src).toContain('<GuideInContentAd nonceReady={Boolean(adNonce)} />');
      expect(src).toContain("motorcycleAdNonce()");
      expect((src.match(/<GuideInContentAd nonceReady=/g) || []).length).toBe(1);
    }
    const bestScooters = read("app/recommendations/[slug]/page.tsx");
    expect(bestScooters).toContain('slug === "best-scooters-philippines" && isIndexableRecommendation(slug)');
    expect(bestScooters.indexOf('id="comparison"')).toBeLessThan(bestScooters.indexOf('<GuideInContentAd nonceReady='));
    expect(read("app/layout.tsx")).not.toContain("<AdSense/>");
  });

  it("routes all supported HTML through Cloudflare Worker and not static edge assets", () => {
    const worker = JSON.parse(read("wrangler.jsonc")).assets.run_worker_first;
    const publisher = read("scripts/publish-prerender-assets.mjs");
    const config = read("next.config.mjs");
    const matcher = read("middleware.ts");
    for (const path of adRoutes.filter(path => path !== "/motorcycles/scooters")) {
      expect(worker).toContain(path);
      expect(publisher).toContain('route === "' + path + '"');
    }
    expect(worker).toContain("/motorcycles/*");
    expect(publisher).toContain('route.startsWith("/motorcycles/")');
    expect(matcher).toContain('"/tires", "/gear/helmets", "/research/motorcycle-price-index-philippines"');
    for (const fragment of [
      "tires(?:/$|$)", "gear/helmets(?:/$|$)",
      "research/motorcycle-price-index-philippines(?:/$|$)",
      "recommendations/best-scooters-philippines(?:/$|$)",
    ]) expect(config).toContain(fragment);
    const workerQa = read("scripts/issue466-adsense-worker-qa.mjs");
    for (const path of adRoutes) {
      expect(workerQa).toContain('"' + path + '"');
      expect(workerQa).toContain('"' + path + '?source=motoindex-qa-synthetic"');
    }
    expect(workerQa).toContain("Query document missing SEO noindex");
    // The Next global CSP must stay on nested paths. A broad exemption here
    // silently strips browser restrictions because middleware only handles
    // the five exact parent documents, not nested tire/helmet routes.
    const pattern = config.match(/source: adDocumentsEnabled \\? "([^"]+)"/)?.[1];
    expect(pattern).toBeTruthy();
    const globalCspPath = new RegExp("^" + pattern + "$");
    for (const path of adRoutes) expect(globalCspPath.test(path)).toBe(false);
    for (const path of [
      "/tires/honda-beat-tire-size", "/gear/helmets/finder",
      "/gear/helmets/compare", "/gear/helmets/full-face",
      "/research/motorcycle-price-index-philippines/extra",
      "/recommendations/best-scooters-philippines/private",
      "/garage",
    ]) expect(globalCspPath.test(path)).toBe(true);

    const smoke = read("scripts/smoke-public-core.mjs");
    for (const path of adRoutes) expect(smoke).toContain('"' + path + '"');
    expect(smoke).toContain("editorial ad page missing approved slot");
  });
});

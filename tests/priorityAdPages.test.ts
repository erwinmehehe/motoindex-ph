import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { isAdSensePriorityDocument, isAdSensePublicDocument } from "../lib/adsenseGuideCsp";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
afterEach(() => vi.unstubAllEnvs());

describe("top-traffic manual AdSense pages", () => {
  const routes = ["/", "/finder", "/tools/motorcycle-loan-calculator"];

  it("allowlists only the requested new anonymous documents", () => {
    for (const path of routes) {
      expect(isAdSensePriorityDocument(path)).toBe(true);
      expect(isAdSensePublicDocument(path)).toBe(true);
    }
    for (const path of ["/tools", "/tools/motorcycle-insurance-calculator", "/finder/private",
      "/my", "/garage", "/quote-status/secret", "/dealer-portal", "/api/leads", "/admin",
      "/tools/motorcycle-loan-calculator/private", "/finder?email=secret"]) {
      expect(isAdSensePriorityDocument(path)).toBe(false);
    }
  });

  it("requires independent approval and fresh direct-HTML nonces", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "false");
    expect((await middleware(new NextRequest("https://motoindexph.com/finder")))
      .headers.get("x-middleware-request-x-nonce")).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const path of routes) {
      const request = () => new NextRequest("https://motoindexph.com" + path);
      const first = await middleware(request()), second = await middleware(request());
      const policy = first.headers.get("Content-Security-Policy") || "";
      const nonce = first.headers.get("x-middleware-request-x-nonce");
      expect(nonce).toBeTruthy();
      expect(policy).toContain("'strict-dynamic'");
      expect(policy).toContain("'nonce-" + nonce + "'");
      expect(first.headers.get("Cache-Control")).toContain("no-store");
      expect(first.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(policy).not.toBe(second.headers.get("Content-Security-Policy"));
    }
  });

  it("blocks ad CSP for query, RSC, prefetch and private routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const path of ["/?utm_source=synthetic", "/finder?budget=100000",
      "/tools/motorcycle-loan-calculator?model=synthetic-private"]) {
      const res = await middleware(new NextRequest("https://motoindexph.com" + path));
      expect(res.headers.get("x-middleware-request-x-nonce")).toBeNull();
      expect(res.headers.get("Content-Security-Policy")).toContain("script-src 'self'");
      expect(res.headers.get("Content-Security-Policy")).not.toContain("'strict-dynamic'");
      expect(res.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex, follow");
    }
    for (const header of ["rsc", "next-router-prefetch"]) {
      const res = await middleware(new NextRequest("https://motoindexph.com/finder", { headers: { [header]: "1" } }));
      expect(res.headers.get("x-middleware-request-x-nonce")).toBeNull();
      expect(res.headers.get("Content-Security-Policy")).toContain("script-src 'self'");
    }
    const privateDoc = await middleware(new NextRequest("https://motoindexph.com/garage"));
    expect(privateDoc.headers.get("Content-Security-Policy")).not.toContain("'strict-dynamic'");
  });

  it("renders manual ads after content and preserves shareable clean-URL interactions", () => {
    const home = read("app/page.tsx"), finder = read("app/finder/page.tsx");
    const loan = read("app/tools/motorcycle-loan-calculator/page.tsx");
    for (const page of [home, finder, loan]) {
      expect(page).toContain("<AdSense nonce={adNonce} />");
      expect(page).toContain("nonceReady={Boolean(adNonce)}");
      expect(page).not.toContain('dynamic = "force-static"');
    }
    expect((home.match(/<GuideInContentAd nonceReady=/g) || []).length).toBe(1);
    expect((finder.match(/<GuideInContentAd nonceReady=/g) || []).length).toBe(1);
    expect((loan.match(/<GuideInContentAd nonceReady=/g) || []).length).toBe(2);
    expect(finder.indexOf("<FinderClient")).toBeLessThan(finder.indexOf("<GuideInContentAd"));
    expect(loan.indexOf("<LoanCalculator")).toBeLessThan(loan.indexOf("<GuideInContentAd"));
    expect(finder).toContain("syncUrl={!adsenseEnabled()}");
    expect(loan).toContain("syncUrl={!adsenseEnabled()}");
    expect(read("components/MotorcycleFinder.tsx")).toContain("if (!syncUrl) return;");
    expect(read("components/LoanCalculator.tsx")).toContain("if (!syncUrl) return;");
    expect(read("components/MotorcycleFinder.tsx")).toContain("sharedUrl.search = shareQuery");
    expect(read("components/LoanCalculator.tsx")).toContain("url.search=shareQuery");
    expect(read("app/layout.tsx")).not.toContain("<AdSense/>");
  });

  it("uses Cloudflare Worker and not static HTML when ads are enabled", () => {
    const wrangler = JSON.parse(read("wrangler.jsonc"));
    for (const path of routes) expect(wrangler.assets.run_worker_first).toContain(path);
    const publisher = read("scripts/publish-prerender-assets.mjs");
    for (const path of routes) expect(publisher).toContain('route === "' + path + '"');
    expect(publisher).toContain('...(!adDocumentsEnabled ? ["/"] : [])');
    expect(read("next.config.mjs")).toContain("finder(?:/|$)|tools/motorcycle-loan-calculator(?:/|$)|$");
    expect(read("middleware.ts")).toContain('"/", "/finder", "/tools/motorcycle-loan-calculator"');
  });
});

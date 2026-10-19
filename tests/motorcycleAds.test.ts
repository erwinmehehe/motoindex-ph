import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import {
  isAdSenseMotorcycleDocument,
  isAdSensePublicDocument,
  nonAdvertisingMotorcycleCsp,
} from "../lib/adsenseGuideCsp";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
afterEach(() => vi.unstubAllEnvs());

describe("motorcycle page AdSense expansion with per-document CSP", () => {
  it("allows public directory, brand, model, electric and family documents", () => {
    for (const path of [
      "/motorcycles",
      "/motorcycles/",
      "/motorcycles/yamaha",
      "/motorcycles/honda/",
      "/motorcycles/yamaha/aerox-v3",
      "/motorcycles/yamaha/aerox",
      "/motorcycles/electric/vinfast-evo",
    ]) {
      expect(isAdSenseMotorcycleDocument(path)).toBe(true);
      expect(isAdSensePublicDocument(path)).toBe(true);
    }
    expect(isAdSensePublicDocument("/guides/motorcycle-helmet-size-guide")).toBe(true);
  });

  it("never advertises on private, non-model, derivative or malformed URLs", () => {
    for (const path of [
      "/", "/my", "/garage", "/dealer-portal", "/quote-status/private",
      "/dealer-lead/private", "/api/leads", "/admin",
      "/motorcycles/electric", "/motorcycles/scooters", "/motorcycles/loan",
      "/motorcycles/expressway-legal", "/motorcycles/yamaha/dealers",
      "/motorcycles/yamaha/scooters", "/motorcycles/electric/range-comparison",
      "/motorcycles/yamaha/aerox-v3/colors",
      "/motorcycles/yamaha/aerox-v3/specs",
      "/motorcycles/yamaha/aerox-v3/used-value",
      "/motorcycles/../garage", "/motorcycles//yamaha", "/motorcycles/honda?email=private",
    ]) expect(isAdSenseMotorcycleDocument(path)).toBe(false);
  });

  it("creates separate middleware nonces for approved public HTML requests", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "true");

    for (const path of ["/motorcycles", "/motorcycles/yamaha", "/motorcycles/yamaha/aerox-v3"]) {
      const req = () => new NextRequest("https://motoindexph.com" + path);
      const a = await middleware(req()), b = await middleware(req());
      const csp = a.headers.get("Content-Security-Policy") || "";
      const nonce = a.headers.get("x-middleware-request-x-nonce") || "";
      expect(csp).toContain("'strict-dynamic'");
      expect(csp).toContain("'nonce-" + nonce + "'");
      expect(a.headers.get("Cache-Control")).toContain("no-store");
      expect(a.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(csp).not.toBe(b.headers.get("Content-Security-Policy"));
    }
  });

  it("gates AdSense off, and prevents RSC/prefetch and user-query leaks", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "false");
    expect((await middleware(new NextRequest("https://motoindexph.com/motorcycles/yamaha"))).headers.get("x-middleware-request-x-nonce")).toBeNull();

    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const path of [
      "/motorcycles?q=private-search",
      "/motorcycles/yamaha/aerox-v3?email=motoindex-synthetic@example.com",
      "/motorcycles/yamaha/dealers",
    ]) {
      const res = await middleware(new NextRequest("https://motoindexph.com" + path));
      const csp = res.headers.get("Content-Security-Policy") || "";
      expect(csp).toContain("script-src 'self'");
      expect(csp).not.toContain("'strict-dynamic'");
      expect(res.headers.get("x-middleware-request-x-nonce")).toBeNull();
    }
    for (const header of ["rsc", "next-router-prefetch"]) {
      const res = await middleware(new NextRequest("https://motoindexph.com/motorcycles/yamaha/aerox-v3", { headers: { [header]: "1" } }));
      expect(res.headers.get("x-middleware-request-x-nonce")).toBeNull();
    }
    expect(nonAdvertisingMotorcycleCsp()).not.toContain("googlesyndication");
  });

  it("preserves existing guarded account routes in ads-only mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "true");
    for (const path of ["/garage", "/dealer-portal", "/quote-status/synthetic", "/api/leads"]) {
      const r = await middleware(new NextRequest("https://motoindexph.com" + path));
      expect(r.status).toBe(503);
      expect(r.headers.get("Content-Security-Policy")).toContain("frame-src 'none'");
      expect(r.headers.get("Content-Security-Policy")).not.toContain("'strict-dynamic'");
      expect(r.headers.get("Referrer-Policy")).toBe("no-referrer");
    }
  });

  it("requires a single approved loader per model document and visible manual placements", () => {
    const model = read("app/motorcycles/[make]/[slug]/page.tsx");
    const brand = read("app/motorcycles/[make]/page.tsx");
    const directory = read("app/motorcycles/page.tsx");
    const entity = read("components/MotorcycleEntityPage.tsx");
    const family = read("components/ModelFamilyView.tsx");
    const electric = read("components/ElectricMotorcycleDetail.tsx");
    const wrapper = read("components/MotorcycleInContentAd.tsx");
    const provider = read("components/GuideInContentAd.tsx");
    const loader = read("components/AdSense.tsx");
    const document = read("lib/adsenseMotorcycleDocument.ts");
    const boundary = read("components/AdSenseNavigationSafety.tsx");
    const config = read("next.config.mjs");
    const wrangler = JSON.parse(read("wrangler.jsonc"));
    const assets = read("scripts/publish-prerender-assets.mjs");

    expect(model).toContain("<AdSense nonce={adNonce} />");
    expect(model).toContain("nonceReady={Boolean(adNonce)}");
    expect(brand).toContain("<AdSense nonce={adNonce} />");
    expect(directory).toContain("<AdSense nonce={adNonce} />");
    expect(directory).not.toContain('dynamic = "force-static"');
    expect(entity).toContain("<MotorcycleInContentAd nonceReady={nonceReady} />");
    expect(family).toContain("<MotorcycleInContentAd nonceReady={nonceReady} />");
    expect(electric).toContain("<MotorcycleInContentAd nonceReady={nonceReady} />");
    expect(wrapper).toContain("<GuideInContentAd nonceReady={nonceReady} />");
    expect(provider).toContain('const AD_SLOT = "6431580274"');
    expect(loader).toContain('strategy="afterInteractive"');
    expect(document).toContain("await connection()");
    expect(document).toContain('get("x-nonce")');
    expect(boundary).toContain("isAdSensePublicDocument");
    expect(config).toContain('"/((?!guides/|motorcycles).*)"');
    expect(wrangler.assets.run_worker_first).toContain("/motorcycles");
    expect(wrangler.assets.run_worker_first).toContain("/motorcycles/*");
    expect(assets).toContain('route === "/motorcycles" || route.startsWith("/motorcycles/")');
    expect(read("app/layout.tsx")).not.toContain("<AdSense/>");
  });
});

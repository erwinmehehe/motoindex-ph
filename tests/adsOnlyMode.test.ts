import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { adsOnlyModeEnabled, adsOnlyDisablesRequest } from "../lib/adsOnlyMode";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
afterEach(() => vi.unstubAllEnvs());

describe("MotoIndex ads-only / no-database release", () => {
  it("stays opt-in and never blocks the public research routes", () => {
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "");
    expect(adsOnlyModeEnabled()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "true");
    expect(adsOnlyModeEnabled()).toBe(true);
    for (const path of ["/", "/guides", "/guides/motorcycle-helmet-size-guide", "/motorcycles/yamaha/aerox-v3", "/api/catalog", "/api/models", "/api/search-index", "/ads.txt"]) {
      expect(adsOnlyDisablesRequest(path, "GET")).toBe(false);
    }
  });

  it("denies private and account pages, disabled APIs, and every mutation", () => {
    for (const path of [
      "/admin", "/admin/used-listings", "/api/ingestion/stage", "/api/cron/price-alerts",
      "/garage", "/garage/sign-in/verify/synthetic", "/my", "/dealer-portal",
      "/quote-status/synthetic", "/dealer-lead/synthetic", "/price-alerts",
      "/get-quote/honda/click-160", "/dealers/join", "/used-motorcycles/listing/synthetic",
      "/api/garage/account", "/api/leads", "/api/dealer-partners", "/api/owner-reviews/public",
    ]) expect(adsOnlyDisablesRequest(path, "GET")).toBe(true);

    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      expect(adsOnlyDisablesRequest("/api/catalog", method)).toBe(true);
      expect(adsOnlyDisablesRequest("/guides/motorcycle-helmet-size-guide", method)).toBe(true);
    }
    expect(adsOnlyDisablesRequest("/guides/motorcycle-helmet-size-guide", "HEAD")).toBe(false);
  });

  it("returns private no-store/noindex/CSP and 503 without accessing PostgreSQL", async () => {
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "true");
    for (const path of ["/garage", "/api/leads", "/dealer-portal", "/quote-status/synthetic"]) {
      const res = await middleware(new NextRequest("https://motoindexph.com" + path));
      expect(res.status).toBe(503);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      expect(res.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(res.headers.get("X-Robots-Tag")).toContain("noindex");
      expect(res.headers.get("Content-Security-Policy")).toContain("frame-src 'none'");
      expect(res.headers.get("Content-Security-Policy")).not.toContain("googlesyndication.com");
    }
    const post = await middleware(new NextRequest("https://motoindexph.com/api/leads", { method: "POST" }));
    expect(post.status).toBe(503);
  });

  it("still permits a nonce-based public AdSense guide when explicitly approved", async () => {
    vi.stubEnv("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    const res = await middleware(new NextRequest("https://motoindexph.com/guides/motorcycle-helmet-size-guide"));
    expect(res.headers.get("Content-Security-Policy")).toContain("'strict-dynamic'");
    expect(res.headers.get("Content-Security-Policy")).toContain("'nonce-");
  });

  it("keeps full release secrets mandatory but allows an isolated ads-only choice", () => {
    const workflow = read(".github/workflows/cloudflare-production-deploy.yml");
    const launch = read("scripts/check-launch.mjs");
    const runtime = read(".github/workflows/cloudflare-runtime-compat.yml");
    const mw = read("middleware.ts");
    const assetPublisher = read("scripts/publish-prerender-assets.mjs");
    expect(assetPublisher).toContain('process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(assetPublisher).toContain('process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"');
    expect(assetPublisher).toContain('/^\\/guides\\/[a-z0-9-]+\\/?$/.test(route)');
    expect(assetPublisher).toContain('"/my"');
    expect(assetPublisher).toContain('"/dealer-portal"');
    expect(runtime).toContain("node scripts/publish-prerender-assets.mjs");
    expect(workflow).toContain("default: ads-only");
    expect(workflow).toContain("if: inputs.release_mode == 'full'");
    expect(workflow).toContain("environment: production");
    expect(workflow).toContain("node scripts/verify-production-release.mjs");
    expect(workflow).toContain("node scripts/verify-worker-binding-names.mjs");
    expect(workflow).toContain("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE:");
    expect(workflow).toContain("MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED || 'false'");
    expect(launch).toContain('adminAccessMode !== "disabled"');
    expect(launch).toContain("Ads-only deployment requires both owner-approved AdSense build flags");
    expect(runtime).toContain('NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE: "true"');
    expect(mw).toContain('"/api/:path*"');
    expect(mw).toContain('adsOnlyDisablesRequest(pathname, request.method)');
  });
});

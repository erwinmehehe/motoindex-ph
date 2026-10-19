import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { privateDocumentCsp } from "../lib/privateDocumentCsp";
import { readFileSync } from "node:fs";

const privatePages = [
  "/my", "/garage", "/garage/sign-in/verify/synthetic",
  "/dealer-portal", "/dealer-portal/sign-in/verify/synthetic",
  "/quote-status/synthetic-test-link", "/dealer-lead/synthetic-test-link",
  "/price-alerts/confirm/synthetic-test-link",
  "/price-alerts/unsubscribe/synthetic-test-link",
];

describe("issue #466 direct private document protection", () => {
  it("blocks analytics, Plausible, AdSense, frames and external connections in private CSP", () => {
    const csp = privateDocumentCsp();
    for (const directive of [
      "default-src 'self'", "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'", "frame-src 'none'",
      "object-src 'none'", "base-uri 'self'",
    ]) expect(csp).toContain(directive);
    for (const forbidden of [
      "google-analytics.com", "googletagmanager.com",
      "googlesyndication.com", "doubleclick.net", "plausible.io",
      "unsafe-eval", "https: *",
    ]) expect(csp).not.toContain(forbidden);
  });

  for (const path of privatePages) {
    it(`adds no-store, no-referrer, noindex and provider-free CSP to ${path}`, async () => {
      const response = await middleware(new NextRequest("https://motoindexph.com" + path));
      expect(response.headers.get("Cache-Control")).toContain("no-store");
      expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
      expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
      expect(response.headers.get("Content-Security-Policy")).toContain("frame-src 'none'");
      expect(response.headers.get("Content-Security-Policy")).not.toContain("google-analytics");
    });
  }

  it("does not add private CSP to a public editorial guide", async () => {
    const response = await middleware(new NextRequest("https://motoindexph.com/guides/motorcycle-helmet-size-guide"));
    // Next.js applies the shared public CSP later. Middleware must not apply the stricter private policy here.
    expect(response.headers.get("Content-Security-Policy")).toBeNull();
  });

  it("still requires explicit second AdSense signoff in production", () => {
    const config = readFileSync(new URL("../lib/adsense.ts", import.meta.url), "utf8");
    const workflow = readFileSync(new URL("../.github/workflows/cloudflare-production-deploy.yml", import.meta.url), "utf8");
    expect(config).toContain('NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"');
    expect(workflow).toContain("vars.MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED || 'false'");
  });
});

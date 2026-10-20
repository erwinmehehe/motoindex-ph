import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { adsenseGuideCsp, isAdSenseGuideDocument } from "../lib/adsenseGuideCsp";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(new URL("../" + file, import.meta.url), "utf8");

afterEach(() => vi.unstubAllEnvs());

describe("issue #466 public-guide AdSense runtime", () => {
  it("limits advertising to a public editorial document route", () => {
    expect(isAdSenseGuideDocument("/guides/motorcycle-helmet-size-guide")).toBe(true);
    for (const pathname of [
      "/", "/guides", "/garage", "/my", "/dealer-portal",
      "/quote-status/synthetic-bearer", "/dealer-lead/synthetic-bearer",
      "/guides/../quote-status/secret", "/guides/secret?email=p@example.com",
    ]) expect(isAdSenseGuideDocument(pathname)).toBe(false);
  });

  it("keeps every guide static/default-CSP when the second release gate is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "false");
    const res = await middleware(new NextRequest("https://motoindexph.com/guides/motorcycle-helmet-size-guide"));
    expect(res.headers.get("Content-Security-Policy")).toBeNull();
  });

  it("provides unique nonce CSP for approved direct editorial HTML only", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    const req = () => new NextRequest("https://motoindexph.com/guides/motorcycle-helmet-size-guide");
    const one = await middleware(req()), two = await middleware(req());
    const csp = one.headers.get("Content-Security-Policy") || "";
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).toContain("'nonce-");
    expect(csp).toContain("frame-src https:");
    expect(csp).not.toContain("quote-status");
    expect(csp).not.toBe(two.headers.get("Content-Security-Policy"));
    expect(one.headers.get("Cache-Control")).toContain("no-store");
    const requestNonce = one.headers.get("x-middleware-request-x-nonce");
    expect(requestNonce).toBeTruthy();
    expect(csp).toContain(`'nonce-${requestNonce}'`);
    expect(adsenseGuideCsp(requestNonce!)).toBe(csp);
  });

  it("never issues an advertising CSP for private routes even when flags are on", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    for (const pathname of [
      "/garage", "/quote-status/synthetic-bearer", "/dealer-lead/synthetic-bearer",
    ]) {
      const res = await middleware(new NextRequest("https://motoindexph.com" + pathname));
      expect(res.headers.get("Content-Security-Policy")).toContain("frame-src 'none'");
      expect(res.headers.get("Content-Security-Policy")).not.toContain("'strict-dynamic'");
      expect(res.headers.get("Cache-Control")).toContain("no-store");
      expect(res.headers.get("Referrer-Policy")).toBe("no-referrer");
    }
  });

  it("loads AdSense from the guide, not root, under a nonce", () => {
    const root = read("app/layout.tsx");
    const guide = read("app/guides/[slug]/page.tsx");
    const loader = read("components/AdSense.tsx");
    const boundary = read("components/AdSenseNavigationSafety.tsx");
    const config = read("next.config.mjs");
    expect(root).not.toContain("<AdSense/>");
    expect(root).toContain("<AdSenseNavigationSafety/>");
    expect(guide).toContain("<AdSense nonce={adNonce} />");
    expect(guide).toContain("await connection()");
    expect(guide).toContain('get("x-nonce")');
    expect(loader).toContain('strategy="afterInteractive"');
    expect(loader).toContain("nonce={nonce}");
    expect(boundary).toContain('document.addEventListener("click", forceDocumentBoundary, true)');
    expect(boundary).toContain("window.location.assign(next.href)");
    expect(config).toContain('"/((?!guides/|motorcycles|finder');
  });
});

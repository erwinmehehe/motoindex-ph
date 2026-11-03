import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// Regression guard: successful Turnstile server tests alone do not prove that
// its iframe and browser script can run under MotoIndex's production CSP.
const nextConfig = readFileSync(new URL("../next.config.mjs", import.meta.url), "utf8");

describe("Turnstile Content Security Policy compatibility", () => {
  it("permits the required Cloudflare script and challenge iframe origins", () => {
    const script = nextConfig.split("\n").find(line => line.includes("script-src ")) || "";
    const frame = nextConfig.split("\n").find(line => line.includes('"frame-src ')) || "";
    expect(script).toContain("https://challenges.cloudflare.com");
    expect(frame).toContain('"frame-src \'self\' https://challenges.cloudflare.com"');
  });

  it("preserves MotoIndex's restrictive frame and script boundaries", () => {
    expect(nextConfig).toContain('"frame-ancestors \'self\'"');
    expect(nextConfig).toContain('"default-src \'self\'"');
    const frame = nextConfig.split("\n").find(line => line.includes('"frame-src ')) || "";
    expect(frame).not.toMatch(/\s\*|https:\s|unsafe-inline/);
    expect(nextConfig).not.toContain("frame-src *");
  });
});

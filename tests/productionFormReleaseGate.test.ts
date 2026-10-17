import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const script = path.resolve("scripts/verify-production-form-configuration.mjs");
const workflow = readFileSync(path.resolve(".github/workflows/cloudflare-production-deploy.yml"), "utf8");

function check(overrides: Record<string, string> = {}) {
  const result = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      PATH: process.env.PATH,
      REQUIRE_FORM_BOT_PROTECTION: "true",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "configured-site-key",
      TURNSTILE_SECRET_KEY: "configured-server-secret",
      ...overrides,
    },
  });
  if (result.error) throw result.error;
  return result;
}

describe("manual production release stops without valid Turnstile configuration", () => {
  it("enforces the production preflight as part of the manual deploy workflow", () => {
    expect(workflow).toContain("run: node scripts/verify-production-form-configuration.mjs");
    expect(workflow).toContain('REQUIRE_FORM_BOT_PROTECTION: "true"');
    expect(workflow).toContain("on:\n  workflow_dispatch:");
  });

  it("allows only a deliberately enabled release with both bindings set", () => {
    const result = check();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("preflight passed");
  });

  it("blocks missing bot enforcement and Turnstile site key", () => {
    const result = check({ REQUIRE_FORM_BOT_PROTECTION: "false", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("REQUIRE_FORM_BOT_PROTECTION");
    expect(result.stderr).toContain("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  });

  it("blocks absent production Turnstile secret without revealing any key", () => {
    const result = check({ TURNSTILE_SECRET_KEY: "" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("TURNSTILE_SECRET_KEY is missing");
  });

  it("rejects documented Cloudflare test keys before any production deploy", () => {
    const result = check({
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Cloudflare test key");
    expect(result.stderr).toContain("Cloudflare test key, not a production secret");
    expect(result.stderr).not.toContain("1x00000000000000000000AA");
  });

  it("never prints credential values", () => {
    const secret = "DONOTPRINT_SECRET_VALUE";
    const result = check({ TURNSTILE_SECRET_KEY: secret });
    expect(result.status).toBe(0);
    expect(result.stdout + result.stderr).not.toContain(secret);
  });
});

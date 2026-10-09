import { describe, expect, it } from "vitest";
import { missingWorkerBindingNames, REQUIRED_RUNTIME_SECRET_NAMES } from "../scripts/verify-worker-binding-names.mjs";

describe("Cloudflare Worker release secret bindings", () => {
  it("accepts the complete required Worker secret set", () => {
    const supplied = REQUIRED_RUNTIME_SECRET_NAMES.map(name => ({ name, type: "secret_text" }));
    expect(missingWorkerBindingNames(supplied)).toEqual([]);
  });

  it("reports missing backend and admin secrets without printing values", () => {
    expect(missingWorkerBindingNames([{ name: "DATABASE_URL" }])).toEqual([
      "TURNSTILE_SECRET_KEY",
      "CF_ACCESS_TEAM_DOMAIN",
      "CF_ACCESS_AUD",
      "ADMIN_ACCESS_EMAILS",
    ]);
  });

  it("refuses malformed response formats", () => {
    expect(() => missingWorkerBindingNames({ secrets: [] })).toThrow("array");
  });
});

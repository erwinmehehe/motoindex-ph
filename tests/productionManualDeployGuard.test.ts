import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowDir = new URL("../.github/workflows/", import.meta.url);

describe("production Cloudflare deployment entrypoints", () => {
  it("does not restore the old auto-deploy-on-main-push workflow", () => {
    expect(existsSync(new URL("deploy-cloudflare-workers.yml", workflowDir))).toBe(false);
  });

  it("keeps the remaining production deploy workflow manual-only", () => {
    const release = readFileSync(new URL("cloudflare-production-deploy.yml", workflowDir), "utf8");
    expect(release).toMatch(/^on:\s*\n\s+workflow_dispatch:\s*$/m);
    expect(release).not.toMatch(/^\s{2}(push|pull_request|pull_request_target|schedule|workflow_run):/m);
  });
});

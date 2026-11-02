import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowDir = new URL("../.github/workflows/", import.meta.url);

describe("production Cloudflare deployment entrypoints", () => {
  it("does not restore the old auto-deploy-on-main-push workflow", () => {
    expect(existsSync(new URL("deploy-cloudflare-workers.yml", workflowDir))).toBe(false);
  });

  it("allows only manual release or a successful protected-main QA completion", () => {
    const release = readFileSync(new URL("cloudflare-production-deploy.yml", workflowDir), "utf8");
    expect(release).toContain("  workflow_dispatch:");
    expect(release).toContain("  workflow_run:");
    expect(release).toContain("      - Visual QA");
    expect(release).toContain("    types: [completed]");
    expect(release).not.toMatch(/^\s{2}(push|pull_request|pull_request_target|schedule):/m);
    for (const requiredGuard of [
      "github.event.workflow_run.event == 'push'",
      "github.event.workflow_run.conclusion == 'success'",
      "github.event.workflow_run.head_branch == 'main'",
      "github.event.workflow_run.head_sha == github.sha",
      "github.event.workflow_run.head_repository.full_name == github.repository",
      "github.ref == 'refs/heads/main'",
    ]) expect(release).toContain(requiredGuard);
    expect(release).toContain("if: github.event_name == 'workflow_dispatch' && inputs.release_mode == 'full'");
    expect(release).toContain("NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE:");
    expect(release).toContain("ADMIN_ACCESS_MODE:");
    expect(release).toContain("environment: production");
    expect(release).toContain("node scripts/verify-production-release.mjs");
  });
});

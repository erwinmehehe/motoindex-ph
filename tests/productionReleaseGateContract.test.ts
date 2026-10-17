import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow=readFileSync(new URL("../.github/workflows/cloudflare-production-deploy.yml",import.meta.url),"utf8");
const release=readFileSync(new URL("../scripts/verify-production-release.mjs",import.meta.url),"utf8");

describe("MotoIndex fail-closed production release workflow",()=>{
  it("runs only by manual dispatch on main with a production environment gate",()=>{
    expect(workflow).toMatch(/^on:\s*\n\s+workflow_dispatch:\s*$/m);
    expect(workflow).not.toMatch(/^\s{2}(push|pull_request|pull_request_target|schedule|workflow_run):/m);
    expect(workflow).toContain("if: github.ref == 'refs/heads/main'");
    expect(workflow).toContain("environment: production");
  });
  it("checks the repository and runtime secrets before deploying and rechecks after build",()=>{
    const first=workflow.indexOf("node scripts/verify-production-release.mjs");
    const secrets=workflow.indexOf("node scripts/verify-worker-binding-names.mjs");
    const build=workflow.indexOf("run: npm run cf:build");
    const second=workflow.indexOf("node scripts/verify-production-release.mjs",first+1);
    const deploy=workflow.indexOf("run: npm run cf:deploy:built");
    expect(first).toBeGreaterThan(0);
    expect(secrets).toBeGreaterThan(first);
    expect(build).toBeGreaterThan(secrets);
    expect(second).toBeGreaterThan(build);
    expect(deploy).toBeGreaterThan(second);
    expect(workflow).toContain("npx wrangler secret list --format json");
  });
  it("requires exact current-main SHA, protection and successful push checks",()=>{
    expect(release).toContain('ref !== "refs/heads/main"');
    expect(release).toContain("branch.commit?.sha !== sha");
    expect(release).toContain("branch.protected !== true");
    expect(release).toContain('"CI", "Visual QA", "Cloudflare Runtime Compatibility"');
    expect(release).toContain("run.head_sha === sha");
    expect(release).toContain('run.event === "push"');
    expect(release).toContain('run.conclusion !== "success"');
    expect(release).toContain("process.exitCode = 1");
  });
});

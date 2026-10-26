import { describe, expect, it } from "vitest";
import { classifyBuildLog, planCloudflareBuildChanges, safePreviewCommand } from "../scripts/reconcile-cloudflare-builds.mjs";

const production = {
  trigger_uuid: "11111111-1111-1111-1111-111111111111",
  trigger_name: "Deploy production",
  branch_includes: ["main"],
  branch_excludes: [],
  build_command: "npm run build",
  deploy_command: "npx wrangler deploy",
  repo_name: "motoindex-ph"
};
const preview = {
  trigger_uuid: "22222222-2222-2222-2222-222222222222",
  trigger_name: "Deploy preview branches",
  branch_includes: ["*"],
  branch_excludes: ["main"],
  build_command: "npm run build",
  deploy_command: "npx wrangler versions upload",
  repo_name: "motoindex-ph"
};

describe("Cloudflare Builds stays connected with safe preview triggers", () => {
  it("prevents main Git Builds from publishing while preserving a preview trigger", () => {
    const plan = planCloudflareBuildChanges([production, preview]);
    expect(plan[0].patch).toEqual({
      branch_excludes: ["main"],
      deploy_command: "npx wrangler versions upload"
    });
    expect(plan[1].patch).toEqual({ build_command: "npm run cf:build" });
    expect(production.branch_excludes).toEqual([]); // no mutation
  });

  it("remains idempotent after the trigger settings are applied", () => {
    const alreadyApplied = [
      { ...production, branch_excludes: ["main"], deploy_command: "npx wrangler versions upload" },
      { ...preview, build_command: "npm run cf:build" }
    ];
    expect(planCloudflareBuildChanges(alreadyApplied).every(entry =>
      Object.keys(entry.patch).length === 0
    )).toBe(true);
  });

  it("preserves legacy and modern non-promoting previews", () => {
    expect(safePreviewCommand("npx wrangler versions upload")).toBe(true);
    expect(safePreviewCommand("npx wrangler preview")).toBe(true);
    expect(safePreviewCommand("npx wrangler deploy")).toBe(false);
    expect(safePreviewCommand("npx wrangler preview && npx wrangler deploy")).toBe(false);
    expect(() => planCloudflareBuildChanges([
      production, {...preview, deploy_command:"npx wrangler deploy"}
    ])).toThrow(/Unexpected preview deploy/);
  });

  it("fails closed on missing triggers or an unexpected repository", () => {
    expect(() => planCloudflareBuildChanges([preview])).toThrow(/Expected one main/);
    expect(() => planCloudflareBuildChanges([
      {...production, repo_name:"another-repo"}, preview
    ])).toThrow(/Unexpected GitHub repo/);
    expect(() => planCloudflareBuildChanges([
      {...production, repo_connection:{provider_type:"gitlab", repo_name:"motoindex-ph"}}, preview
    ])).toThrow(/Unexpected Git provider/);
    expect(() => planCloudflareBuildChanges([
      {...production, repo_connection:{provider_type:"github", repo_name:"motoindex-ph", repo_connection_uuid:"prod"}},
      {...preview, repo_connection:{provider_type:"github", repo_name:"motoindex-ph", repo_connection_uuid:"preview"}}
    ])).toThrow(/different Git connections/);
  });

  it("classifies failure logs without exposing their contents", () => {
    const messages = classifyBuildLog([[100, "npm error a private value"], [101, "OpenNext file .open-next/worker.js not found"]]);
    expect(messages).toContain("Dependency or lockfile failure");
    expect(messages).toContain("OpenNext output missing");
    expect(messages.join(" ")).not.toContain("private value");
  });
});
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { rejectWorkersGitProductionBuild } from "../scripts/reject-workers-git-production-build.mjs";

const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
const hook=readFileSync(new URL("../scripts/ensure-cloudflare-worker.mjs",import.meta.url),"utf8");

describe("Cloudflare Git production build block",()=>{
  it("refuses Git-connected main builds",()=>{
    expect(()=>rejectWorkersGitProductionBuild({WORKERS_CI:"1",WORKERS_CI_BRANCH:"main"})).toThrow(/blocks Cloudflare Workers Builds/);
    expect(()=>rejectWorkersGitProductionBuild({WORKERS_CI:"true",WORKERS_CI_BRANCH:"refs/heads/main"})).toThrow(/blocks Cloudflare Workers Builds/);
  });
  it("fails closed when the Cloudflare Git branch is unknown",()=>{
    expect(()=>rejectWorkersGitProductionBuild({WORKERS_CI:"1"})).toThrow(/unknown Git branches/);
  });
  it("allows preview branches and manually reviewed non-Cloudflare builds",()=>{
    expect(()=>rejectWorkersGitProductionBuild({WORKERS_CI:"1",WORKERS_CI_BRANCH:"seo/review"})).not.toThrow();
    expect(()=>rejectWorkersGitProductionBuild({GITHUB_ACTIONS:"true",GITHUB_REF:"refs/heads/main"})).not.toThrow();
    expect(()=>rejectWorkersGitProductionBuild({WORKERS_CI:"0",WORKERS_CI_BRANCH:"main"})).not.toThrow();
  });
  it("guards default npm build, explicit OpenNext build, and Wrangler custom build",()=>{
    expect(pkg.scripts.prebuild).toContain("node scripts/reject-workers-git-production-build.mjs");
    expect(pkg.scripts["precf:build"]).toContain("node scripts/reject-workers-git-production-build.mjs");
    expect(hook).toContain('import { rejectWorkersGitProductionBuild } from "./reject-workers-git-production-build.mjs"');
    expect(hook.indexOf("rejectWorkersGitProductionBuild();")).toBeGreaterThan(0);
    expect(hook.indexOf("rejectWorkersGitProductionBuild();")).toBeLessThan(hook.indexOf("if (isWorkerReady())"));
  });
});

import fs from "node:fs";
import path from "node:path";

const commit = process.env.WORKERS_CI_COMMIT_SHA || process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || process.env.SOURCE_VERSION || "unknown";
const branch = process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || process.env.GITHUB_REF_NAME || "unknown";
const provider = process.env.WORKERS_CI ? "cloudflare-workers-builds" : process.env.CF_PAGES ? "cloudflare-pages" : process.env.GITHUB_ACTIONS ? "github-actions" : "local";
const payload = {
  service: "motoindex-ph",
  provider,
  branch,
  commit,
  builtAt: new Date().toISOString(),
  releaseMarker: "2026-09-hardening-v1"
};

const out = path.join(process.cwd(), "public", "deployment-info.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), out)} for ${provider} ${branch} ${commit.slice(0, 12)}`);

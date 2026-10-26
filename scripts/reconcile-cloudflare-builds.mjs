#!/usr/bin/env node
// Stable Cloudflare Workers Builds triggers for MotoIndex.
// No repository disconnect, Worker deployment, or secret mutation.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const NAME = "motoindex-ph";
const MAIN = "main";
const BUILD = "npm run cf:build";
const SAFE_PRODUCTION = "npx wrangler versions upload";

const includes = (items, value) => Array.isArray(items) && items.includes(value);
const identical = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || []);

export function safePreviewCommand(command) {
  const s = String(command || "").trim();
  return /^(?:npx\s+)?wrangler\s+(?:preview|versions\s+upload)(?:\s|$)/.test(s) ||
    /^(?:npx\s+)?opennextjs-cloudflare\s+upload(?:\s|$)/.test(s);
}

export function planCloudflareBuildChanges(triggers) {
  if (!Array.isArray(triggers)) throw new Error("Invalid trigger list.");
  const production = triggers.filter(t => includes(t.branch_includes, MAIN));
  const previews = triggers.filter(t =>
    !includes(t.branch_includes, MAIN) &&
    includes(t.branch_excludes, MAIN) &&
    (includes(t.branch_includes, "*") || /preview/i.test(t.trigger_name || ""))
  );
  if (triggers.length !== 2 || production.length !== 1 || previews.length !== 1) {
    throw new Error("Expected one main trigger and one preview trigger; refusing to recreate or disconnect anything.");
  }
  for (const item of [production[0], previews[0]]) {
    if (!/^[a-f0-9-]{36}$/i.test(String(item.trigger_uuid || ""))) throw new Error("Invalid trigger ID.");
    const connectedRepo = item.repo_connection?.repo_name || item.repo_name;
    if (connectedRepo && connectedRepo !== NAME) throw new Error("Unexpected GitHub repo; no changes made.");
  }
  if (!safePreviewCommand(previews[0].deploy_command)) {
    throw new Error("Unexpected preview deploy command; inspect it before applying.");
  }
  const prod = production[0];
  const excludeMain = [...new Set([...(prod.branch_excludes || []), MAIN])];
  const prodPatch = {};
  if (!identical(prod.branch_excludes, excludeMain)) prodPatch.branch_excludes = excludeMain;
  if (prod.deploy_command !== SAFE_PRODUCTION) prodPatch.deploy_command = SAFE_PRODUCTION;
  const preview = previews[0];
  const previewPatch = preview.build_command === BUILD ? {} : {build_command: BUILD};
  // Do not silently migrate legacy previews to the irreversible Worker Previews model.
  return [
    {role:"production", uuid:prod.trigger_uuid, before:prod, patch:prodPatch},
    {role:"preview", uuid:preview.trigger_uuid, before:preview, patch:previewPatch}
  ];
}

export function classifyBuildLog(lines) {
  const body = lines.map(line => Array.isArray(line) ? line.slice(1).join(" ") : String(line)).join("\n");
  const rules = [
    ["Production branch intentionally blocked", /blocks Cloudflare Workers Builds/i],
    ["OpenNext output missing", /(?:not found|missing).*\.open-next\/worker\.js|\.open-next\/worker\.js.*(?:not found|missing)/i],
    ["Dependency or lockfile failure", /npm ERR|npm error|lockfile|npm ci can only install/i],
    ["Build timeout or memory exhaustion", /out of memory|heap out of memory|timed out|killed/i],
    ["Credentials or permissions", /unauthorized|authentication failed|permission denied|invalid api token/i],
    ["OpenNext adapter failure", /OpenNext.*(?:error|failed)|opennextjs-cloudflare.*(?:error|failed)/i]
  ];
  return rules.filter(([,regex])=>regex.test(body)).map(([name])=>name);
}

async function execute() {
  const operation = process.argv[2] || "inspect";
  const buildId = process.argv[3] || "";
  if (!["inspect","apply"].includes(operation)) throw new Error("Choose inspect or apply.");
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_WORKERS_CI_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !token) throw new Error("A Cloudflare account ID and Workers CI Read/Write token are required.");
  if (operation === "apply") {
    if (process.env.MOTOINDEX_CLOUDFLARE_APPLY !== "KEEP_GITHUB_CONNECTED") {
      throw new Error("Explicit KEEP_GITHUB_CONNECTED confirmation required.");
    }
    if (process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REF !== "refs/heads/main") {
      throw new Error("Cloudflare settings may only be applied by the reviewed main workflow.");
    }
  }
  const request = async (endpoint, method = "GET", payload) => {
    const response = await fetch("https://api.cloudflare.com/client/v4/accounts/" +
      encodeURIComponent(account) + endpoint, {
      method,
      headers: {Authorization: "Bearer " + token, "Content-Type":"application/json"},
      ...(payload ? {body: JSON.stringify(payload)} : {})
    });
    const data = await response.json().catch(()=>({}));
    if (!response.ok || data.success === false) {
      throw new Error("Cloudflare API " + method + " failed (" +
        (data.errors?.[0]?.code || response.status) +
        "). Check Workers CI Read/Write permissions; no Git connection was changed.");
    }
    return data.result;
  };

  if (buildId) {
    if (!/^[a-f0-9-]{36}$/i.test(buildId)) throw new Error("Invalid build UUID.");
    const build = await request("/builds/builds/" + buildId);
    const metadata = build?.build_trigger_metadata || {};
    console.log("Build metadata:", JSON.stringify({
      outcome:build?.build_outcome, branch:metadata.branch,
      buildCommand:metadata.build_command, deployCommand:metadata.deploy_command
    }));
    const log = await request("/builds/builds/" + buildId + "/logs");
    console.log("Sanitized build diagnosis:", JSON.stringify({
      linesRead:log?.lines?.length || 0, truncated:Boolean(log?.truncated),
      categories:classifyBuildLog(log?.lines || [])
    }));
    // Intentionally never print raw Cloudflare logs: they can contain secrets.
  }

  const workersResult = await request("/workers/scripts");
  const workers = Array.isArray(workersResult) ? workersResult : workersResult?.items || [];
  const worker = workers.find(item => item.id === NAME);
  if (!worker?.tag) throw new Error("MotoIndex Worker tag could not be verified.");
  const triggerPath = "/builds/workers/" + encodeURIComponent(worker.tag) + "/triggers";
  const plan = planCloudflareBuildChanges(await request(triggerPath));
  for (const item of plan) {
    console.log(item.role + " trigger:", JSON.stringify({
      id:item.uuid, branchIncludes:item.before.branch_includes,
      branchExcludes:item.before.branch_excludes,
      build:item.before.build_command, deploy:item.before.deploy_command,
      proposedPatch:item.patch
    }));
  }
  if (operation === "inspect") return console.log("Read-only inspection complete; no changes made.");

  // No DELETE and no repo-connection API calls: keep GitHub linked.
  for (const item of plan) {
    if (!Object.keys(item.patch).length) continue;
    await request("/builds/triggers/" + item.uuid, "PATCH", item.patch);
    console.log("Updated " + item.role + " trigger, leaving GitHub connected.");
  }
  const remaining = planCloudflareBuildChanges(await request(triggerPath));
  if (remaining.some(item=>Object.keys(item.patch).length)) {
    throw new Error("Cloudflare settings did not verify after patch. Inspect before retrying.");
  }
  console.log("Verified OpenNext preview build and non-promoting, main-excluded production trigger.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  execute().catch(error => {
    console.error("Cloudflare Builds reconciliation: " + error.message);
    process.exitCode = 1;
  });
}

/**
 * Fail closed if Cloudflare's independent Git-connected Workers Builds
 * pipeline attempts to build the production branch. The approved production
 * publishing path is the manually reviewed GitHub Actions workflow.
 *
 * This is defense in depth only: Cloudflare's account-level deploy command
 * must still be disabled or changed to an inactive version upload.
 */
export function rejectWorkersGitProductionBuild(env = process.env) {
  const workersCi = String(env.WORKERS_CI ?? "").trim().toLowerCase();
  if (workersCi !== "1" && workersCi !== "true") return;
  const branch = String(env.WORKERS_CI_BRANCH ?? "").trim().replace(/^refs\/heads\//, "");
  if (!branch || branch === "main") {
    throw new Error(
      "MotoIndex blocks Cloudflare Workers Builds on production/unknown Git branches. " +
      "Disable automatic production deploys in the Cloudflare dashboard, " +
      "then use the reviewed manual GitHub Actions production workflow."
    );
  }
}

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  rejectWorkersGitProductionBuild();
}

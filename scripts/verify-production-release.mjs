// Fail-closed production release gate for manually dispatched GitHub Actions deployments.
const repository = process.env.GITHUB_REPOSITORY || "";
const sha = process.env.GITHUB_SHA || "";
const ref = process.env.GITHUB_REF || "";
const token = process.env.GITHUB_TOKEN || "";
const api = (process.env.GITHUB_API_URL || "https://api.github.com").replace(/\/$/, "");
const requiredWorkflows = ["CI", "Visual QA", "Cloudflare Runtime Compatibility"];

async function get(path) {
  const response = await fetch(`${api}${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28"
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`GitHub release check API error (${response.status}) for ${path}`);
  return response.json();
}

async function main() {
  if (ref !== "refs/heads/main") throw new Error("Only main may be deployed to production.");
  if (!/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(repository)) throw new Error("GITHUB_REPOSITORY is invalid.");
  if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error("GITHUB_SHA is invalid.");
  if (!token) throw new Error("GITHUB_TOKEN is missing; release approval cannot be verified.");

  const branch = await get(`/repos/${repository}/branches/main`);
  if (branch.commit?.sha !== sha) throw new Error(`main moved from release SHA ${sha.slice(0, 12)}; restart against current main.`);

  const payload = await get(`/repos/${repository}/actions/runs?branch=main&event=push&per_page=100`);
  const runs = (payload.workflow_runs || [])
    .filter(run => run.head_sha === sha && run.head_branch === "main" && run.event === "push")
    .sort((a, b) => (b.run_number - a.run_number) || (b.run_attempt - a.run_attempt));

  const failures = [];
  for (const name of requiredWorkflows) {
    const run = runs.find(item => item.name === name);
    if (!run) failures.push(`${name}: no successful main-branch push run for ${sha.slice(0, 12)}`);
    else if (run.status !== "completed" || run.conclusion !== "success")
      failures.push(`${name}: ${run.status}/${run.conclusion || "pending"} (${run.html_url})`);
  }
  if (failures.length) throw new Error(`Production checks are not green:\n- ${failures.join("\n- ")}`);
  console.log(`Release gate passed for ${repository}@${sha.slice(0, 12)}: ${requiredWorkflows.join(", ")}.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

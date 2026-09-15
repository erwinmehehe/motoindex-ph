const base = new URL(process.env.BASE_URL || "https://motoindexph.com");
const expectedCommit = (process.env.EXPECTED_COMMIT_SHA || "").trim();
const timeoutMs = Math.max(5000, Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 15000));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const publicRoutes = [
  "/",
  "/motorcycles",
  "/motorcycles/yamaha/aerox-v3",
  "/compare/selection?bikes=aerox-v3,nmax-v3",
  "/recommendations",
  "/recommendations/motorcycles-under-100k",
];

const cloudflareFailurePattern = /error\s*1102|worker exceeded resource limits|error\s*503|service unavailable/i;

async function fetchWithTimeout(path, init = {}) {
  return fetch(new URL(path, base), {
    redirect: "follow",
    headers: {
      "cache-control": "no-cache",
      "user-agent": "MotoIndex production smoke test",
      ...(init.headers || {}),
    },
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function waitForExpectedDeployment() {
  let lastObserved = "unknown";
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      const response = await fetchWithTimeout("/deployment-info.json");
      if (response.ok) {
        const info = await response.json();
        lastObserved = info.commit || "missing";
        if (!expectedCommit || lastObserved === expectedCommit) return info;
      }
    } catch (error) {
      lastObserved = error instanceof Error ? error.message : String(error);
    }
    if (attempt < 8) await wait(7500);
  }
  throw new Error(`Production is not serving the expected commit. Observed ${lastObserved}; expected ${expectedCommit || "any current commit"}.`);
}

const deployment = await waitForExpectedDeployment();
const failures = [];

for (const path of publicRoutes) {
  try {
    const response = await fetchWithTimeout(path);
    const body = await response.text();
    if (response.status !== 200) failures.push(`${path}: expected 200, got ${response.status}`);
    if (cloudflareFailurePattern.test(body)) failures.push(`${path}: response contains a Cloudflare Worker resource/server error`);
    if (!body.trim()) failures.push(`${path}: empty response body`);
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const home = await fetchWithTimeout("/");
  for (const [header, expected] of [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "SAMEORIGIN"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ]) {
    if (home.headers.get(header) !== expected) failures.push(`/: missing or unexpected ${header}`);
  }
  if (!home.headers.get("strict-transport-security")) failures.push("/: missing Strict-Transport-Security");
} catch (error) {
  failures.push(`/: header verification failed: ${error instanceof Error ? error.message : String(error)}`);
}

if (failures.length) {
  console.error("Production public-route smoke test failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Production public-route smoke test passed for ${base.origin} at ${(deployment.commit || expectedCommit || "current").slice(0, 12)}.`);

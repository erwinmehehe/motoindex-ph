const base = new URL(process.env.BASE_URL || "https://motoindexph.com");
const expectedCommit = (process.env.EXPECTED_COMMIT_SHA || "").trim();
const timeoutMs = Number(process.env.PRODUCTION_PAGE_TIMEOUT_MS || 10000);
const concurrency = Math.max(1, Math.min(Number(process.env.PRODUCTION_QA_CONCURRENCY || 4), 8));
const failures = [];
const warnings = [];
const results = [];
const routes = new Set([
  "/", "/motorcycles", "/finder", "/shortlist", "/search?q=Click", "/compare", "/compare/three",
  "/recommendations", "/gear/helmets", "/tires", "/fitment", "/dealers", "/maintenance", "/ownership", "/tools", "/privacy"
]);

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: "follow", headers: { "cache-control": "no-cache", "user-agent": "MotoIndex-All-Pages-QA/1.0", ...(options.headers || {}) }, ...options, signal: controller.signal });
  } finally { clearTimeout(timer); }
}

async function discoverSitemaps() {
  // These are separate URL sets rather than children of a sitemap index, so seed every public sitemap explicitly.
  const queue = ["/sitemap.xml", "/sitemaps/motorcycles.xml", "/sitemaps/gear.xml", "/sitemaps/commerce.xml"];
  const seen = new Set();
  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    let response;
    try { response = await fetchWithTimeout(new URL(current, base)); }
    catch (error) { failures.push(`${current}: sitemap request failed: ${error instanceof Error ? error.message : String(error)}`); continue; }
    if (!response.ok) { failures.push(`${current}: sitemap returned ${response.status}`); continue; }
    const body = await response.text();
    for (const match of body.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      let url;
      try { url = new URL(match[1].trim(), base); }
      catch { failures.push(`${current}: invalid URL ${match[1]}`); continue; }
      const route = `${url.pathname}${url.search}`;
      if (/\.xml$/i.test(url.pathname)) queue.push(route);
      else routes.add(route);
    }
  }
}

function containsRuntimeFailure(text) {
  return /Error\s*1102|Worker exceeded resource limits|Internal Server Error|Application error|Server Error|This page could not be found/i.test(text);
}

async function checkRoute(route) {
  const started = Date.now();
  try {
    const response = await fetchWithTimeout(new URL(route, base));
    const elapsed = Date.now() - started;
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("text/html") ? await response.text() : "";
    results.push({ route, status: response.status, elapsed, finalUrl: response.url, contentType });
    if (response.status !== 200) failures.push(`${route}: expected 200, got ${response.status}`);
    if (response.status >= 500) failures.push(`${route}: production 5xx response`);
    if (body && containsRuntimeFailure(body)) failures.push(`${route}: production runtime/error page detected`);
    if (elapsed > 8000) warnings.push(`${route}: slow production response ${elapsed}ms`);
  } catch (error) {
    results.push({ route, status: 0, elapsed: Date.now() - started, error: error instanceof Error ? error.message : String(error) });
    failures.push(`${route}: production request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runPool(items) {
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      await checkRoute(items[index]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
}

await discoverSitemaps();
const allRoutes = [...routes].sort();
await runPool(allRoutes);

try {
  const deployment = await fetchWithTimeout(new URL("/deployment-info.json", base));
  if (!deployment.ok) {
    const message = `/deployment-info.json returned ${deployment.status}`;
    if (expectedCommit) failures.push(`${message}; cannot verify deployed commit ${expectedCommit}`);
    else warnings.push(message);
  } else {
    const info = await deployment.json();
    if (expectedCommit) {
      if (!info.commit) failures.push(`/deployment-info.json: missing commit; expected ${expectedCommit}`);
      else if (info.commit !== expectedCommit) failures.push(`/deployment-info.json: production serves ${info.commit}, expected ${expectedCommit}`);
    }
  }
} catch (error) {
  const message = `/deployment-info.json could not be checked: ${error instanceof Error ? error.message : String(error)}`;
  if (expectedCommit) failures.push(`${message}; cannot verify deployed commit ${expectedCommit}`);
  else warnings.push(message);
}

console.log(`Production all-pages QA checked ${allRoutes.length} public URLs at ${base.origin}.`);
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (failures.length) {
  console.error(`Production all-pages QA failed with ${failures.length} issue(s):\n- ${failures.slice(0,150).join("\n- ")}${failures.length > 150 ? `\n... ${failures.length - 150} more` : ""}`);
  process.exit(1);
}
console.log("Production all-pages QA passed: every public sitemap URL plus core interactive pages returned clean 200 responses without Cloudflare/runtime error signatures.");

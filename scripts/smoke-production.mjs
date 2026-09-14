const baseRaw = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
if (!baseRaw) { console.error("Set BASE_URL or NEXT_PUBLIC_SITE_URL to the deployed origin."); process.exit(1); }
const base = new URL(baseRaw);
if (base.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(base.hostname)) { console.error("Production smoke tests require HTTPS."); process.exit(1); }

const failures = [];
const requestTimeoutMs = Math.max(1000, Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 10000));

async function request(path, init = {}) {
  try {
    return await fetch(new URL(path, base), {
      redirect: "manual",
      headers: { "cache-control": "no-cache", ...(init.headers || {}) },
      ...init,
      signal: AbortSignal.timeout(requestTimeoutMs)
    });
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function get(path, expected = 200) {
  const response = await request(path);
  if (!response) return null;
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(response.status)) failures.push(`${path}: expected ${allowed.join(" or ")}, got ${response.status}`);
  return response;
}

const expectedCommit = (process.env.EXPECTED_COMMIT_SHA || "").trim();
const deploymentInfo = await get("/deployment-info.json");
if (deploymentInfo) {
  try {
    const info = await deploymentInfo.json();
    if (info.releaseMarker !== "2026-09-hardening-v1") failures.push(`/deployment-info.json has stale releaseMarker ${info.releaseMarker || "missing"}`);
    if (base.hostname === "motoindexph.com" && !["github-actions", "cloudflare-workers-builds"].includes(info.provider)) {
      failures.push(`/deployment-info.json has unexpected build provider ${info.provider || "missing"}`);
    }
    if (expectedCommit && info.commit !== expectedCommit) failures.push(`Cloudflare is serving commit ${info.commit || "unknown"}; expected ${expectedCommit}`);
  } catch {
    failures.push("/deployment-info.json did not return valid JSON");
  }
}

const home = await get("/");
if (home) {
  for (const [header, expected] of [["x-content-type-options", "nosniff"], ["x-frame-options", "SAMEORIGIN"], ["referrer-policy", "strict-origin-when-cross-origin"]]) {
    if (home.headers.get(header) !== expected) failures.push(`/: missing or unexpected ${header} header`);
  }
  if (base.protocol === "https:" && !home.headers.get("strict-transport-security")) failures.push("/: missing Strict-Transport-Security on HTTPS production response");
}

for (const [path, markers] of [
  ["/llms.txt", ["# MotoIndex PH", "Generated from MotoIndex production data", "https://motoindexph.com/motorcycles", "https://motoindexph.com/authors/erwin-valles", "https://motoindexph.com/llms-full.txt"]],
  ["/llms-full.txt", ["# MotoIndex PH", "Generated from MotoIndex production data", "https://motoindexph.com/sitemaps/motorcycles.xml", "https://motoindexph.com/motorcycles/electric", "https://motoindexph.com/methodology"]]
]) {
  const response = await get(path);
  if (!response) continue;
  const body = await response.text();
  for (const marker of markers) if (!body.includes(marker)) failures.push(`${path} missing required marker ${marker}`);
  if (body.includes("https://motoindexph.com/recommendations/motorcycles-under-100k")) failures.push(`${path} still exposes retired per-guide recommendation URLs as canonical resources`);
}

for (const [path, target] of [
  ["/recommendations/motorcycles-under-100k", "/recommendations#budget"],
  ["/recommendations/best-scooters-philippines", "/recommendations#scooters"],
  ["/recommendations/best-motorcycles-for-daily-commute-philippines", "/recommendations#commuting"],
  ["/recommendations/electric-motorcycles-philippines", "/motorcycles/electric#models"],
  ["/get-quote/honda/click-160", "/dealers?brand=Honda"],
  ["/maintenance/motorcycle-battery", "/maintenance#motorcycle-battery"],
  ["/maintenance/change-oil-motorcycle", "/maintenance#change-oil-motorcycle"],
  ["/motorcycles/honda/click-160/used-value", "/motorcycles/honda/click-160#used"],
  ["/motorcycles/electric/vinfast-evo", "/motorcycles/electric#models"],
  ["/motorcycles/electric/vinfast-feliz-ii", "/motorcycles/electric#models"],
  ["/motorcycles/electric/vinfast-viper", "/motorcycles/electric#models"]
]) {
  const response = await get(path, 308);
  if (!response) continue;
  const location = response.headers.get("location") || "";
  if (!location.endsWith(target)) failures.push(`${path}: expected permanent redirect to ${target}, got ${location || "no Location header"}`);
}

let robotsBody = "";
const robots = await get("/robots.txt");
if (robots) {
  robotsBody = await robots.text();
  for (const marker of ["Disallow: /admin/", "Disallow: /api/", "Sitemap:"]) if (!robotsBody.includes(marker)) failures.push(`/robots.txt missing ${marker}`);
}

function isForbiddenIndexedPath(pathname) {
  if (["/price-alerts", "/sellers", "/used-motorcycles"].includes(pathname)) return true;
  for (const prefix of ["/admin/", "/api/", "/get-quote/"]) if (pathname.startsWith(prefix)) return true;
  if (pathname.startsWith("/used-motorcycles/") && !["/used-motorcycles/repo", "/used-motorcycles/buying-checklist"].includes(pathname)) return true;
  if (/^\/motorcycles\/[^/]+\/[^/]+\/(used-value|new-vs-used)\/?$/.test(pathname)) return true;
  return false;
}

for (const path of ["/sitemap.xml", "/sitemaps/motorcycles.xml", "/sitemaps/gear.xml", "/sitemaps/commerce.xml"]) {
  const response = await get(path);
  if (!response) continue;
  const body = await response.text();
  if (body.includes("localhost")) failures.push(`${path} contains localhost URL`);
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  if (path === "/sitemaps/commerce.xml") {
    const advertised = robotsBody.includes("/sitemaps/commerce.xml");
    if (urls.length > 0 && !advertised) failures.push("/robots.txt does not advertise populated commerce sitemap");
    if (urls.length === 0 && advertised) failures.push("/robots.txt advertises empty commerce sitemap");
    if (urls.length === 0) failures.push("/sitemaps/commerce.xml must remain a populated commerce sitemap");
    if (urls.length > 0) {
      try {
        const sample = new URL(urls[0]);
        await get(`${sample.pathname}${sample.search}`);
      } catch {
        failures.push(`/sitemaps/commerce.xml contains invalid sample URL ${urls[0]}`);
      }
    }
  }
  for (const raw of urls) {
    try {
      const url = new URL(raw);
      if (isForbiddenIndexedPath(url.pathname)) failures.push(`${path} leaks noindex/prototype route ${url.pathname}`);
      if (/^\/recommendations\/[^/]+\/?$/.test(url.pathname)) failures.push(`${path} leaks retired recommendation URL ${url.pathname}`);
      if (/^\/motorcycles\/electric\/[^/]+\/?$/.test(url.pathname)) failures.push(`${path} leaks consolidated electric model URL ${url.pathname}`);
    } catch {
      failures.push(`${path} contains invalid URL ${raw}`);
    }
  }
}

// Keep a small explicit dealer smoke set after the exhaustive crawl has already passed.
for (const path of [
  "/dealers",
  "/dealers/san-fernando",
  "/dealers/angeles-city",
  "/dealers/cebu-city",
  "/dealers/davao-city",
  "/dealers/pampanga"
]) await get(path);

const admin = await get("/admin/data-health", [401, 503]);
if (admin && !admin.headers.get("x-robots-tag")?.includes("noindex")) failures.push("Unauthenticated admin response missing X-Robots-Tag noindex.");

const sellersHub = await get("/sellers", 404);
if (sellersHub && !sellersHub.headers.get("x-robots-tag")?.includes("noindex")) failures.push("/sellers: prototype 404 missing X-Robots-Tag noindex");
for (const path of ["/sellers/demo-yamaha-dealer-a", "/dealers/quezon-city"]) await get(path, 404);

for (const path of ["/price-alerts", "/used-motorcycles"]) {
  const response = await get(path);
  if (!response) continue;
  const body = (await response.text()).toLowerCase();
  if (!body.includes("noindex")) failures.push(`${path}: public utility page is missing noindex metadata`);
}

for (const path of ["/api/leads", "/api/price-alerts"]) {
  const response = await request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "do-not-store@example.invalid", contact: "do-not-store" })
  });
  if (response && ![400, 503].includes(response.status)) failures.push(`${path}: safe invalid POST expected 400 or 503, got ${response.status}`);
}

const offers = await get("/api/offers", [200, 410]);
if (offers?.status === 200) {
  try {
    const body = await offers.json();
    if (body.ok !== true || !Array.isArray(body.offers)) failures.push("/api/offers returned an unexpected enabled payload");
  } catch {
    failures.push("/api/offers did not return valid JSON");
  }
}

const usedListings = await get("/api/used-listings");
if (usedListings) {
  try {
    const body = await usedListings.json();
    if (body.ok !== true || !Array.isArray(body.listings)) failures.push("/api/used-listings returned an unexpected payload");
  } catch {
    failures.push("/api/used-listings did not return valid JSON");
  }
}

const models = await get("/api/models");
if (models) {
  try {
    const body = await models.json();
    if (!Array.isArray(body.data) || body.data.length < 1) failures.push("/api/models returned no verified launch records");
    for (const item of body.data || []) {
      if (item.freshness !== "verified") failures.push(`/api/models leaked non-verified model ${item.id || "unknown"}`);
      if (/pending|recheck|research only|needs verification/i.test(item.sourceLabel || "")) failures.push(`/api/models leaked review-labeled model ${item.id || "unknown"}`);
    }
  } catch {
    failures.push("/api/models did not return valid JSON");
  }
}

const financeOk = await get("/api/finance?price=100000&down=20&months=36&rate=12");
if (financeOk) {
  try {
    const body = await financeOk.json();
    if (!(body.estimatedMonthly > 0)) failures.push("/api/finance valid request returned no positive monthly estimate");
  } catch {
    failures.push("/api/finance valid request did not return valid JSON");
  }
}
for (const path of [
  "/api/finance?price=100000&down=200&months=36&rate=12",
  "/api/finance?price=100000&down=20&months=0&rate=12",
  "/api/finance?price=100000&down=20&months=36.5&rate=12",
  "/api/finance?price=100000&down=20&months=36&rate=-1"
]) await get(path, 400);

if (failures.length) {
  console.error("Production smoke test failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Production smoke test passed for ${base.origin}${expectedCommit ? ` at ${expectedCommit.slice(0, 12)}` : ""}`);

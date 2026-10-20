const base = new URL(process.env.BASE_URL || "https://motoindexph.com");
const expectedCommit = (process.env.EXPECTED_COMMIT_SHA || "").trim();
const timeoutMs = Math.max(5000, Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 15000));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Existing authority URLs receiving visible answers in the next AEO sprint.
const aeoSprint3Routes = [
  "/compare/aerox-v3-vs-nmax-v3",
  "/compare/adv-160-vs-pcx-160",
  "/gear/helmets",
  "/tires",
  "/accessories",
];
// Required SEO content destinations from PR #493. Merge does not prove live publication.
const seoReleaseRoutes = [
  ...aeoSprint3Routes,
  "/guides/motorcycle-loan-philippines",
  "/guides/semi-automatic-motorcycles-philippines",
  "/recommendations/150cc-motorcycles-philippines",
  "/tires/honda-beat-tire-size",
  "/guides/motorcycle-brands-philippines",
];

const publicRoutes = [
  "/",
  "/motorcycles",
  "/motorcycles/yamaha/aerox-v3",
  "/compare/selection?bikes=aerox-v3,nmax-v3",
  "/recommendations",
  "/recommendations/motorcycles-under-100k",
  "/motorcycles/yamaha/nmax-v3",
  "/motorcycles/honda/adv-160",
  "/motorcycles/honda/click-160",
  ...seoReleaseRoutes,
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
    if (seoReleaseRoutes.includes(path) && response.status === 200) {
      const title = body.match(/<title\b[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
      if (!title || title.length < 12) failures.push(path + ": missing HTML title");
      const tags = body.match(/<meta\b[^>]*>/gi) || [];
      const description = tags.find(tag => /\bname\s*=\s*(["'])description\1/i.test(tag));
      if (!description || !/\bcontent\s*=\s*(["'])[^"']{40,}\1/i.test(description)) {
        failures.push(path + ": missing or short meta description");
      }
      const canonicalTag = (body.match(/<link\b[^>]*>/gi) || [])
        .find(tag => /\brel\s*=\s*(["'])canonical\1/i.test(tag));
      const canonical = canonicalTag?.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
      if (canonical !== new URL(path, base).href) {
        failures.push(path + ": canonical mismatch (" + (canonical || "missing") + ")");
      }
      if (!/application\/ld\+json/i.test(body)) failures.push(path + ": missing JSON-LD");
      const robotsTag = tags.find(tag => /\bname\s*=\s*(["'])robots\1/i.test(tag));
      if (robotsTag && /\bnoindex\b/i.test(robotsTag)) failures.push(path + ": unexpectedly noindex");
      if (aeoSprint3Routes.includes(path)) {
        if (!body.includes("data-aeo-quick-answer")) failures.push(path + ": missing visible answer-first question");
        if (!body.includes('"@type":"FAQPage"')) failures.push(path + ": missing matching visible FAQ JSON-LD");
      }
    }
  } catch (error) {
    failures.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const home = await fetchWithTimeout("/");
  for (const [header, expected] of [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "SAMEORIGIN"],
  ]) {
    if (home.headers.get(header) !== expected) failures.push(`/: missing or unexpected ${header}`);
  }
  // Modern browsers default to strict-origin-when-cross-origin. A global
  // static header was removed because OpenNext overwrote the stronger private
  // no-referrer response on token/account paths.
  const referrer = home.headers.get("referrer-policy");
  if (referrer && referrer !== "strict-origin-when-cross-origin") {
    failures.push("/: unexpected public Referrer-Policy");
  }
  if (!home.headers.get("strict-transport-security")) failures.push("/: missing Strict-Transport-Security");
} catch (error) {
  failures.push(`/: header verification failed: ${error instanceof Error ? error.message : String(error)}`);
}

if (process.env.EXPECT_ADS_ONLY === "true") {
  try {
    const guide = await fetchWithTimeout("/guides/motorcycle-helmet-size-guide");
    const csp = guide.headers.get("content-security-policy") || "";
    const html = await guide.text();
    if (guide.status !== 200) failures.push("Ads-only guide must return 200");
    if (!csp.includes("'nonce-") || !csp.includes("'strict-dynamic'")) failures.push("Ads-only guide lacks nonce CSP");
    if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
      failures.push("Ads-only guide is missing AdSense loader");
    }
    if (!html.includes("6431580274")) failures.push("Ads-only guide is missing approved display slot");
  } catch (error) {
    failures.push("Ads-only guide check failed: " + (error instanceof Error ? error.name : "unknown"));
  }

  // AdSense motorcycle expansion: verify published HTML and privacy policy
  // using only anonymous public documents (never bearer URLs).
  for (const path of ["/motorcycles", "/motorcycles/yamaha", "/motorcycles/yamaha/aerox-v3"]) {
    try {
      const response = await fetchWithTimeout(path);
      const csp = response.headers.get("content-security-policy") || "";
      const html = await response.text();
      if (response.status !== 200) failures.push("Motorcycle ad document returned HTTP " + response.status);
      if (!csp.includes("'strict-dynamic'") || !csp.includes("'nonce-")) failures.push("Motorcycle ad document missing nonce CSP");
      if (!/no-store/.test(response.headers.get("cache-control") || "")) failures.push("Motorcycle ad document missing no-store");
      if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) failures.push("Motorcycle ad document missing Google loader");
      if (!html.includes("6431580274")) failures.push("Motorcycle ad document missing approved slot");
    } catch (error) {
      failures.push("Motorcycle ad document smoke failed: " + (error instanceof Error ? error.name : "unknown"));
    }
  }

  for (const path of ["/garage", "/dealer-portal", "/quote-status/motoindex-synthetic-466"]) {
    try {
      const response = await fetchWithTimeout(path, { redirect: "manual" });
      if (response.status !== 503) failures.push("Ads-only private page did not fail closed (HTTP " + response.status + ")");
      const headers = response.headers.get("referrer-policy") || "";
      if (!headers.split(",").every(x => x.trim() === "no-referrer")) failures.push("Ads-only private response leaked referrer policy");
    } catch (error) {
      failures.push("Ads-only private guard unavailable: " + (error instanceof Error ? error.name : "unknown"));
    }
  }

  try {
    const response = await fetchWithTimeout("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    if (response.status !== 503) failures.push("Ads-only write API did not fail closed");
  } catch (error) {
    failures.push("Ads-only write API guard unavailable: " + (error instanceof Error ? error.name : "unknown"));
  }
}

if (failures.length) {
  console.error("Production public-route smoke test failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Production public-route smoke test passed for ${base.origin} at ${(deployment.commit || expectedCommit || "current").slice(0, 12)}.`);

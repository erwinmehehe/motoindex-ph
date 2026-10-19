// Issue #466 preview-only, synthetic-data browser probe.
// This does not replace real GA4/Plausible/AdSense or consent account acceptance.
import { chromium } from "@playwright/test";

const baseInput = process.env.QA_BASE_URL;
const expectAds = process.env.QA_EXPECT_ADS === "true";
const expectAnalytics = process.env.QA_EXPECT_ANALYTICS === "true";

if (!baseInput || (!expectAds && !expectAnalytics)) {
  console.error("Set QA_BASE_URL and QA_EXPECT_ADS=true and/or QA_EXPECT_ANALYTICS=true. An all-off run cannot approve issue #466.");
  process.exit(2);
}

let base;
try { base = new URL(baseInput); } catch { console.error("QA_BASE_URL is invalid."); process.exit(2); }
if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash || base.pathname !== "/") {
  console.error("QA_BASE_URL must be a bare HTTP(S) preview origin without credentials, path, query or fragment.");
  process.exit(2);
}
if (["motoindexph.com", "www.motoindexph.com"].includes(base.hostname) && process.env.QA_ALLOW_PRODUCTION !== "true") {
  console.error("Production QA is blocked by default. Use an approved preview; never test a real buyer link.");
  process.exit(2);
}

const marker = "motoindex-synthetic-privacy-qa-466";
const privateQuote = "/quote-status/" + marker;
const privateDealer = "/dealer-lead/" + marker;
const guide = "/guides/motorcycle-helmet-size-guide";
const errors = new Set();
const observedHosts = new Set();

function providerHost(hostname) {
  return [
    "googletagmanager.com", "google-analytics.com", "googlesyndication.com",
    "doubleclick.net", "googleadservices.com", "plausible.io",
  ].some(domain => hostname === domain || hostname.endsWith("." + domain));
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  let phase = "public";

  page.on("request", request => {
    let hostname;
    try { hostname = new URL(request.url()).hostname; } catch { return; }
    if (!providerHost(hostname)) return;
    observedHosts.add(hostname);
    // Never log private URLs or request bodies; only hostname and a generic finding.
    const headers = request.headers();
    if (request.url().includes(marker) || (headers.referer || "").includes(marker)) {
      errors.add("Synthetic private marker leaked to " + hostname + " (" + phase + ")");
    }
    if (phase.startsWith("private")) {
      errors.add("Third-party analytics/ad request during " + phase + " (" + hostname + ")");
    }
  });
  page.on("console", message => {
    if (message.type() === "error" && /content security policy|refused to load|adsbygoogle/i.test(message.text())) {
      errors.add("Browser reported a CSP/AdSense console error (details intentionally redacted)");
    }
  });

  const publicResponse = await page.goto(new URL(guide, base).href, { waitUntil: "domcontentloaded", timeout: 45000 });
  if (!publicResponse || publicResponse.status() !== 200) errors.add("Editorial guide did not return HTTP 200");
  await page.waitForTimeout(2500);

  if (expectAds) {
    if (await page.locator('ins[data-ad-slot="6431580274"]').count() === 0) {
      errors.add("Expected guide ad slot is absent on the approved preview");
    }
    if (!observedHosts.has("pagead2.googlesyndication.com")) {
      errors.add("No actual AdSense loader request observed on public guide (may be blocked by CSP)");
    }
    const seller = await page.request.get(new URL("/ads.txt", base).href);
    const body = seller.ok() ? await seller.text() : "";
    if (!seller.ok() || !body.includes("google.com, pub-1900865456140693, DIRECT, f08c47fec0942fa0")) {
      errors.add("Verified MotoIndex ads.txt seller line is not served as expected");
    }
  }
  if (expectAnalytics && ![...observedHosts].some(host => /google-analytics|googletagmanager|plausible/.test(host))) {
    errors.add("No enabled GA4/Plausible network loader was observed on public preview");
  }

  // A synthetic History API transition exercises the browser's history listeners;
  // this is NOT a substitute for a real authenticated Next.js SPA journey.
  phase = "private-history";
  await page.evaluate(path => window.history.pushState({}, "", path), privateQuote);
  await page.waitForTimeout(1500);
  if (expectAds && await page.locator('script[src*="adsbygoogle.js"]').count() > 0) {
    errors.add("AdSense script survives public-to-private history transition");
  }

  // Direct private landings must not inherit the globally mounted AdSense head loader.
  for (const path of [privateQuote, privateDealer, "/garage"]) {
    phase = "private-direct";
    const response = await page.goto(new URL(path, base).href, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(750);
    if (!response) { errors.add("Private landing did not return an HTTP response"); continue; }
    const headers = response.headers();
    if ((headers["referrer-policy"] || "").toLowerCase() !== "no-referrer") {
      errors.add("Private route did not enforce Referrer-Policy: no-referrer");
    }
    if (!/no-store/i.test(headers["cache-control"] || "")) {
      errors.add("Private route did not enforce Cache-Control: no-store");
    }
    if (expectAds && await page.locator('script[src*="adsbygoogle.js"]').count() > 0) {
      errors.add("AdSense bootstrap present during direct private landing");
    }
  }

  phase = "public-return";
  const returning = await page.goto(new URL(guide, base).href, { waitUntil: "domcontentloaded", timeout: 45000 });
  if (!returning || returning.status() !== 200) errors.add("Public guide failed on return");
  if (expectAds) {
    const csp = (returning?.headers()["content-security-policy"] || "").toLowerCase();
    if (!csp.includes("'nonce-") || !csp.includes("'strict-dynamic'")) {
      errors.add("Expected nonce-based strict AdSense CSP is not verified on preview");
    }
  }
  await context.close();
} catch (error) {
  errors.add("Browser QA could not complete: " + (error instanceof Error ? error.name : "unknown"));
} finally {
  await browser?.close();
}

// Emit only provider hostnames and generic violations; never credentials,
// request bodies, real token paths, GA IDs, URLs or personally identifying data.
console.log("Issue #466 preview QA: expected ads=" + expectAds + ", analytics=" + expectAnalytics);
console.log("Third-party provider hosts observed: " + ([...observedHosts].sort().join(", ") || "none"));
if (errors.size) {
  console.error("Issue #466 preview QA blocked:\n- " + [...errors].join("\n- "));
  process.exitCode = 1;
} else {
  console.log("Synthetic privacy probe passed. Account, consent, real SPA and revenue acceptance are still required.");
}

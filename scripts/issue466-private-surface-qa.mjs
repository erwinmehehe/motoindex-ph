// Automated direct-document QA for #466. Uses SYNTHETIC URLs only.
// Does not prove public->private SPA isolation, provider account settings or ad revenue.
const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const paths = [
  "/garage", "/my", "/dealer-portal",
  "/quote-status/motoindex-synthetic-466", "/dealer-lead/motoindex-synthetic-466",
  "/price-alerts/confirm/motoindex-synthetic-466",
  "/price-alerts/unsubscribe/motoindex-synthetic-466",
];
const failures = [];

for (const path of paths) {
  try {
    const response = await fetch(new URL(path, base), {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": "MotoIndexSyntheticPrivacyQA/466" },
    });
    const headers = response.headers;
    const csp = headers.get("content-security-policy") || "";
    if (!/no-store/i.test(headers.get("cache-control") || "")) failures.push(path + ": missing no-store");
    if (!/noindex/i.test(headers.get("x-robots-tag") || "")) failures.push(path + ": missing noindex");
    if (headers.get("referrer-policy") !== "no-referrer") failures.push(path + ": missing no-referrer");
    if (!csp.includes("frame-src 'none'") || !csp.includes("connect-src 'self'")) {
      failures.push(path + ": provider-blocking private CSP missing");
    }
    for (const host of ["google-analytics.com", "googletagmanager.com", "googlesyndication.com", "plausible.io"]) {
      if (csp.includes(host)) failures.push(path + ": private CSP still permits " + host);
    }
    if (response.status >= 500) failures.push(path + ": unexpected server HTTP " + response.status);
  } catch (error) {
    failures.push(path + ": synthetic request failed (" + (error instanceof Error ? error.name : "unknown") + ")");
  }
}

if (failures.length) {
  console.error("Issue #466 direct-private-document QA FAILED:\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("Issue #466 direct-private-document QA passed on " + paths.length + " synthetic routes. SPA privacy, consent and AdSense provider acceptance still remain OPEN.");
}

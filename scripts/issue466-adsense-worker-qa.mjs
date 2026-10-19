// Local Cloudflare Worker acceptance for an explicitly ads-enabled TEST build.
// Synthetic paths only; never logs bearer tokens or asserts live AdSense revenue.
const base = new URL(process.env.BASE_URL || "http://127.0.0.1:8787");
const guide = "/guides/motorcycle-helmet-size-guide";
const privatePaths = ["/garage", "/quote-status/motoindex-synthetic-466", "/dealer-lead/motoindex-synthetic-466"];
const errors = [];
const adsOnly = process.env.NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE === "true";

async function get(path) {
  return fetch(new URL(path, base), {
    headers: { "Accept": "text/html", "User-Agent": "MotoIndexSyntheticAdsCSPQA/466" },
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });
}
try {
  const page = await get(guide);
  if (!page.ok) errors.push("Guide did not return 200: " + page.status);
  const csp = page.headers.get("Content-Security-Policy") || "";
  const nonce = csp.match(/'nonce-([A-Za-z0-9+\/=]+)'/)?.[1];
  if (!nonce || !csp.includes("'strict-dynamic'")) errors.push("Guide is missing nonce/strict-dynamic CSP");
  if (!/no-store/.test(page.headers.get("Cache-Control") || "")) errors.push("Dynamically rendered guide missing no-store");
  if (page.headers.get("X-Content-Type-Options") !== "nosniff") errors.push("Guide security headers were lost");
  const html = await page.text();
  if (!html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("Guide missing AdSense bootstrap in HTML");
  if (!html.includes("6431580274")) errors.push("Guide missing designated manual display slot");

  const second = await get(guide);
  const cspSecond = second.headers.get("Content-Security-Policy") || "";
  if (csp && cspSecond && csp === cspSecond) errors.push("Guide nonce repeated across distinct requests");

  for (const route of privatePaths) {
    const res = await get(route);
    if (adsOnly && res.status !== 503) errors.push("Ads-only mode must disable this private route");
    if (!res.headers.get("Content-Security-Policy")?.includes("frame-src 'none'")) errors.push("Private response missing blocking CSP");
    const policy = res.headers.get("Referrer-Policy");
    // Next.js/OpenNext can legally combine identical headers into a comma-
    // separated policy list. Browsers use the last recognized directive.
    // Require EVERY directive to be no-referrer: reject any weaker fallback,
    // but don't mistake "no-referrer, no-referrer" for a leak.
    const values = policy?.split(",").map(value => value.trim()).filter(Boolean) || [];
    if (!values.length || values.some(value => value !== "no-referrer")) {
      // Do not print token-bearing URLs. Policy is categorical, bounded text.
      const safePolicy = policy?.replace(/[^a-z, -]/gi, "").slice(0, 80) || "(absent)";
      errors.push("Private response policy is not strictly no-referrer (route type " + (privatePaths.indexOf(route) + 1) + "; observed " + safePolicy + "; HTTP " + res.status + ")");
    }
    if (!/no-store/.test(res.headers.get("Cache-Control") || "")) errors.push("Private response missing no-store");
    const body = await res.text();
    if (body.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("AdSense leaked into private HTML");
  }
  if (adsOnly) {
    const api = await fetch(new URL("/api/leads", base), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(12_000),
    });
    if (api.status !== 503) errors.push("Ads-only mode must fail closed for lead submissions");
    const privateHeaders = api.headers.get("Referrer-Policy") || "";
    if (!privateHeaders.split(",").every(x => x.trim() === "no-referrer")) {
      errors.push("Ads-only blocked lead API leaked referrer policy");
    }
  }
  // Direct HTML must execute via OpenNext middleware (not the static asset
  // publisher), receive a document-specific CSP nonce and serve the existing
  // approved manual slot. Check directory, brand, model and electric model.
  for (const route of [
    "/motorcycles",
    "/motorcycles/yamaha",
    "/motorcycles/yamaha/aerox-v3",
    "/motorcycles/electric/vinfast-evo",
  ]) {
    const res = await get(route);
    if (!res.ok) {
      errors.push("Motorcycle ad page unavailable (HTTP " + res.status + ")");
      continue;
    }
    const policy = res.headers.get("Content-Security-Policy") || "";
    const docNonce = policy.match(/'nonce-([A-Za-z0-9+\\/=]+)'/)?.[1];
    if (!docNonce || !policy.includes("'strict-dynamic'")) errors.push("Motorcycle ad page missing nonce CSP");
    if (!/no-store/.test(res.headers.get("Cache-Control") || "")) errors.push("Motorcycle ad page missing no-store");
    const body = await res.text();
    if (!body.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("Motorcycle document missing AdSense loader");
    if (!body.includes("6431580274")) errors.push("Motorcycle document missing manual ad slot");
    if (!body.includes("Advertisement")) errors.push("Motorcycle ad placement lacks disclosure label");
  }
  // Private pages and URL query/filter values must not inherit AdSense.
  const filtered = await get("/motorcycles?q=motoindex-qa-synthetic");
  const filteredHtml = await filtered.text();
  if (filteredHtml.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("Search query page unexpectedly loaded AdSense");
  const filteredCsp = filtered.headers.get("Content-Security-Policy") || "";
  if (!filteredCsp.includes("script-src 'self'") || filteredCsp.includes("'strict-dynamic'")) errors.push("Filtered catalog missing restrictive CSP");
  const utility = await get("/motorcycles/yamaha/aerox-v3/specs");
  const utilityHtml = await utility.text();
  if (utilityHtml.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("Motorcycle utility page unexpectedly loaded AdSense");
} catch (e) {
  errors.push("Worker QA did not finish: " + (e instanceof Error ? e.name : "unknown"));
}
if (errors.length) {
  console.error("AdSense release-mode Worker QA failed:\n- " + errors.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("AdSense release-mode Worker HTML/CSP QA passed. AdSense account authorization, consent, script requests, browser navigation and impressions still need verification.");
}

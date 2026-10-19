// Local Cloudflare Worker acceptance for an explicitly ads-enabled TEST build.
// Synthetic paths only; never logs bearer tokens or asserts live AdSense revenue.
const base = new URL(process.env.BASE_URL || "http://127.0.0.1:8787");
const guide = "/guides/motorcycle-helmet-size-guide";
const privatePaths = ["/garage", "/quote-status/motoindex-synthetic-466", "/dealer-lead/motoindex-synthetic-466"];
const errors = [];

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
  const publicPage = await get("/motorcycles/yamaha/aerox-v3");
  if (!publicPage.ok) errors.push("Motorcycle catalogue page is unavailable");
  if ((await publicPage.text()).includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) errors.push("AdSense leaked into unrelated public HTML");
} catch (e) {
  errors.push("Worker QA did not finish: " + (e instanceof Error ? e.name : "unknown"));
}
if (errors.length) {
  console.error("AdSense release-mode Worker QA failed:\n- " + errors.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("AdSense release-mode Worker HTML/CSP QA passed. AdSense account authorization, consent, script requests, browser navigation and impressions still need verification.");
}

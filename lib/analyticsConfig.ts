/** Return a valid public GA4 measurement ID, or no analytics at all. */
export function googleAnalyticsMeasurementId(configured: string | undefined | null) {
  const id = (configured || "").trim().toUpperCase();
  return /^G-[A-Z0-9]{5,20}$/.test(id) ? id : "";
}

// Fail closed on new page families. Private forms, accounts and bearer links must be
// explicitly reviewed before anyone can add them to the analytics surface.
const publicPageRoots = new Set([
  "about", "accessories", "affiliate-disclosure", "authors", "catalog", "commute",
  "compare", "contact", "corrections", "data-sources", "dealers", "deals",
  "editorial-policy", "finder", "fitment", "gear", "guides", "maintenance",
  "methodology", "motorcycles", "ownership", "privacy", "recommendations",
  "research", "search", "service-centers", "shortlist", "tires", "tools",
  "used-motorcycles",
]);

/** Opted-in analytics may track only known public page families (never private URL paths). */
export function publicAnalyticsAllowed(pathname: string | null | undefined) {
  // Reject queries, fragments, encoded/ambiguous paths and unknown new routes.
  if (!pathname || !/^\/[a-z0-9/_-]*$/i.test(pathname) || pathname.includes("//")) return false;
  const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/") return true;

  if (/\/(?:sign-in|verify|confirm|unsubscribe|reset|token)(?:\/|$)/.test(path)) return false;
  // Price alerts are public only at their landing page. Confirmation and
  // unsubscribe flows can contain private bearer tokens.
  if (path === "/price-alerts") return true;
  const root = path.slice(1).split("/")[0];
  return publicPageRoots.has(root);
}

/** A pageview location with no query parameters, fragments or private tokens. */
export function safePageviewUrl(origin: string, pathname: string) {
  if (!publicAnalyticsAllowed(pathname)) return "";
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    return parsed.origin + pathname;
  } catch { return ""; }
}

/** Only allow personalized Plausible scripts, not legacy automatic pageviews. */
export function plausibleSiteScriptUrl(configured: string | undefined | null) {
  const url = (configured || "").trim();
  return /^https:\/\/plausible\.io\/js\/pa-[A-Za-z0-9_-]+\.js$/.test(url) ? url : "";
}

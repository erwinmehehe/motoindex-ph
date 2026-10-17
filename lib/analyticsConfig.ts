/** Return a valid public GA4 measurement ID, or no analytics at all. */
export function googleAnalyticsMeasurementId(configured: string | undefined | null) {
  const id = (configured || "").trim().toUpperCase();
  return /^G-[A-Z0-9]{5,20}$/.test(id) ? id : "";
}

/** Routes with accounts, private data, or bearer tokens must not be tracked. */
export function publicAnalyticsAllowed(pathname: string | null | undefined) {
  if (!pathname || !pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) return false;
  const path = pathname.toLowerCase();
  const protectedRoots = [
    "/admin", "/api", "/my", "/garage", "/dealer-portal",
    "/dealer-lead", "/quote-status", "/go",
    "/price-alerts/confirm", "/price-alerts/unsubscribe",
  ];
  if (protectedRoots.some(root => path === root || path.startsWith(root + "/"))) return false;
  if (/\/(?:sign-in|verify|confirm|unsubscribe|reset|token)(?:\/|$)/.test(path)) return false;
  return true;
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

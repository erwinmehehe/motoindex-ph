/**
 * Minimal public-research + AdSense release mode.
 *
 * The site is already useful without PostgreSQL (seeded motorcycle/gear
 * research). In this mode, no personal details, auth links, dealer requests,
 * admin actions or persistent records may be handled by the Worker.
 *
 * NEXT_PUBLIC is intentional: Next.js inlines this flag into the middleware
 * bundle at build time, so the protection does not depend on separately
 * configuring a Cloudflare Worker runtime variable.
 */
export function adsOnlyModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE === "true";
}

const disabledServicePaths = [
  "/admin", "/api/admin", "/api/ingestion", "/api/cron",
  "/api/leads", "/api/dealer-partners", "/api/dealer-lead",
  "/api/dealer-portal", "/api/garage", "/api/my",
  "/api/price-alerts", "/api/quote-status", "/api/used-listings",
  "/api/used-valuation", "/api/owner-reviews", "/api/offers",
  "/api/affiliate-links",
  "/garage", "/my", "/dealer-portal", "/dealer-lead",
  "/quote-status", "/price-alerts", "/get-quote",
  "/dealers/join", "/used-motorcycles/listing",
] as const;

export function adsOnlyDisablesRequest(pathname: string, method: string): boolean {
  // Reject *all* writes, including unknown future routes.
  if (method !== "GET" && method !== "HEAD") return true;
  const path = pathname.replace(/\/+$/, "") || "/";
  return disabledServicePaths.some(prefix => path === prefix || path.startsWith(prefix + "/"));
}

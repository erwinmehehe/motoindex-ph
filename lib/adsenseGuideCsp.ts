/**
 * AdSense is intentionally limited to full HTML document loads of public
 * editorial guides. The middleware uses this route check to attach a fresh
 * nonce and a strict CSP. No private/account route may get an advertising CSP.
 */
export function isAdSenseGuideDocument(pathname: string) {
  return /^\/guides\/[a-z0-9-]+\/?$/.test(pathname);
}


/**
 * Canonical, public motorcycle routes that carry manual AdSense units.
 * Never match account, dealer, quote, interactive subtools or derivative
 * endpoints. This is a pathname-only allowlist; middleware also rejects
 * document requests with query parameters and RSC/prefetch headers.
 */
const motorcycleNonBrandPaths = new Set(["electric", "scooters", "expressway-legal", "loan"]);
const motorcycleNonModelPaths = new Set([
  "dealers", "scooters", "range-comparison", "price", "specifications",
  "colors", "rider-fit", "fuel-economy", "ownership-cost", "tire-size",
  "maintenance", "safety", "used-value", "new-vs-used",
  "accessories", "changes", "fuel-consumption", "gear",
  "installment", "seat-height", "specs", "top-speed", "weight"
]);

export function isAdSenseMotorcycleDocument(pathname: string) {
  if (pathname === "/motorcycles" || pathname === "/motorcycles/") return true;
  if (!/^\/motorcycles(?:\/[a-z0-9-]+){1,2}\/?$/.test(pathname)) return false;
  const [, , make, slug] = pathname.split("/");
  if (!slug) return !motorcycleNonBrandPaths.has(make);
  return !motorcycleNonModelPaths.has(slug);
}

/** Exact high-traffic, anonymous documents permitted to carry manual ads. */
export function isAdSensePriorityDocument(pathname: string) {
  return pathname === "/" || pathname === "/finder" || pathname === "/finder/" ||
    pathname === "/tools/motorcycle-loan-calculator" || pathname === "/tools/motorcycle-loan-calculator/";
}

export function isAdSensePublicDocument(pathname: string) {
  return isAdSenseGuideDocument(pathname) || isAdSenseMotorcycleDocument(pathname) || isAdSensePriorityDocument(pathname);
}

/**
 * Google's supported strict-dynamic/nonce AdSense policy.
 * There are no changing AdSense domain allowlists to maintain.
 * This is not used on private pages.
 *
 * https://support.google.com/adsense/answer/16283098
 */
export function adsenseGuideCsp(nonce: string) {
  if (!/^[A-Za-z0-9+/=-]{16,128}$/.test(nonce)) throw new Error("Invalid AdSense CSP nonce.");
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src https:",
    "worker-src 'self' blob:",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}


/**
 * Fallback equivalent of the site's ordinary public CSP for motorcycle
 * utility/derivative and query-filtered URLs that are NOT ad documents.
 * Next.js omits its global CSP on /motorcycles only while AdSense is enabled.
 */
export function nonAdvertisingMotorcycleCsp() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://plausible.io`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://plausible.io",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

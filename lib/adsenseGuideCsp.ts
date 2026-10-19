/**
 * AdSense is intentionally limited to full HTML document loads of public
 * editorial guides. The middleware uses this route check to attach a fresh
 * nonce and a strict CSP. No private/account route may get an advertising CSP.
 */
export function isAdSenseGuideDocument(pathname: string) {
  return /^\/guides\/[a-z0-9-]+\/?$/.test(pathname);
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

/**
 * Policy for *direct document responses* on token-bearing and account routes.
 *
 * This deliberately has NO Google Analytics, Plausible, AdSense, frame or
 * other third-party script/connect permissions. It still permits the inline
 * Next.js hydration scripts required by the current static/runtime build.
 *
 * IMPORTANT: a CSP header on a new server response does NOT replace the CSP
 * of an existing document during client-side (SPA) navigation. Advertising
 * remains release-locked until separate document boundaries and nonce-based
 * AdSense CSP are independently browser-tested (MotoIndex issue #466).
 */
export function privateDocumentCsp() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${process.env.NODE_ENV === "development" ? " ws: wss:" : ""}`,
    "frame-src 'none'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

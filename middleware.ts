import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/admin", "/api/ingestion", "/api/admin"];
const prototypePrefixes = ["/price-alerts", "/deals"];
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_FAILURES = 10;
const authFailures = new Map<string, { count: number; resetAt: number }>();

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function deny(message: string, status: number, challenge = false, retryAfterSeconds?: number) {
  const headers = new Headers({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" });
  if (challenge) headers.set("WWW-Authenticate", 'Basic realm="MotoIndex Admin", charset="UTF-8"');
  if (retryAfterSeconds) headers.set("Retry-After", String(retryAfterSeconds));
  return new NextResponse(message, { status, headers });
}

function authClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || forwarded || "unknown";
}

function activeAuthFailure(key: string, now = Date.now()) {
  const entry = authFailures.get(key);
  if (!entry) return undefined;
  if (entry.resetAt <= now) { authFailures.delete(key); return undefined; }
  return entry;
}

function recordAuthFailure(key: string, now = Date.now()) {
  const entry = activeAuthFailure(key, now);
  authFailures.set(key, entry ? { count: entry.count + 1, resetAt: entry.resetAt } : { count: 1, resetAt: now + AUTH_WINDOW_MS });
}

function isPrototypePath(pathname: string) {
  if (pathname === "/used-motorcycles/repo" || pathname === "/used-motorcycles/buying-checklist") return false;
  if (pathname === "/sellers") return true;
  if (prototypePrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) return true;
  return /^\/motorcycles\/[^/]+\/[^/]+\/(used-value|new-vs-used)\/?$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (process.env.NODE_ENV === "production" && isPrototypePath(pathname)) return deny("Not found.", 404);
  if (!protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return NextResponse.next();

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return deny("Administrative surface unavailable.", 503);

  const clientKey = authClientKey(request);
  const failure = activeAuthFailure(clientKey);
  if (failure && failure.count >= AUTH_MAX_FAILURES) return deny("Too many authentication attempts.", 429, false, Math.max(1, Math.ceil((failure.resetAt - Date.now()) / 1000)));

  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Basic ")) return deny("Authentication required.", 401, true);

  let decoded = "";
  try { decoded = atob(authorization.slice(6)); } catch { return deny("Authentication required.", 401, true); }
  const colon = decoded.indexOf(":");
  if (colon < 0) return deny("Authentication required.", 401, true);
  const user = decoded.slice(0, colon);
  const password = decoded.slice(colon + 1);

  if (!safeEqual(user, expectedUser) || !safeEqual(password, expectedPassword)) {
    recordAuthFailure(clientKey);
    return deny("Authentication required.", 401, true);
  }

  authFailures.delete(clientKey);
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*", "/api/ingestion/:path*", "/api/admin/:path*", "/price-alerts/:path*", "/deals/:path*",
    "/sellers", "/go/:path*",
    "/motorcycles/:make/:slug/used-value", "/motorcycles/:make/:slug/new-vs-used"
  ]
};

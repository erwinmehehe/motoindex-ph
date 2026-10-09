import { cloudflareAccessConfigured, verifyCloudflareAccess } from "@/lib/cloudflareAccess";

const privacyHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};

/**
 * Independent production authorization for privileged API handlers.
 * Middleware remains the first gate, but each API must also fail closed if a
 * route is accidentally exposed through a Worker/rewrite configuration.
 */
export async function requirePrivilegedApiAccess(request: Request): Promise<Response | null> {
  if (process.env.NODE_ENV !== "production") return null;
  const mode = (process.env.ADMIN_ACCESS_MODE || "cloudflare").trim().toLowerCase();
  if (!["cloudflare", "cloudflare-access"].includes(mode) || !cloudflareAccessConfigured()) {
    return Response.json({ ok: false, error: "Administrative API unavailable." }, { status: 503, headers: privacyHeaders });
  }
  try {
    const access = await verifyCloudflareAccess(request);
    if (access.ok) return null;
    return Response.json({ ok: false, error: "Administrative access denied." }, { status: 403, headers: privacyHeaders });
  } catch {
    return Response.json({ ok: false, error: "Administrative authentication unavailable." }, { status: 503, headers: privacyHeaders });
  }
}

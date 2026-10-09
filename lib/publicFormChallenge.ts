// Server-only verification for public forms. Turnstile is enforced in production.
export type PublicFormAction = "buyer_quote" | "dealer_application" | "price_alert" | "used_listing_inquiry";
type ChallengeResult = { ok: true } | { ok: false; status: number; error: string };

export async function verifyPublicFormChallenge(value: unknown, action: PublicFormAction): Promise<ChallengeResult> {
  const secret = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  const siteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "").trim();
  const required = process.env.NODE_ENV === "production" || process.env.REQUIRE_FORM_BOT_PROTECTION === "true";

  // Local tests and development are not forced to use external Cloudflare credentials.
  if (!required && !secret && !siteKey) return { ok: true };
  if (!secret || !siteKey) {
    return { ok: false, status: 503, error: "Spam protection is temporarily unavailable." };
  }
  if (typeof value !== "string" || !value.trim() || value.length > 2048) {
    return { ok: false, status: 400, error: "Complete the spam protection check before submitting." };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: value.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return { ok: false, status: 503, error: "Verification is unavailable. Please try again." };

    const result = await response.json() as { success?: boolean; action?: string; hostname?: string };
    if (!result.success || result.action !== action) {
      return { ok: false, status: 403, error: "Verification expired or failed. Please retry." };
    }
    if (process.env.NODE_ENV === "production") {
      const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://motoindexph.com").hostname;
      const permitted = new Set([host, "www." + host.replace(/^www\./, "")]);
      if (!result.hostname || !permitted.has(result.hostname)) {
        return { ok: false, status: 403, error: "Verification was not issued for MotoIndex." };
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 503, error: "Verification is unavailable. Please try again." };
  }
}

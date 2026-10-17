import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyPublicFormChallenge } from "../lib/publicFormChallenge";

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubEnv("REQUIRE_FORM_BOT_PROTECTION", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://motoindexph.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function configure() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
}

describe("public form Turnstile verification", () => {
  it("allows local development without Cloudflare keys", async () => {
    await expect(verifyPublicFormChallenge(undefined, "buyer_quote")).resolves.toEqual({ ok: true });
  });

  it("fails closed when production keys have not been configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(verifyPublicFormChallenge("unused", "buyer_quote")).resolves.toMatchObject({ ok: false, status: 503 });
  });

  it("requires a nonempty token when configured", async () => {
    configure();
    await expect(verifyPublicFormChallenge("", "dealer_application")).resolves.toMatchObject({ ok: false, status: 400 });
  });

  it("verifies the expected action and hostname against Cloudflare", async () => {
    configure();
    const fetchMock = vi.fn(async (url: string, options: RequestInit) => {
      expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
      const fields = new URLSearchParams(String(options.body));
      expect(fields.get("secret")).toBe("test-secret");
      expect(fields.get("response")).toBe("token-for-motoindex");
      return new Response(JSON.stringify({
        success: true,
        action: "buyer_quote",
        hostname: "motoindexph.com"
      }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyPublicFormChallenge("token-for-motoindex", "buyer_quote")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects a token for another action", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ success: true, action: "price_alert", hostname: "motoindexph.com" }), { status: 200 })
    ));
    await expect(verifyPublicFormChallenge("token", "buyer_quote")).resolves.toMatchObject({ ok: false, status: 403 });
  });

  it("rejects a token from an unapproved hostname", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn(async () =>
      new Response(JSON.stringify({ success: true, action: "buyer_quote", hostname: "outside.example" }), { status: 200 })
    ));
    await expect(verifyPublicFormChallenge("token", "buyer_quote")).resolves.toMatchObject({ ok: false, status: 403 });
  });

  it("does not allow submissions when Cloudflare verification is unavailable", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("Network unreachable"); }));
    await expect(verifyPublicFormChallenge("token", "buyer_quote")).resolves.toMatchObject({ ok: false, status: 503 });
  });
});

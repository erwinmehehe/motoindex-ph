import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyCloudflareAccess } from "../lib/cloudflareAccess";

function base64url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(bytes).toString("base64url");
}

describe("Cloudflare Access verification", () => {
  let privateKey: CryptoKey;
  let publicJwk: JsonWebKey & { kid?: string };

  beforeEach(async () => {
    process.env.CF_ACCESS_TEAM_DOMAIN = "motoindex.cloudflareaccess.com";
    process.env.CF_ACCESS_AUD = "test-audience";
    process.env.ADMIN_ACCESS_EMAILS = "admin@example.com";

    const pair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    privateKey = pair.privateKey;
    publicJwk = (await crypto.subtle.exportKey("jwk", pair.publicKey)) as JsonWebKey & {
      kid?: string;
    };
    publicJwk.kid = "test-key";
    publicJwk.alg = "RS256";
    publicJwk.use = "sig";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ keys: [publicJwk] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.CF_ACCESS_TEAM_DOMAIN;
    delete process.env.CF_ACCESS_AUD;
    delete process.env.ADMIN_ACCESS_EMAILS;
  });

  async function token(overrides: Record<string, unknown> = {}) {
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", kid: "test-key" }));
    const payload = base64url(
      JSON.stringify({
        aud: "test-audience",
        email: "admin@example.com",
        exp: now + 300,
        iat: now,
        iss: "https://motoindex.cloudflareaccess.com",
        ...overrides,
      })
    );
    const data = new TextEncoder().encode(\`\${header}.\${payload}\`);
    const signature = new Uint8Array(
      await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data)
    );
    return \`\${header}.\${payload}.\${base64url(signature)}\`;
  }

  it("accepts a correctly signed allowed identity", async () => {
    const jwt = await token();
    const request = new Request("https://motoindexph.com/admin", {
      headers: {
        "cf-access-jwt-assertion": jwt,
        "cf-access-authenticated-user-email": "admin@example.com",
      },
    });

    await expect(verifyCloudflareAccess(request)).resolves.toEqual({
      ok: true,
      email: "admin@example.com",
    });
  });

  it("rejects a valid signature with the wrong audience", async () => {
    const jwt = await token({ aud: "wrong-audience" });
    const request = new Request("https://motoindexph.com/admin", {
      headers: {
        "cf-access-jwt-assertion": jwt,
        "cf-access-authenticated-user-email": "admin@example.com",
      },
    });

    const result = await verifyCloudflareAccess(request);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("audience");
  });
});

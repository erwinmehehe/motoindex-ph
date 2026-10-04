import { afterEach, describe, expect, it } from "vitest";
import { adminAccessAllowedEmails, adminAccessIdentityAllowed, adminAuthMode } from "../lib/adminAuthPolicy";

describe("admin auth policy",()=>{
  afterEach(()=>{
    delete process.env.ADMIN_AUTH_MODE;
    delete process.env.ADMIN_ACCESS_ALLOWED_EMAILS;
  });
  it("defaults to Basic Auth compatibility mode",()=>{
    expect(adminAuthMode()).toBe("basic");
  });
  it("requires Access email, assertion, and allowlist",()=>{
    process.env.ADMIN_AUTH_MODE="cloudflare-access";
    process.env.ADMIN_ACCESS_ALLOWED_EMAILS="Admin@Example.com,ops@example.com";
    const headers=new Headers({
      "cf-access-authenticated-user-email":"admin@example.com",
      "cf-access-jwt-assertion":"signed-by-cloudflare-at-edge"
    });
    expect(adminAuthMode()).toBe("cloudflare-access");
    expect(adminAccessAllowedEmails().has("admin@example.com")).toBe(true);
    expect(adminAccessIdentityAllowed(headers)).toBe(true);
    headers.delete("cf-access-jwt-assertion");
    expect(adminAccessIdentityAllowed(headers)).toBe(false);
  });
  it("rejects identities outside the explicit allowlist",()=>{
    process.env.ADMIN_ACCESS_ALLOWED_EMAILS="admin@example.com";
    const headers=new Headers({
      "cf-access-authenticated-user-email":"attacker@example.com",
      "cf-access-jwt-assertion":"assertion"
    });
    expect(adminAccessIdentityAllowed(headers)).toBe(false);
  });
});

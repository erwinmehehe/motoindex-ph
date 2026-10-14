import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "../app/admin/affiliate-links/research.csv/route";

function request() {
  return new Request("https://motoindexph.com/admin/affiliate-links/research.csv");
}

afterEach(() => vi.unstubAllEnvs());

describe("admin-only affiliate research export", () => {
  it("fails closed in production when Basic auth is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_ACCESS_MODE", "basic");
    const response = await GET(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(await response.text()).not.toContain("candidate_pending_browser_qa");
  });

  it("denies a request without a signed Access identity", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_ACCESS_MODE", "cloudflare");
    vi.stubEnv("CF_ACCESS_TEAM_DOMAIN", "motoindex-test.cloudflareaccess.com");
    vi.stubEnv("CF_ACCESS_AUD", "test-audience");
    vi.stubEnv("ADMIN_ACCESS_EMAILS", "admin@example.com");
    const response = await GET(request());
    expect(response.status).toBe(403);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(await response.text()).not.toContain("candidate_pending_browser_qa");
  });

  it("generates an inert non-affiliate research CSV in the local test harness", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
    const csv = await response.text();
    expect(csv).toContain('"productId","category","brand","model"');
    expect(csv).toContain("candidate_pending_browser_qa");
    expect(csv).toContain("needs_exact_item_research");
    expect(csv).not.toContain("invl.me/");
  });
});

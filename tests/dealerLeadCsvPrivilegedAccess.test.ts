import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  verify: vi.fn(),
  leadFind: vi.fn(),
}));

vi.mock("@/lib/cloudflareAccess", () => ({
  cloudflareAccessConfigured: mocks.configured,
  verifyCloudflareAccess: mocks.verify,
}));
vi.mock("@/lib/db", () => ({
  databaseConfigured: () => true,
  prisma: { dealerLead: { findMany: mocks.leadFind } },
}));

import { GET as exportDealerLeads } from "../app/api/admin/dealer-leads/export/route";

const request = () => new Request("https://motoindexph.com/api/admin/dealer-leads/export");

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("ADMIN_ACCESS_MODE", "cloudflare");
  mocks.configured.mockReturnValue(true);
  mocks.verify.mockResolvedValue({ ok: false });
});
afterEach(() => vi.unstubAllEnvs());

describe("dealer lead CSV fails closed independently of middleware", () => {
  it("rejects missing Cloudflare runtime configuration before accessing the DB", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await exportDealerLeads(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.verify).not.toHaveBeenCalled();
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("rejects production Basic Auth even when a Basic credential is present", async () => {
    vi.stubEnv("ADMIN_ACCESS_MODE", "basic");
    const response = await exportDealerLeads(new Request(request().url, { headers: { authorization: "Basic dGVzdDp0ZXN0" } }));
    expect(response.status).toBe(503);
    expect(mocks.verify).not.toHaveBeenCalled();
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("blocks unauthorized request without querying PII", async () => {
    const response = await exportDealerLeads(request());
    expect(response.status).toBe(403);
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("fails closed when Access signature verification throws", async () => {
    mocks.verify.mockRejectedValue(new Error("JWKS unavailable"));
    const response = await exportDealerLeads(request());
    expect(response.status).toBe(503);
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("exports formula-safe CSV only after a valid signed identity", async () => {
    mocks.verify.mockResolvedValue({ ok: true, email: "authorized@example.com" });
    mocks.leadFind.mockResolvedValue([{
      createdAt: new Date("2026-10-01T00:00:00Z"),
      status: "matched", make: "Honda", model: "Click", variant: null,
      cityProvince: "Pampanga", purchaseType: "cash", downPaymentBudget: null,
      fullName: "\t=HYPERLINK(1,2)", mobile: "09171234567", email: "buyer@example.com",
      matchedSellerSlugs: ["test-dealer"], sourcePath: "/get-quote/honda/click",
      deliveries: [],
    }]);
    const response = await exportDealerLeads(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const csv = await response.text();
    expect(csv).toContain('"' + "'" + '\t=HYPERLINK(1,2)"');
    expect(csv).not.toContain('"=HYPERLINK');
    expect(mocks.leadFind).toHaveBeenCalledTimes(1);
  });
});

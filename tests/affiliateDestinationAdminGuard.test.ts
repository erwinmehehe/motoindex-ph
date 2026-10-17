import { afterEach, describe, expect, it, vi } from "vitest";
import { PUT, DELETE } from "../app/api/admin/affiliate-links/[productId]/route";
import { POST } from "../app/api/admin/affiliate-links/bulk/route";

const dbMocks = vi.hoisted(() => ({
  configured: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
  upsert: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  databaseConfigured: dbMocks.configured,
  prisma: {
    affiliateProductLink: {
      findUnique: dbMocks.findUnique,
      findFirst: dbMocks.findFirst,
      findMany: dbMocks.findMany,
      update: dbMocks.update,
      upsert: dbMocks.upsert,
      create: dbMocks.create,
      delete: dbMocks.remove,
    },
    $transaction: dbMocks.transaction,
  },
}));

const params = { params: Promise.resolve({ productId: "gille-kerena-ff007" }) };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("affiliate destination admin write authorization", () => {
  it("fails closed in production before bulk activating anything without Access", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_ACCESS_MODE", "basic");
    const request = new Request("https://motoindexph.com/api/admin/affiliate-links/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: [{ productId: "gille-kerena-ff007", url: "https://invl.me/example" }] }),
    });
    const response = await POST(request);
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(dbMocks.configured).not.toHaveBeenCalled();
    expect(dbMocks.transaction).not.toHaveBeenCalled();
  });

  it("blocks single-item activation without a valid signed Access identity", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_ACCESS_MODE", "cloudflare");
    vi.stubEnv("CF_ACCESS_TEAM_DOMAIN", "motoindex-test.cloudflareaccess.com");
    vi.stubEnv("CF_ACCESS_AUD", "test-audience");
    vi.stubEnv("ADMIN_ACCESS_EMAILS", "admin@example.com");
    const request = new Request("https://motoindexph.com/api/admin/affiliate-links/gille-kerena-ff007", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active", url: "https://invl.me/example", destinationUrl: "https://shopee.ph/product/123/456", reviewNote: "Not yet approved." }),
    });
    const response = await PUT(request, params);
    expect(response.status).toBe(403);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(dbMocks.configured).not.toHaveBeenCalled();
    expect(dbMocks.upsert).not.toHaveBeenCalled();
  });

  it("blocks unauthorized delete before querying a product", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_ACCESS_MODE", "basic");
    const request = new Request("https://motoindexph.com/api/admin/affiliate-links/gille-kerena-ff007", { method: "DELETE" });
    const response = await DELETE(request, params);
    expect(response.status).toBe(503);
    expect(dbMocks.findUnique).not.toHaveBeenCalled();
    expect(dbMocks.remove).not.toHaveBeenCalled();
  });
});

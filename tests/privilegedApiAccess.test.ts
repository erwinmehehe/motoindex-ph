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

import { requirePrivilegedApiAccess } from "../lib/privilegedApiAccess";
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

describe("server-side privileged API gate", () => {
  it("fails closed when Cloudflare Access is unconfigured", async () => {
    mocks.configured.mockReturnValue(false);
    const result = await requirePrivilegedApiAccess(request());
    expect(result?.status).toBe(503);
    expect(result?.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.verify).not.toHaveBeenCalled();
  });

  it("rejects production Basic Auth even if an Access environment exists", async () => {
    vi.stubEnv("ADMIN_ACCESS_MODE", "basic");
    const result = await requirePrivilegedApiAccess(request());
    expect(result?.status).toBe(503);
    expect(mocks.verify).not.toHaveBeenCalled();
  });

  it("rejects an unsigned or unauthorized request without exposing personal records", async () => {
    const result = await exportDealerLeads(request());
    expect(result.status).toBe(403);
    expect(result.headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("does not allow database access if token verification fails unexpectedly", async () => {
    mocks.verify.mockRejectedValue(new Error("JWKS unavailable"));
    const result = await exportDealerLeads(request());
    expect(result.status).toBe(503);
    expect(mocks.leadFind).not.toHaveBeenCalled();
  });

  it("allows a valid signed identity past the redundant API gate", async () => {
    mocks.verify.mockResolvedValue({ ok: true, email: "admin@example.com" });
    await expect(requirePrivilegedApiAccess(request())).resolves.toBeNull();
  });

  it("keeps local and test-only route authorization with middleware unchanged", async () => {
    vi.stubEnv("NODE_ENV", "test");
    await expect(requirePrivilegedApiAccess(request())).resolves.toBeNull();
    expect(mocks.verify).not.toHaveBeenCalled();
  });
});

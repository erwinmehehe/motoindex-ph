import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  verify: vi.fn(),
  leadFind: vi.fn(),
  batchFind: vi.fn(),
}));

vi.mock("@/lib/cloudflareAccess", () => ({
  cloudflareAccessConfigured: mocks.configured,
  verifyCloudflareAccess: mocks.verify,
}));
vi.mock("@/lib/db", () => ({
  databaseConfigured: () => true,
  prisma: { dealerLead: { findMany: mocks.leadFind } },
}));

vi.mock("@/lib/persistentOffers", () => ({
  listImportBatches: mocks.batchFind,
}));

import { requirePrivilegedApiAccess } from "../lib/privilegedApiAccess";
import { GET as listIngestionBatches } from "../app/api/ingestion/batches/route";
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

  it("does not expose import staging records without production Access authorization", async () => {
    const result = await listIngestionBatches(new Request("https://motoindexph.com/api/ingestion/batches"));
    expect(result.status).toBe(403);
    expect(mocks.batchFind).not.toHaveBeenCalled();
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

  it("returns a protected CSV with formula-safe buyer and dealer text after signed Access verification", async () => {
    mocks.verify.mockResolvedValue({ ok: true, email: "admin@example.com" });
    mocks.leadFind.mockResolvedValue([{
      createdAt: new Date("2026-10-01T00:00:00Z"),
      status: "matched", make: "Honda", model: "Click", variant: null,
      cityProvince: "Pampanga", purchaseType: "cash", downPaymentBudget: null,
      fullName: "\t=HYPERLINK(1,2)", mobile: "09171234567",
      email: "buyer@example.com", matchedSellerSlugs: ["test-dealer"],
      sourcePath: "/get-quote/honda/click",
      deliveries: [{
        sellerName: "  +malicious", sellerSlug: "test-dealer",
        dealerEmail: "dealer@example.com", status: "queued",
        sharedAt: null, openedAt: null, expiresAt: null,
        quoteResponse: { dealerNote: "@SUM(1,2)", submittedAt: null,
          cashPricePhp: null, downPaymentPhp: null, monthlyPhp: null,
          termMonths: null, availability: null, validUntil: null },
      }],
    }]);
    const result = await exportDealerLeads(request());
    expect(result.status).toBe(200);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
    expect(result.headers.get("Content-Type")).toContain("text/csv");
    const csv = await result.text();
    expect(csv).toContain('"\'\t=HYPERLINK(1,2)"');
    expect(csv).toContain('"\'  +malicious"');
    expect(csv).toContain('"\'@SUM(1,2)"');
    expect(csv).toContain('"Honda"');
    expect(csv).not.toContain('"=HYPERLINK');
    expect(mocks.leadFind).toHaveBeenCalledTimes(1);
  });

  it("keeps local and test-only route authorization with middleware unchanged", async () => {
    vi.stubEnv("NODE_ENV", "test");
    await expect(requirePrivilegedApiAccess(request())).resolves.toBeNull();
    expect(mocks.verify).not.toHaveBeenCalled();
  });
});

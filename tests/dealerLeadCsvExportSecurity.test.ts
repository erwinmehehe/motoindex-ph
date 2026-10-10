import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/db", () => ({
  databaseConfigured: () => true,
  prisma: { dealerLead: { findMany: mocks.findMany } },
}));
import { GET } from "../app/api/admin/dealer-leads/export/route";

beforeEach(() => vi.clearAllMocks());

describe("dealer lead CSV export", () => {
  it("neutralizes user-controlled spreadsheet formulas while preserving ordinary text", async () => {
    mocks.findMany.mockResolvedValue([{
      createdAt: new Date("2026-10-01T00:00:00Z"),
      status: "new",
      make: "Honda",
      model: "Click",
      variant: null,
      cityProvince: "Pampanga",
      purchaseType: "cash",
      downPaymentBudget: null,
      fullName: "=HYPERLINK(\"https://example.invalid\",\"Click\")",
      mobile: "09171234567",
      email: "buyer@example.com",
      matchedSellerSlugs: [],
      sourcePath: "/get-quote/honda/click",
      deliveries: [],
    }]);
    const response = await GET();
    expect(response.status).toBe(200);
    const csv = await response.text();
    expect(csv).toContain("\"'=HYPERLINK");
    expect(csv).toContain("\"Honda\"");
    expect(csv).not.toContain("\"=HYPERLINK");
  });
});

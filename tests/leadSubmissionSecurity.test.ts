import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  leadFind: vi.fn(),
  leadUpdate: vi.fn(),
  leadCreate: vi.fn(),
  deliveryCreateMany: vi.fn(),
  matchDealers: vi.fn(),
  getOwnerSession: vi.fn(),
  token: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  databaseConfigured: () => true,
  prisma: {
    dealerLead: {
      findFirst: mocks.leadFind,
      update: mocks.leadUpdate,
      create: mocks.leadCreate,
    },
    dealerLeadDelivery: { createMany: mocks.deliveryCreateMany },
  },
}));
vi.mock("@/lib/data", () => ({
  getModelById: () => ({
    id: "honda-click", make: "Honda", model: "Click",
    makeSlug: "honda", slug: "click", marketStatus: "current",
  }),
}));
vi.mock("@/lib/persistentSellers", () => ({
  matchQuoteEligibleDealers: mocks.matchDealers,
}));
vi.mock("@/lib/actionTokens", () => ({
  actionToken: mocks.token,
  hashActionToken: (value: string) => "hash:" + value,
}));
vi.mock("@/lib/ownerAuth", () => ({ getOwnerSession: mocks.getOwnerSession }));

import { POST } from "../app/api/leads/route";

const leadInput = {
  modelId: "honda-click",
  cityProvince: "Pampanga",
  purchaseType: "cash",
  fullName: "Buyer Test",
  mobile: "09171234567",
  email: "buyer@example.com",
  consent: true,
};

function request() {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leadInput),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getOwnerSession.mockResolvedValue(null);
  mocks.matchDealers.mockResolvedValue([]);
  mocks.token.mockReturnValue("private-quote-access-token");
  mocks.leadCreate.mockResolvedValue({ id: "lead-new" });
});

describe("buyer private quote access", () => {
  it("does not replace or disclose the existing lead token for an unauthenticated duplicate", async () => {
    mocks.leadFind.mockResolvedValue({
      id: "lead-existing",
      matchedSellerSlugs: ["seller-1"],
    });
    const response = await POST(request());
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body).not.toHaveProperty("statusPath");
    expect(body).not.toHaveProperty("leadId");
    expect(mocks.leadUpdate).not.toHaveBeenCalled();
    expect(mocks.leadCreate).not.toHaveBeenCalled();
    expect(mocks.token).not.toHaveBeenCalled();
  });

  it("issues a hashed private status token only for a new lead", async () => {
    mocks.leadFind.mockResolvedValue(null);
    const response = await POST(request());
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.statusPath).toBe("/quote-status/private-quote-access-token");
    expect(mocks.leadCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        buyerAccessToken: null,
        buyerAccessTokenHash: "hash:private-quote-access-token",
      }),
    });
  });
});

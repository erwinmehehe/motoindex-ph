import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getOwnerSession: vi.fn(),
  match: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  createMany: vi.fn(),
  challenge: vi.fn(),
  token: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  databaseConfigured: () => true,
  prisma: {
    dealerLead: {
      findFirst: mocks.findFirst,
      create: mocks.create,
      update: mocks.update,
    },
    dealerLeadDelivery: { createMany: mocks.createMany },
  },
}));
vi.mock("@/lib/data", () => ({
  getModelById: (id: string) =>
    id === "aerox-v3" ? { id, make: "Yamaha", model: "Aerox V3", makeSlug: "yamaha", slug: "aerox-v3", marketStatus: "current" } : undefined,
}));
vi.mock("@/lib/persistentSellers", () => ({ matchQuoteEligibleDealers: mocks.match }));
vi.mock("@/lib/actionTokens", () => ({
  actionToken: mocks.token,
  hashActionToken: (value: string) => "hash:" + value,
}));
vi.mock("@/lib/publicFormChallenge", () => ({ verifyPublicFormChallenge: mocks.challenge }));
vi.mock("@/lib/ownerAuth", () => ({
  getOwnerSession: mocks.getOwnerSession,
  ownerRequestOriginAllowed: (request: Request) => {
    const origin = request.headers.get("origin");
    return !origin || origin === new URL(request.url).origin;
  },
}));

import { POST } from "../app/api/leads/route";

function request(origin = "https://motoindexph.com") {
  return new Request("https://motoindexph.com/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({
      modelId: "aerox-v3",
      fullName: "Sample Buyer",
      mobile: "09171234567",
      cityProvince: "Makati City",
      purchaseType: "cash",
      consent: true,
    }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getOwnerSession.mockResolvedValue(null);
  mocks.match.mockResolvedValue([]);
  mocks.findFirst.mockResolvedValue(null);
  mocks.create.mockResolvedValue({ id: "lead-created" });
  mocks.token.mockReturnValue("private-quote-token");
  mocks.challenge.mockResolvedValue({ ok: true });
});

describe("public dealer lead protections", () => {
  it("rejects a cross-origin request before processing buyer data", async () => {
    const result = await POST(request("https://attacker.example"));
    expect(result.status).toBe(403);
    expect(mocks.match).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not store a buyer's contact data without an approved matching dealer", async () => {
    const result = await POST(request());
    expect(result.status).toBe(422);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.createMany).not.toHaveBeenCalled();
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.token).not.toHaveBeenCalled();
  });

  it("does not replace or disclose an existing private quote-status token on duplicate submission", async () => {
    mocks.match.mockResolvedValue([{ slug: "test-dealer", leadEmail: "dealer@example.com" }]);
    mocks.findFirst.mockResolvedValue({ id: "existing-lead-1" });
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
    expect(result.headers.get("Referrer-Policy")).toBe("no-referrer");
    const body = await result.json();
    expect(body.ok).toBe(true);
    expect(body).not.toHaveProperty("statusPath");
    expect(body).not.toHaveProperty("leadId");
    expect(body).not.toHaveProperty("matchedDealers");
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.createMany).not.toHaveBeenCalled();
    expect(mocks.token).not.toHaveBeenCalled();
  });
  
  it("issues a new private link only to the submitting browser and stores its hash", async () => {
    mocks.match.mockResolvedValue([{ slug: "test-dealer", name: "Test Dealer", leadEmail: "dealer@example.com" }]);
    const result = await POST(request());
    expect(result.status).toBe(201);
    expect(result.headers.get("Cache-Control")).toBe("no-store");
    expect(result.headers.get("Referrer-Policy")).toBe("no-referrer");
    const body = await result.json();
    expect(body.statusPath).toBe("/quote-status/private-quote-token");
    expect(body.leadId).toBe("lead-created");
    expect(mocks.challenge).toHaveBeenCalledWith(undefined, "buyer_quote");
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        buyerAccessToken: null,
        buyerAccessTokenHash: "hash:private-quote-token",
        ownerId: null,
      }),
    });
    expect(mocks.createMany).toHaveBeenCalledTimes(1);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("rejects failed bot verification before checking dealer coverage or saving a lead", async () => {
    mocks.challenge.mockResolvedValue({ ok: false, status: 403, error: "Invalid challenge." });
    const result = await POST(request());
    expect(result.status).toBe(403);
    expect(mocks.match).not.toHaveBeenCalled();
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.token).not.toHaveBeenCalled();
  });
});

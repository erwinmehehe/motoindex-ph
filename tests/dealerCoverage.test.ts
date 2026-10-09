import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ match: vi.fn() }));
vi.mock("@/lib/db", () => ({ databaseConfigured: () => true }));
vi.mock("@/lib/persistentSellers", () => ({ matchQuoteEligibleDealers: mocks.match }));
vi.mock("@/lib/ownerAuth", () => ({ ownerRequestOriginAllowed: (request: Request) => !request.headers.get("origin") || request.headers.get("origin") === new URL(request.url).origin }));

import { POST } from "../app/api/dealer-coverage/route";

function request(cityProvince = "Makati", origin = "https://motoindexph.com") {
  return new Request("https://motoindexph.com/api/dealer-coverage", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ make: "Yamaha", cityProvince })
  });
}

beforeEach(() => { vi.clearAllMocks(); mocks.match.mockResolvedValue([]); });

describe("dealer coverage precheck", () => {
  it("rejects invalid location without querying internal dealer routing", async () => {
    const response = await POST(request(""));
    expect(response.status).toBe(400);
    expect(mocks.match).not.toHaveBeenCalled();
  });

  it("does not suggest coverage when there is no eligible partner", async () => {
    const response = await POST(request());
    expect(await response.json()).toEqual({ ok: true, available: false });
  });

  it("returns availability without disclosing private dealer contact information", async () => {
    mocks.match.mockResolvedValue([{ slug: "partner-1", leadEmail: "private@example.com" }]);
    const response = await POST(request());
    expect(await response.json()).toEqual({ ok: true, available: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("rejects a cross-origin coverage query", async () => {
    const response = await POST(request("Makati", "https://other.example"));
    expect(response.status).toBe(403);
    expect(mocks.match).not.toHaveBeenCalled();
  });

});

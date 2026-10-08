import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ match: vi.fn() }));
vi.mock("@/lib/db", () => ({ databaseConfigured: () => true }));
vi.mock("@/lib/persistentSellers", () => ({ matchQuoteEligibleDealers: mocks.match }));

import { GET } from "../app/api/dealer-coverage/route";

beforeEach(() => { vi.clearAllMocks(); mocks.match.mockResolvedValue([]); });

describe("dealer coverage precheck", () => {
  it("rejects invalid location without querying internal dealer routing", async () => {
    const response = await GET(new Request("https://motoindexph.com/api/dealer-coverage?make=Yamaha"));
    expect(response.status).toBe(400);
    expect(mocks.match).not.toHaveBeenCalled();
  });

  it("does not suggest coverage when there is no eligible partner", async () => {
    const response = await GET(new Request("https://motoindexph.com/api/dealer-coverage?make=Yamaha&cityProvince=Makati"));
    expect(await response.json()).toEqual({ ok: true, available: false });
  });

  it("returns availability without disclosing private dealer contact information", async () => {
    mocks.match.mockResolvedValue([{ slug: "partner-1", leadEmail: "private@example.com" }]);
    const response = await GET(new Request("https://motoindexph.com/api/dealer-coverage?make=Yamaha&cityProvince=Makati"));
    expect(await response.json()).toEqual({ ok: true, available: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

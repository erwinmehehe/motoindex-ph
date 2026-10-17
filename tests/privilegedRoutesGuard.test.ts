import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const protectedRoutes = [
  "app/api/admin/affiliate-links/[productId]/route.ts",
  "app/api/admin/affiliate-links/bulk/route.ts",
  "app/api/admin/dealer-applications/[id]/route.ts",
  "app/api/admin/dealer-leads/[id]/deliveries/[deliveryId]/route.ts",
  "app/api/admin/dealer-leads/[id]/route.ts",
  "app/api/admin/owner-reviews/[id]/route.ts",
  "app/api/admin/price-alerts/run/route.ts",
  "app/api/admin/used-listings/[id]/route.ts",
  "app/api/ingestion/batches/[id]/publish/route.ts",
  "app/api/ingestion/batches/[id]/review/route.ts",
  "app/api/ingestion/batches/route.ts",
  "app/api/ingestion/expire/route.ts",
  "app/api/ingestion/stage/route.ts",
  "app/api/ingestion/validate/route.ts",
] as const;

describe("privileged routes fail closed even if middleware is bypassed", () => {
  for (const route of protectedRoutes) {
    it(route, () => {
      const source = readFileSync(new URL("../" + route, import.meta.url), "utf8");
      expect(source).toContain('import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess"');
      const methodCount = [...source.matchAll(/export async function (?:GET|POST|PUT|PATCH|DELETE)\(/g)].length;
      const guardCount = [...source.matchAll(/const denied = await requirePrivilegedApiAccess\(/g)].length;
      expect(methodCount).toBeGreaterThan(0);
      expect(guardCount).toBe(methodCount);
      for (const method of source.matchAll(/export async function (?:GET|POST|PUT|PATCH|DELETE)\(/g)) {
        expect(source.slice(method.index, method.index + 400)).toMatch(
          /const denied = await requirePrivilegedApiAccess\((?:request|req|_req|_request)\);\s*if \(denied\) return denied;/
        );
      }
    });
  }

  it("does not fall back to administrative Basic Auth in production", () => {
    const source = readFileSync(new URL("../middleware.ts", import.meta.url), "utf8");
    expect(source).toContain('process.env.NODE_ENV === "production" ? "cloudflare" : "basic"');
    expect(source).toContain('process.env.NODE_ENV === "production" && accessMode === "basic"');
  });
});

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  verify: vi.fn(),
  batches: vi.fn(),
  stage: vi.fn(),
}));
vi.mock("@/lib/cloudflareAccess", () => ({
  cloudflareAccessConfigured: mocks.configured,
  verifyCloudflareAccess: mocks.verify,
}));
vi.mock("@/lib/persistentOffers", () => ({
  listImportBatches: mocks.batches,
  stageOfferBatch: mocks.stage,
}));
vi.mock("@/lib/db", () => ({ databaseConfigured: () => true }));

import { GET as listBatches } from "../app/api/ingestion/batches/route";
import { POST as stageBatch } from "../app/api/ingestion/stage/route";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("ADMIN_ACCESS_MODE", "cloudflare");
  mocks.configured.mockReturnValue(true);
  mocks.verify.mockResolvedValue({ ok: false });
});
afterEach(() => vi.unstubAllEnvs());

describe("ingestion request authorization", () => {
  it("prevents anonymous reads of private batches", async () => {
    const response = await listBatches(new Request("https://motoindexph.com/api/ingestion/batches"));
    expect(response.status).toBe(403);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.batches).not.toHaveBeenCalled();
  });

  it("prevents unauthorized staging before even parsing the request body", async () => {
    const response = await stageBatch(new Request("https://motoindexph.com/api/ingestion/stage", {
      method: "POST", body: "{invalid",
    }));
    expect(response.status).toBe(403);
    expect(mocks.stage).not.toHaveBeenCalled();
  });

  it("fails closed without configured Access or when identity verification throws", async () => {
    mocks.configured.mockReturnValue(false);
    expect((await listBatches(new Request("https://motoindexph.com/api/ingestion/batches"))).status).toBe(503);
    mocks.configured.mockReturnValue(true);
    mocks.verify.mockRejectedValue(new Error("JWKS unavailable"));
    expect((await listBatches(new Request("https://motoindexph.com/api/ingestion/batches"))).status).toBe(503);
    expect(mocks.batches).not.toHaveBeenCalled();
  });
});

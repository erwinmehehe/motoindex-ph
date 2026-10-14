import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../prisma/migrations/20261009120000_add_affiliate_exact_destination/migration.sql", import.meta.url),
  "utf8"
);
const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const adminSingle = readFileSync(
  new URL("../app/api/admin/affiliate-links/[productId]/route.ts", import.meta.url), "utf8"
);
const adminBulk = readFileSync(
  new URL("../app/api/admin/affiliate-links/bulk/route.ts", import.meta.url), "utf8"
);

describe("exact-item affiliate destination rollout contract", () => {
  it("uses only an additive, nullable migration for legacy link records", () => {
    expect(migration).toMatch(/ALTER TABLE "AffiliateProductLink" ADD COLUMN "destinationUrl" TEXT;/);
    expect(migration).not.toMatch(/DROP (TABLE|COLUMN)|TRUNCATE|DELETE FROM/i);
    expect(schema).toMatch(/model AffiliateProductLink\s*\{[\s\S]*?destinationUrl\s+String\?/);
  });

  it("guards both affiliate admin mutation surfaces before database access", () => {
    for (const source of [adminSingle, adminBulk]) {
      expect(source).toContain("requirePrivilegedApiAccess");
      expect(source.indexOf("const denied = await requirePrivilegedApiAccess(request)"))
        .toBeGreaterThan(source.indexOf("export async function"));
      expect(source.indexOf("const denied = await requirePrivilegedApiAccess(request)"))
        .toBeLessThan(source.indexOf("if(!databaseConfigured())"));
    }
    expect(adminSingle).toContain('export async function DELETE(request:Request');
  });
});

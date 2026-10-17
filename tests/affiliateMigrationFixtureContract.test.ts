import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const fixture = (name: string) =>
  readFileSync(new URL(`../scripts/sql/${name}`, import.meta.url), "utf8");

const before = fixture("affiliate-destination-pre-migration.sql");
const after = fixture("affiliate-destination-post-migration.sql");
const migration = readFileSync(
  new URL("../prisma/migrations/20261009120000_add_affiliate_exact_destination/migration.sql", import.meta.url),
  "utf8"
);

describe("isolated PostgreSQL affiliate migration evidence fixtures", () => {
  it("declares only an additive nullable change", () => {
    expect(migration).toMatch(/ALTER TABLE "AffiliateProductLink" ADD COLUMN "destinationUrl" TEXT;/);
    expect(migration).not.toMatch(/DROP\s+(TABLE|COLUMN)|TRUNCATE|DELETE\s+FROM/i);
  });

  it("starts with a representative legacy record before the column exists", () => {
    expect(before).toContain('to_regclass(\'public."AffiliateProductLink"\')');
    expect(before).toContain('column_name = \'destinationUrl\'');
    expect(before).toMatch(/INSERT\s+INTO\s+"AffiliateProductLink"/);
    expect(before).toContain("'ci-legacy-product'");
    expect(before).toContain("Disposable CI fixture");
  });

  it("asserts a nullable column, unchanged legacy link, and new exact URL", () => {
    expect(after).toContain("nullable_flag IS DISTINCT FROM 'YES'");
    expect(after).toContain("legacy_destination IS NOT NULL");
    expect(after).toContain("Legacy tracked URL was lost or changed");
    expect(after).toContain("'ci-new-product'");
    expect(after).toContain("Exact destination was not persisted");
  });

  it("does not contain real project database URLs or credentials", () => {
    const combined = before + after;
    expect(combined).not.toMatch(/postgres(?:ql)?:\/\//i);
    expect(combined).not.toContain("DATABASE_URL");
  });
});

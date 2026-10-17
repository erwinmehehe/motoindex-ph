import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(readFileSync(new URL("../scripts/data/motorcycle-image-closeout-20261008.json", import.meta.url), "utf8"));
const importer = readFileSync(new URL("../scripts/localize-motorcycle-closeout.mjs", import.meta.url), "utf8");

describe("unlicensed motorcycle candidates stay out of release images", () => {
  it("retains 20 independent candidate references, without implicit authorization", () => {
    expect(manifest.candidates).toHaveLength(20);
    expect(new Set(manifest.candidates.map((c: { entityId: string }) => c.entityId)).size).toBe(20);
    expect(manifest.pipelineReady).toBe(false);
    expect(manifest.approved).toEqual([]);
  });

  it("has no added binaries for unresolved candidates", () => {
    const permitted = new Set<string>((manifest.approved as Array<{entityId:string}>).map((row) => row.entityId));
    for (const candidate of manifest.candidates as Array<{entityId:string}>) {
      if (!permitted.has(candidate.entityId)) {
        expect(existsSync(resolve("public/media/motorcycles", candidate.entityId + ".webp"))).toBe(false);
      }
    }
  });

  it("requires explicit commercial, hosting, redistribution, derivative and model-visual approval before downloads", () => {
    for (const assertion of [
      "rights.commercialUse !== true", "rights.hosting !== true",
      "rights.derivativeWorks !== true", "rights.redistribution !== true",
      "rights.exactModelVisuallyVerified !== true",
      'rightsStatus: "licensed"',
      "if (!approved.length)"
    ]) {
      expect(importer).toContain(assertion);
    }
    expect(importer).not.toContain("for (const item of manifest.accepted)");
  });
});

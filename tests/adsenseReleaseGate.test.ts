import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

describe("AdSense account, consent and release contracts", () => {
  it("preserves the existing publisher references while requiring explicit activation", () => {
    const config = read("lib/adsense.ts");
    expect(config).toContain('process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(config).toContain('process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"');
    const workflow = read(".github/workflows/cloudflare-production-deploy.yml");
    expect(workflow).not.toContain("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED:");
    expect(config).toContain('pub-1900865456140693');
    expect(config).toContain('ca-pub-1900865456140693');
  });
  it("preserves the verified document-head bootstrap requirement", () => {
    const component = read("components/AdSense.tsx");
    expect(component).toContain("adsenseEnabled()");
    expect(component).toContain('strategy="beforeInteractive"');
  });
  it("documents private-route and consent QA as mandatory before activating global scripts", () => {
    const doc = read("docs/adsense-safe-release.md");
    expect(doc.toLowerCase()).toContain("private routes");
    expect(doc).toContain("consent");
    expect(read(".env.example")).toContain("NEXT_PUBLIC_ADSENSE_ENABLED=false");
  });
});

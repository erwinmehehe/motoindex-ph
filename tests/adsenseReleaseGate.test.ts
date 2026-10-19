import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

describe("AdSense account, consent and release contracts", () => {
  it("preserves the existing publisher references while requiring explicit activation", () => {
    const config = read("lib/adsense.ts");
    expect(config).toContain('process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(config).toContain('process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"');
    const workflow = read(".github/workflows/cloudflare-production-deploy.yml");
    expect(workflow).toContain("vars.MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED || 'false'");
    expect(config).toContain('pub-1900865456140693');
    expect(config).toContain('ca-pub-1900865456140693');
  });
  it("fails deployment preflight if AdSense is enabled without privacy-release approval", () => {
    const preflight = read("scripts/check-launch.mjs");
    expect(preflight).toContain('process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(preflight).toContain('process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED !== "true"');
    expect(preflight).toContain("failures.push(\"AdSense release is blocked under #466:");
  });

  it("requires guide-scoped nonce bootstrap and no global AdSense loader", () => {
    const component = read("components/AdSense.tsx");
    expect(component).toContain("adsenseEnabled()");
    expect(component).toContain('strategy="afterInteractive"');
    expect(component).toContain("nonce={nonce}");
    expect(read("app/layout.tsx")).not.toContain("<AdSense/>");
    expect(read("app/guides/[slug]/page.tsx")).toContain("<AdSense nonce={adNonce} />");
  });
  it("documents private-route and consent QA as mandatory before activating advertising scripts", () => {
    const doc = read("docs/adsense-safe-release.md");
    expect(doc.toLowerCase()).toContain("private routes");
    expect(doc).toContain("consent");
    expect(read(".env.example")).toContain("NEXT_PUBLIC_ADSENSE_ENABLED=false");
  });
});

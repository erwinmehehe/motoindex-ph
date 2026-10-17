import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

describe("AdSense disclosure and privacy release contracts", () => {
  it("requires a real operator opt-in and no hardcoded fallback", () => {
    const source = read("lib/adsense.ts");
    expect(source).toContain('process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"');
    expect(source).not.toContain("defaultPublisherId");
    expect(source).not.toContain("defaultClientId");
  });
  it("does not load AdSense when arriving directly on a private page", () => {
    const component = read("components/AdSense.tsx");
    expect(component).toContain("publicAnalyticsAllowed(pathname)");
    expect(component).toContain('strategy="afterInteractive"');
  });
  it("keeps the documented default disabled", () => {
    expect(read(".env.example")).toContain("NEXT_PUBLIC_ADSENSE_ENABLED=false");
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

describe("manual MotoIndex guide ad unit", () => {
  it("uses the approved publisher's exact ad slot without duplicating the Google loader", () => {
    const source = read("components/GuideInContentAd.tsx");
    expect(source).toContain('const AD_CLIENT = "ca-pub-1900865456140693"');
    expect(source).toContain('const AD_SLOT = "6431580274"');
    expect(source).toContain('data-ad-format="auto"');
    expect(source).toContain('data-full-width-responsive="true"');
    expect(source).not.toContain("pagead2.googlesyndication.com");
  });

  it("requires the existing explicit AdSense opt-in and matches the slot's publisher", () => {
    const source = read("components/GuideInContentAd.tsx");
    expect(source).toContain("adsenseEnabled() && adsenseClientId() === AD_CLIENT");
    expect(source).toContain("if (!enabled) return null");
    expect(source).toContain("dataset.motoindexAdRequested");
  });

  it("appears once after the second body section on editorial guide pages only", () => {
    const guide = read("app/guides/[slug]/page.tsx");
    const root = read("app/layout.tsx");
    expect(guide).toContain('index === 1 && <GuideInContentAd />');
    expect((guide.match(/<GuideInContentAd \/>/g) || []).length).toBe(1);
    expect(root).not.toContain("GuideInContentAd");
  });
});

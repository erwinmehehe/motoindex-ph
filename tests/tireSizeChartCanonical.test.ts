import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tireHub = readFileSync(new URL("../app/tires/page.tsx", import.meta.url), "utf8");
const tireGuideRouter = readFileSync(new URL("../app/tires/[slug]/page.tsx", import.meta.url), "utf8");

describe("canonical motorcycle tire-size chart", () => {
  it("keeps the motorcycle tire-size chart intent on the indexable /tires page", () => {
    expect(tireHub).toContain('path: "/tires"');
    expect(tireHub).toContain("index: true");
    expect(tireHub).toContain('id="size-chart"');
    expect(tireHub).toContain("How to read motorcycle tire sizes and sidewall markings");
    expect(tireGuideRouter).toContain('const chartSlug = "motorcycle-tire-size-chart"');
    expect(tireGuideRouter).toContain('permanentRedirect("/tires#size-chart")');
  });

  it("teaches full motorcycle sidewall markings with verified manufacturer sources", () => {
    expect(tireHub).toContain("90/90-14 M/C 46P TL");
    for (const part of ['part:"M/C"', 'part:"46"', 'part:"P"', 'part:"TL"']) {
      expect(tireHub).toContain(part);
    }
    expect(tireHub).toContain('DataTable label="Meaning of each motorcycle tire size marking"');
    expect(tireHub).toContain("michelin.com.ph/motorbike/advice-motorbike/tire-basics/motorcycle-tire-size");
    expect(tireHub).toContain("pirelli.com/tyres/en-ww/motorcycle/tyre-reading");
    expect(tireHub).toContain("bridgestone.com/en-us/learn/motorcycle/tire-maintenance/motorcycle-tire-safety-and-maintenance-manual");
  });

  it("retains exact-model and tire-family fitment links rather than new keyword alias pages", () => {
    expect(tireHub).toContain('href="/tires/aerox-tire-size"');
    expect(tireHub).toContain('href="/tires/nmax-tire-size"');
    expect(tireHub).toContain('href="/tires/honda-click-tire-size"');
    expect(tireHub).toContain('href="/fitment"');
    expect(tireHub).toContain("It is an example for learning the code, not a recommended fitment");
  });
});

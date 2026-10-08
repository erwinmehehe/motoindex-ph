import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { getRenderableMedia } from "../lib/renderableMedia";

describe("helmet image format", () => {
  it.each([
    "hjc-f71",
    "bell-eliminator",
    "agv-k7",
    "agv-tourmodular",
    "alpinestars-supertech-m8",
    "hjc-rpha-91",
    "arai-quantic",
    "arai-tour-x5",
    "arai-rx-7v-evo",
  ])("has exact media for %s", (id) => {
    const media = getRenderableMedia("helmet", id)[0];
    expect(media).toBeDefined();
    expect(media.src).not.toContain("/placeholders/");
    expect(media.width).toBe(1200);
    expect(media.height).toBe(1200);
  });

  it.each([
    "yamaha-yzf-r6",
    "kawasaki-ninja-250sl",
    "suzuki-gsx-r150",
    "suzuki-hayabusa",
    "honda-cbr500r",
    "yamaha-xtz-125",
  ])("has exact motorcycle media for %s", (id) => {
    const media = getRenderableMedia("motorcycle", id)[0];
    expect(media).toBeDefined();
    expect(media.src).not.toContain("/placeholders/");
  });

  it("forces helmet images onto the MotoIndex white contained stage", () => {
    const detailCss = fs.readFileSync("app/gear/helmets/[brand]/[product]/helmet-review.css", "utf8");
    const cleanupCss = fs.readFileSync("app/image-stage-cleanup.css", "utf8");
    expect(detailCss).not.toContain("mix-blend-mode:multiply");
    expect(detailCss).toContain("mix-blend-mode:normal");
    expect(detailCss).toContain("object-fit:contain");
    expect(cleanupCss).toContain("html body .entity-media-contained");
    expect(cleanupCss).toContain("background:#fff!important");
    expect(cleanupCss).toContain("object-fit:contain!important");
  });
});

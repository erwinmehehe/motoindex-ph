/**
 * Explicitly licensed, externally hosted reference imagery for historical model
 * pages. These assets are NOT part of the local-only 1200x1200 WebP catalog in
 * lib/media.ts and must not be fed into that catalog's validation pipeline.
 *
 * Original: https://commons.wikimedia.org/wiki/File:Yamaha_R15_V3.0.jpg
 * Author: Akshayanil919 / Akshay Anil Photography
 * License: https://creativecommons.org/licenses/by-sa/4.0/
 *
 * The 1280px Wikimedia derivative is resized only, not cropped. Show attribution
 * and a link to the original + license wherever displayed.
 */
const R15_V3_REFERENCE = {
  src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Yamaha_R15_V3.0.jpg/1280px-Yamaha_R15_V3.0.jpg",
  fallbackSrc: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Yamaha_R15_V3.0.jpg/960px-Yamaha_R15_V3.0.jpg",
  alt: "2018 Yamaha YZF-R15 V3 sport motorcycle in red and charcoal gray, photographed outdoors",
  width: 1280,
  height: 853,
  creator: "Akshayanil919 (Akshay Anil)",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Yamaha_R15_V3.0.jpg",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  licenseName: "CC BY-SA 4.0",
} as const;

export function licensedHistoricalMotorcycleImage(modelId: string) {
  return modelId === "yamaha-yzf-r15-v3" ? R15_V3_REFERENCE : undefined;
}

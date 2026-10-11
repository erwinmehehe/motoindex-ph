/**
 * Model-specific ignition references. These are not universal part fitments.
 * Publish only after verifying a manufacturer manual for the exact model family.
 */
export type ModelSparkPlugGuide = {
  modelId: string;
  status: "verified" | "research";
  primaryKeyword: string;
  phSearchVolume: number;
  phKeywordDifficulty: number;
  keywordCheckedAt: string;
  manufacturer: string;
  partCode: string;
  gapMinMm: number;
  gapMaxMm: number;
  appliesTo: string;
  applicabilityNote: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
};

export const modelSparkPlugGuides: ModelSparkPlugGuide[] = [
  {
    modelId: "suzuki-raider-r150",
    status: "verified",
    primaryKeyword: "raider 150 spark plug",
    phSearchVolume: 30,
    phKeywordDifficulty: 0,
    keywordCheckedAt: "2026-10-11",
    manufacturer: "NGK",
    partCode: "MR8E-9",
    gapMinMm: 0.8,
    gapMaxMm: 0.9,
    appliesTo: "Suzuki Raider R150 FI / FU150MF owner's manual",
    applicabilityNote:
      "The published code and gap are from Suzuki's FU150MF fuel-injected Raider R150 owner's manual. They must not be assumed to apply to Raider R150 carbureted versions, Raider PRO, or a different model year or engine code without checking the exact owner's manual or Suzuki dealer.",
    sourceLabel: "Suzuki Philippines Raider R150 FI Owner's Manual, spark plug section, pages 6-17 to 6-19",
    sourceUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/04/RAIDER-150-FI.pdf",
    checkedAt: "2026-10-11"
  }
];

export function modelSparkPlugGuide(modelId: string) {
  return modelSparkPlugGuides.find((guide) =>
    guide.modelId === modelId &&
    guide.status === "verified" &&
    guide.sourceUrl.startsWith("https://mc.suzuki.com.ph/")
  );
}

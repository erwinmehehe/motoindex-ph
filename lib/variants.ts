import type { MotorcycleVariant } from "./types";

// v2 starts with high-demand multi-trim models where current Philippine variant names and
// prices can be checked cleanly. Other model-level ranges stay visible as ranges until their
// trim mapping is verified rather than being guessed into variant pages.
export const motorcycleVariants: MotorcycleVariant[] = [
  {
    id: "yamaha-aerox-v3-standard",
    modelId: "yamaha-aerox-v3",
    name: "Standard",
    slug: "standard",
    srpPhp: 125900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Independent PH 2026 Aerox variant price list",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price",
    featureSummary: "The lower-price Aerox configuration for riders who want the current body and 155cc platform without the SP feature bundle.",
    differentiators: ["Base-price Aerox configuration", "CVT automatic", "Current 155cc Aerox generation"],
  },
  {
    id: "yamaha-aerox-v3-sp",
    modelId: "yamaha-aerox-v3",
    name: "SP",
    slug: "sp",
    srpPhp: 163900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Independent PH 2026 Aerox variant price list; Yamaha Philippines YECVT feature reference",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price",
    featureSummary: "The higher-spec Aerox with the premium safety/connectivity bundle; Yamaha also positions the SP as a YECVT model.",
    differentiators: ["Aerox SP", "YECVT model", "ABS and traction-control equipment listed on current variant references"],
  },
  {
    id: "yamaha-nmax-v3-standard",
    modelId: "yamaha-nmax-v3",
    name: "Standard",
    slug: "standard",
    srpPhp: 155900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Independent PH 2026 NMAX variant price list",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/nmax",
    featureSummary: "The lower-price current NMAX configuration and the baseline for comparing the Tech Max premium.",
    differentiators: ["Base-price NMAX configuration", "Current 155cc NMAX generation"],
  },
  {
    id: "yamaha-nmax-v3-tech-max",
    modelId: "yamaha-nmax-v3",
    name: "Tech Max",
    slug: "tech-max",
    srpPhp: 175900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Independent PH 2026 NMAX variant price list; Yamaha Philippines YECVT feature reference",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/nmax",
    featureSummary: "The premium NMAX configuration. Yamaha positions Tech Max with YECVT and Sport/Touring riding modes.",
    differentiators: ["NMAX Tech Max", "YECVT with Sport/Touring modes", "Premium NMAX technology package"],
  },
  {
    id: "honda-pcx-160-standard",
    modelId: "honda-pcx-160",
    name: "Standard",
    slug: "standard",
    srpPhp: 133400,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Honda Philippines All-New PCX160 launch/current variant reference",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160",
    featureSummary: "The value-oriented current PCX160 with CBS and the same core 157cc platform as RoadSync.",
    differentiators: ["Combined Braking System (CBS)", "Current 157cc eSP+ platform", "Lower purchase price than RoadSync"],
    colors: ["Vortex Red Metallic", "Pearl Fadeless White", "Matte Bullet Silver"],
    braking: "CBS",
  },
  {
    id: "honda-pcx-160-roadsync",
    modelId: "honda-pcx-160",
    name: "RoadSync",
    slug: "roadsync",
    srpPhp: 154900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Honda Philippines All-New PCX160 launch/current variant reference",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160",
    featureSummary: "The technology-focused PCX160 with Honda RoadSync, a 5-inch TFT panel, ABS and HSTC.",
    differentiators: ["Honda RoadSync", "5-inch TFT meter", "ABS", "Honda Selectable Torque Control (HSTC)"],
    colors: ["Matte Gunpowder Black Metallic", "Pearl Fadeless White"],
    braking: "ABS + HSTC",
  },
  {
    id: "honda-adv-160-abs",
    modelId: "honda-adv-160",
    name: "ABS",
    slug: "abs",
    srpPhp: 167400,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Honda Philippines 2026 ADV160 catalog naming with current dealer price cross-check",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-adv160-roadsync-type/",
    featureSummary: "The lower-price 2026 ADV160 configuration with ABS and HSTC but without the RoadSync connectivity package.",
    differentiators: ["ABS", "Honda Selectable Torque Control (HSTC)", "5-inch TFT meter platform"],
    colors: ["Matte Gunpowder Black Metallic", "Pearl Fadeless White", "Matte Sabre Green Metallic"],
    braking: "ABS + HSTC",
  },
  {
    id: "honda-adv-160-roadsync",
    modelId: "honda-adv-160",
    name: "RoadSync",
    slug: "roadsync",
    srpPhp: 174900,
    status: "verified",
    checkedAt: "2026-08-25",
    sourceLabel: "Honda Philippines 2026 ADV160 catalog naming with current dealer price cross-check",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-adv160-roadsync-type/",
    featureSummary: "The connectivity-focused 2026 ADV160 with Honda RoadSync on top of the ABS/HSTC safety package.",
    differentiators: ["Honda RoadSync", "5-inch TFT meter", "ABS", "Honda Selectable Torque Control (HSTC)"],
    colors: ["Matte Pearl Crater White", "Quartz Brown Metallic"],
    braking: "ABS + HSTC",
  },
  {
    id: "honda-cb650r-standard",
    modelId: "honda-cb650r",
    name: "Standard",
    slug: "standard",
    srpPhp: 525000,
    status: "verified",
    checkedAt: "2026-09-09",
    sourceLabel: "Honda Philippines Makina Moto Expo 2026 CB650R launch",
    sourceUrl: "https://www.hondaph.com/big-bike/news/honda-philippines-launches-three-new-models-elevates-innovation-at-makina-moto-expo-2026",
    featureSummary: "The conventional-clutch 2026 CB650R, using the same 649cc inline-four platform and RoadSync-equipped TFT package as the current Philippine lineup.",
    differentiators: ["Conventional manual clutch", "5-inch full-color TFT", "Honda RoadSync"],
    colors: ["Matte Gunpowder Black Metallic"],
  },
  {
    id: "honda-cb650r-e-clutch",
    modelId: "honda-cb650r",
    name: "E-Clutch",
    slug: "e-clutch",
    srpPhp: 565000,
    status: "verified",
    checkedAt: "2026-09-09",
    sourceLabel: "Honda Philippines Makina Moto Expo 2026 CB650R launch",
    sourceUrl: "https://www.hondaph.com/big-bike/news/honda-philippines-launches-three-new-models-elevates-innovation-at-makina-moto-expo-2026",
    featureSummary: "The E-Clutch CB650R lets the rider start, stop and shift by foot without using the clutch lever, while retaining manual-clutch control when desired.",
    differentiators: ["Honda E-Clutch", "Quick shifter", "5-inch full-color TFT", "Honda RoadSync"],
    colors: ["Matte Gunpowder Black Metallic", "Grand Prix Red", "Matte Jeans Blue Metallic"],
  }

];

export function getVariantsForModel(modelId: string) {
  return motorcycleVariants.filter((variant) => variant.modelId === modelId);
}

export function getVerifiedVariantsForModel(modelId: string) {
  return getVariantsForModel(modelId).filter((variant) => variant.status === "verified");
}

export function hasVerifiedVariantCoverage(modelId: string) {
  return getVerifiedVariantsForModel(modelId).length >= 2;
}

export function variantPriceOptions(modelId: string) {
  return getVerifiedVariantsForModel(modelId).map((variant) => ({
    label: variant.name,
    price: variant.srpPhp,
  }));
}

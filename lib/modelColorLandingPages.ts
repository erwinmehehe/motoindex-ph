export type ColorIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const colorIntentLandingProfiles: ColorIntentLandingProfile[] = [
  {
    modelId: "honda-click-125i",
    keyword: "honda click 125i v3 colors",
    keywordVolume: 6600,
    title: "Honda Click 125i Colors Philippines 2026 | All Variants",
    description: "Honda Click 125i colors Philippines 2026 with Standard, Smart Edition and Street paint options, variant mapping, current names and dealer-stock verification.",
    heading: "Honda Click 125i colors in the Philippines",
    intro: "Compare the current Click 125i paint choices by verified variant. Standard, Smart Edition and Street do not share exactly the same color set, so match the paint name to the exact trim before reserving."
  },
  {
    modelId: "yamaha-nmax-v3",
    keyword: "nmax v3 colors",
    keywordVolume: 2700,
    title: "Yamaha NMAX V3 Colors Philippines 2026 | Current Options",
    description: "Yamaha NMAX V3 colors Philippines 2026 with current Black, Light Grey, Black Gold and Dark Magma options, variant context and dealer-stock verification.",
    heading: "Yamaha NMAX V3 colors in the Philippines",
    intro: "Use the current NMAX color list as a model-year reference, then confirm whether the paint is tied to the Standard or Tech Max unit available at your dealer."
  },
  {
    modelId: "yamaha-aerox-v3",
    keyword: "aerox color",
    keywordVolume: 2000,
    title: "Yamaha Aerox V3 Colors Philippines 2026 | Standard & SP",
    description: "Yamaha Aerox V3 colors Philippines 2026 with current Black, Race Blu and Glaze Blue options, Standard/SP context, source dates and dealer-stock verification.",
    heading: "Yamaha Aerox V3 colors in the Philippines",
    intro: "Compare the current Aerox V3 paint references with Standard and SP trim context. Dealer stock can differ, so confirm the exact color and variant combination before paying a reservation."
  },
  {
    modelId: "honda-adv-160",
    keyword: "adv 160 colors",
    keywordVolume: 1200,
    title: "Honda ADV160 Colors Philippines 2026 | ABS & RoadSync Guide",
    description: "Honda ADV160 colors Philippines 2026 with ABS and RoadSync paint options, current color names, variant mapping, source dates and dealer-stock verification.",
    heading: "Honda ADV160 colors in the Philippines",
    intro: "The 2026 ADV160 color list changes by ABS and RoadSync trim. Use the verified trim mapping below instead of assuming every paint option is offered on both versions."
  },
  {
    modelId: "honda-click-160",
    keyword: "click 160 colors",
    keywordVolume: 800,
    title: "Honda Click 160 Colors Philippines 2026 | Current Options",
    description: "Honda Click 160 colors Philippines 2026 with Matte Gunpowder Black, Matte Solar Red and Matte Cosmo Silver options, source dates and dealer-stock checks.",
    heading: "Honda Click 160 colors in the Philippines",
    intro: "MotoIndex keeps the current Click 160 paint names on one focused color page so color research does not compete with the broad price/specification model page."
  },
  {
    modelId: "yamaha-fazzio",
    keyword: "fazzio colors",
    keywordVolume: 500,
    title: "Yamaha Fazzio Colors Philippines 2026 | Current Options",
    description: "Yamaha Fazzio colors Philippines 2026 with current Mint, Ivory and Black options, model context, source dates, availability notes and dealer-stock verification.",
    heading: "Yamaha Fazzio colors in the Philippines",
    intro: "Compare the current Fazzio Mint, Ivory and Black references, then confirm the exact model code and branch stock because older inventory can surface alongside the current model."
  },
  {
    modelId: "suzuki-raider-r150",
    keyword: "raider fi colors",
    keywordVolume: 450,
    title: "Suzuki Raider R150 Colors Philippines 2026 | Current Paint",
    description: "Suzuki Raider R150 colors Philippines 2026 with Metallic Matte Blue, Pearl Bright Ivory, Bordeaux Red and Fibroin Gray options plus stock-check guidance.",
    heading: "Suzuki Raider R150 colors in the Philippines",
    intro: "Compare the current Raider R150 paint names in one place, then verify the exact dealer unit because color allocation can vary by branch and model-year inventory."
  },
  {
    modelId: "yamaha-mio-gear",
    keyword: "mio gear 125 colors",
    keywordVolume: 450,
    title: "Yamaha Mio Gear Colors Philippines 2026 | Black & Gray Guide",
    description: "Yamaha Mio Gear colors Philippines 2026 with current Black and Gray paint references, model-year context, source dates, availability and dealer-stock checks.",
    heading: "Yamaha Mio Gear colors in the Philippines",
    intro: "The current MotoIndex color record for Mio Gear is Black and Gray. Use the page as a model-year reference and verify the exact dealer stock before choosing a unit by paint."
  },
  {
    modelId: "honda-beat",
    keyword: "honda beat colors",
    keywordVolume: 400,
    title: "Honda BeAT Colors Philippines 2026 | Playful & Premium Guide",
    description: "Honda BeAT colors Philippines 2026 with current Playful and Premium paint choices, six listed colors, variant context, source dates and dealer-stock checks.",
    heading: "Honda BeAT colors in the Philippines",
    intro: "BeAT color choice is tied to the current Playful and Premium lineup. Compare the listed paint names, then confirm which exact trim and branch inventory carries the color you want."
  },
  {
    modelId: "honda-pcx-160",
    keyword: "pcx 160 colors",
    keywordVolume: 250,
    title: "Honda PCX160 Colors Philippines 2026 | Standard & RoadSync",
    description: "Honda PCX160 colors Philippines 2026 with Standard and RoadSync paint choices, four current colors, trim mapping, source dates and dealer-stock verification.",
    heading: "Honda PCX160 colors in the Philippines",
    intro: "PCX160 paint choice depends on Standard versus RoadSync. Use the current trim mapping below before comparing dealer stock, because not every listed color belongs to both variants."
  }
];

const byId = new Map(colorIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function colorIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasColorIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}

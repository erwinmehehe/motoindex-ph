import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "yamaha-tmax": {
    seoTitle: "Yamaha TMAX Price Philippines 2026 | Tech Max Specs & Costs",
    seoDescription: "Yamaha TMAX Tech Max price Philippines 2026 with 562cc specs, 800mm seat, 220kg wet weight, 15-inch tires, ownership costs and maxi-scooter alternatives.",
    intro: "TMAX research combines premium maxi-scooter pricing, rider fit and ownership costs. Keep Tech Max price, specifications and comparison intent on the existing canonical TMAX page rather than splitting it into thin price or specification URLs.",
    intents: ["price", "specs", "ownership"]
  },
  "honda-cb650r": {
    seoTitle: "Honda CB650R Price Philippines 2026 | E-Clutch & Ownership",
    seoDescription: "Honda CB650R price Philippines 2026 with Standard vs E-Clutch pricing, 649cc inline-four specs, colors, 810mm seat, ownership costs and direct alternatives.",
    intro: "CB650R demand spans price, E-Clutch, specifications and ownership. The canonical page should keep the Standard and E-Clutch decision beside rider fit and middleweight running costs.",
    intents: ["price", "variants", "specs", "colors", "ownership"]
  },
  "cfmoto-300sr": {
    seoTitle: "CFMOTO 300SR Price Philippines 2026 | Specs, ABS & Costs",
    seoDescription: "CFMOTO 300SR price Philippines 2026 with 292.4cc specs, 29hp, 780mm seat, dual-channel ABS, ownership costs, current colors and direct sport-bike alternatives.",
    intro: "300SR searches are price-led but quickly become specifications, ABS and ownership comparisons. Keep those answers on the existing canonical model page and link directly into the larger CFMOTO SR family.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "kawasaki-ninja-zx-4rr": {
    seoTitle: "Ninja ZX-4RR Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Kawasaki Ninja ZX-4RR price Philippines 2026 with 401cc inline-four specs, 76.43hp, ABS, 800mm seat, ownership costs, insurance and sport-bike alternatives.",
    intro: "ZX-4RR demand mixes price with inline-four performance, rider fit and premium sport-bike ownership. The canonical page should answer those together without creating separate price or horsepower descendants.",
    intents: ["price", "specs", "ownership"]
  },
  "bristol-maxie-400": {
    seoTitle: "Bristol Maxie 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Bristol Maxie 400 price Philippines 2026 with 377cc specs, 730mm seat, ABS, 17.4L tank, ownership costs and maxi-scooter alternatives in the Philippines.",
    intro: "Maxie 400 research is strongest when its low published seat height, large fuel tank, price and ownership trade-offs are compared directly with other Philippine maxi scooters on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "bajaj-pulsar-rs200": {
    seoTitle: "Bajaj Pulsar RS200 Price Philippines 2026 | Specs & ABS",
    seoDescription: "Bajaj Pulsar RS200 price Philippines 2026 with 199.4cc specs, dual-channel ABS, 810mm seat, 13L tank, ownership costs, insurance and sport-bike alternatives.",
    intro: "Pulsar RS200 buyers need price, ABS, full-fairing ownership and direct 150–300cc sport-bike comparisons together. Keep that intent consolidated on the existing RS200 canonical page.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-cbr150r": {
    seoTitle: "Honda CBR150R Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Honda CBR150R price Philippines 2026 with 149cc specs, 787mm seat, fuel economy, current color, ownership costs, insurance and direct sport-bike alternatives.",
    intro: "CBR150R demand sits between commuter and sport-bike intent. The canonical page should make current price, rider fit, fuel economy and full-fairing ownership easy to compare with R15M, GSX-R150 and 300SR.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "royal-enfield-shotgun-650": {
    seoTitle: "Royal Enfield Shotgun 650 Price Philippines 2026 | Specs",
    seoDescription: "Royal Enfield Shotgun 650 price Philippines 2026 with 648cc twin specs, 795mm seat, dual-channel ABS, colors, ownership costs and road-bike alternatives.",
    intro: "Shotgun 650 research combines variant pricing, 650cc twin specifications, weight, rider fit and style-led comparisons. Keep those buying questions together on the existing canonical model page.",
    intents: ["price", "specs", "colors", "ownership"]
  }
};

export function wave3ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

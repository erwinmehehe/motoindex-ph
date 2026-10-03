import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "suzuki-smash-carb": {
    seoTitle: "Suzuki Smash 115 Price Philippines 2026 | Carb Specs & Costs",
    seoDescription: "Suzuki Smash 115 price Philippines 2026 with current Smash Carb variants, 109.7cc specs, 755mm seat, 91kg weight, 4.5L tank, fuel use and ownership costs.",
    intro: "Current Suzuki Smash Carb searches often use the older Smash 115 wording even though Suzuki lists 109.7cc actual displacement. Keep the family name, current variant prices, specifications and ownership context together on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "suzuki-smash-fi": {
    seoTitle: "Suzuki Smash FI Price Philippines 2026 | Specs & Economy",
    seoDescription: "Suzuki Smash FI price Philippines 2026 with 113cc specs, 755mm seat, 94kg weight, 68 km/L fuel economy, current variants, fuel use and ownership costs.",
    intro: "Smash FI buyers usually compare purchase price, fuel economy and brake/wheel configuration before ownership cost. The canonical page should keep those answers together instead of splitting them into variant or city-price URLs.",
    intents: ["price", "specs", "ownership"]
  },
  "suzuki-gixxer-sf-155": {
    seoTitle: "Suzuki Gixxer SF 155 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Suzuki Gixxer SF 155 price Philippines 2026 with 155cc specs, 795mm seat, 146kg weight, 50.2 km/L economy, 12L tank, tires and sport-bike ownership costs.",
    intro: "Gixxer SF 155 intent mixes price, sport-bike styling and practical running costs. Keep the 155cc specification, 12 L tank, published fuel-economy figure and fairing ownership context on the existing model URL.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "suzuki-hayabusa": {
    seoTitle: "Suzuki Hayabusa Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Suzuki Hayabusa price Philippines 2026 with 1340cc specs, 187hp, 800mm seat, 262kg weight, 20L tank, ABS, ownership costs, insurance and superbike alternatives.",
    intro: "Hayabusa research is a high-value buying decision where price, insurance, tire cost, rider fit and service support matter alongside the 1,340cc specification. Keep those questions consolidated on the canonical Philippine model page.",
    intents: ["price", "specs", "ownership"]
  },
  "kymco-krv-180": {
    seoTitle: "KYMCO KRV 180 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "KYMCO KRV 180 price Philippines 2026 with Belt and MOTO Chain prices, 175.1cc specs, 795mm seat, ABS, TCS, 13-inch tires, fuel use and ownership costs.",
    intro: "KRV 180 demand includes both Belt and MOTO Chain configurations, so the broad model page should keep current pricing, shared engine specifications, ABS/TCS equipment and ownership trade-offs together.",
    intents: ["price", "specs", "ownership"]
  },
  "kymco-xciting-vs-400": {
    seoTitle: "KYMCO Xciting VS 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "KYMCO Xciting VS 400 price Philippines 2026 with 400.1cc specs, 805mm seat, 195kg weight, Bosch ABS, TCS, 12.5L tank and maxi-scooter ownership costs.",
    intro: "Xciting VS 400 research combines maxi-scooter price, highway-oriented displacement, rider fit and ownership costs. Keep its 400.1cc engine, Bosch ABS, TCS and practical touring context on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "kawasaki-ninja-zx-10r": {
    seoTitle: "Kawasaki ZX-10R Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Kawasaki ZX-10R price Philippines 2026 with 998cc specs, 200.21hp, 835mm seat, 207kg weight, KIBS ABS, 17L tank, tires and supersport ownership costs.",
    intro: "ZX-10R searches combine price with power, electronics and track-derived equipment. The canonical page should also surface insurance, tire, service and rider-fit costs so the buying decision is not reduced to horsepower.",
    intents: ["price", "specs", "ownership"]
  },
  "kawasaki-z900-se": {
    seoTitle: "Kawasaki Z900 SE Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Kawasaki Z900 SE price Philippines 2026 with 948cc specs, 123.6hp, 800mm seat, 213kg weight, Brembo brakes, 17L tank, tires and naked-bike ownership costs.",
    intro: "Z900 SE research is driven by price and equipment differences, especially the upgraded braking and suspension package. Keep the 948cc specifications, rider fit and recurring ownership context on the canonical model page.",
    intents: ["price", "specs", "ownership"]
  }
};

export function wave6ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

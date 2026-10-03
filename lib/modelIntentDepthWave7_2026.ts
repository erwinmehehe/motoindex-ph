import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "kawasaki-ninja-500": {
    seoTitle: "Kawasaki Ninja 500 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Ninja 500 price Philippines 2026 with 451cc specs, 51.3hp, 785mm seat, 170kg weight, 14L tank, ownership costs and sport-bike alternatives in PH.",
    intro: "Ninja 500 demand mixes price, displacement, performance and everyday sport-bike ownership. Keep the current 451cc specification, rider fit and total ownership questions together on the canonical Philippine model page.",
    intents: ["price", "specs", "ownership"]
  },
  "vespa-sprint-150": {
    seoTitle: "Vespa Sprint 150 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Vespa Sprint 150 price Philippines 2026 with 155cc specs, 785mm seat, 132kg weight, 8L tank, ABS context, ownership costs and premium-scooter alternatives.",
    intro: "Sprint 150 searches are strongly price-led, but premium-scooter ownership also depends on rider fit, service access, tire sizes and the final dealer quote. Keep those questions on one canonical Vespa model page.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-rebel-1100": {
    seoTitle: "Honda Rebel 1100 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda Rebel 1100 price Philippines 2026 with 1084cc specs, 87.2hp, 709mm seat, 237kg weight, 13.6L tank, ownership costs and cruiser alternatives in PH.",
    intro: "Rebel 1100 research combines high-value purchase intent with low-seat fit, large-displacement performance and cruiser ownership costs. Keep those decisions consolidated on the current Honda model page.",
    intents: ["price", "specs", "ownership"]
  },
  "kawasaki-ninja-h2": {
    seoTitle: "Kawasaki Ninja H2 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Ninja H2 price Philippines 2026 with 998cc supercharged specs, 231hp, 825mm seat, 238kg weight, 17L tank, insurance and ownership costs in PH.",
    intro: "Ninja H2 searches are high-value superbike research. The canonical page should combine the current supercharged specification with insurance, tires, service, rider fit and total ownership cost rather than splitting price and specs into thin URLs.",
    intents: ["price", "specs", "ownership"]
  },
  "royal-enfield-classic-350": {
    seoTitle: "Royal Enfield Classic 350 Price Philippines 2026 | Specs",
    seoDescription: "Royal Enfield Classic 350 price Philippines 2026 with 349cc specs, 805mm seat, 195kg weight, 13L tank, ABS, ownership costs and classic-bike alternatives.",
    intro: "Classic 350 demand is broad model and price research with a strong ownership component. Keep its 349cc specification, 805 mm seat, 19/18-inch wheels and recurring classic-bike costs together on one canonical page.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-cbr650r": {
    seoTitle: "Honda CBR650R Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Honda CBR650R price Philippines 2026 with 649cc specs, 93.8hp, 810mm seat, 208kg weight, current price range, ownership costs and sport-bike alternatives.",
    intro: "CBR650R intent combines price, four-cylinder performance and everyday sport-bike ownership. Keep the current Honda specification, rider fit and ownership context together on the canonical model page.",
    intents: ["price", "specs", "ownership"]
  },
  "vespa-gtv-300": {
    seoTitle: "Vespa GTV 300 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Vespa GTV 300 price Philippines 2026 with 278cc specs, 790mm seat, 163kg weight, 8.5L tank, ABS and traction control, ownership costs and alternatives.",
    intro: "GTV 300 research is premium-scooter purchase intent where price, equipment, rider fit and after-sales support matter together. Keep those questions on the existing canonical GTV model page.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "vespa-primavera-150": {
    seoTitle: "Vespa Primavera 150 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Vespa Primavera 150 price Philippines 2026 with 155cc specs, 785mm seat, 130kg weight, current price context, ownership costs and premium-scooter alternatives.",
    intro: "Primavera 150 searches mix broad Vespa price intent with model-level fit, style and ownership questions. Keep the current 155cc specification and recurring premium-scooter costs on the canonical page.",
    intents: ["price", "specs", "colors", "ownership"]
  }
};

export function wave7ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "yamaha-pg-1": {
    seoTitle: "Yamaha PG-1 Price Philippines 2026 | Specs, Fit & Costs",
    seoDescription: "Yamaha PG-1 price Philippines 2026 with 114cc specs, 795mm seat, 107kg weight, 190mm ground clearance, ownership costs and commuter-trail fit context.",
    intro: "PG-1 demand is strongly price-led, but its manual centrifugal-clutch layout, 16-inch block-pattern tires, 190 mm ground clearance and 795 mm seat make rider use and ownership context part of the same decision.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "yamaha-lexi-155": {
    seoTitle: "Yamaha Lexi 155 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha Lexi 155 price Philippines 2026 with 155cc specs, 770mm seat, 116kg weight, braking, fuel capacity, ownership costs and direct scooter alternatives.",
    intro: "Lexi 155 research combines a near-₱100K purchase price with 155cc scooter specifications, rider fit and ownership trade-offs. Keep broad buying intent on the canonical model page while the focused specs route owns deeper technical-sheet queries.",
    intents: ["price", "specs", "ownership"]
  },
  "yamaha-yzf-r1m": {
    seoTitle: "Yamaha YZF-R1M Price Philippines 2026 | R1 Specs & Costs",
    seoDescription: "Yamaha YZF-R1M price Philippines 2026 with 998cc R1 specs, 197.3hp, 855mm seat, 200kg weight, rider aids, ownership costs and supersport buying context.",
    intro: "Philippine R1 searches often resolve to Yamaha's current YZF-R1M. Keep R1 and R1M price, rider-fit and ownership research consolidated here instead of creating separate thin R1 price or specification URLs.",
    intents: ["price", "specs", "ownership"]
  },
  "suzuki-burgman-street-ex": {
    seoTitle: "Suzuki Burgman Street EX Price Philippines 2026 | Specs",
    seoDescription: "Suzuki Burgman Street EX price Philippines 2026 with 124cc specs, 780mm seat, 112kg weight, fuel capacity, ownership costs and 125cc scooter alternatives.",
    intro: "Burgman Street EX searches mix model, color and price intent. The canonical page should answer the current Philippine purchase context and practical 125cc ownership questions without creating separate price or variant descendants.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "yamaha-mio-gravis": {
    seoTitle: "Yamaha Mio Gravis Price Philippines 2026 | Specs & Costs",
    seoDescription: "Yamaha Mio Gravis price Philippines 2026 with 125cc specs, 780mm seat, 102kg weight, 12-inch tires, ownership costs and commuter scooter alternatives.",
    intro: "Mio Gravis demand is centered on price, colors and practical 125cc scooter specifications. Keep the buying decision on this canonical page while focused specification intent can hand off to the dedicated technical reference.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "suzuki-avenis": {
    seoTitle: "Suzuki Avenis Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Suzuki Avenis price Philippines 2026 with 124cc specs, 780mm seat, 106kg weight, combined braking, fuel economy, ownership costs and scooter alternatives.",
    intro: "Avenis searches combine model, price and color interest. The canonical page should keep its current Philippine price, 124cc specification context, combined braking and day-to-day scooter ownership together.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "kawasaki-z500": {
    seoTitle: "Kawasaki Z500 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Kawasaki Z500 price Philippines 2026 with 451cc twin specs, 51.3hp, 785mm seat, 166kg weight, ABS, ownership costs and naked-bike buying alternatives.",
    intro: "Z500 searches are primarily model and Philippine price intent, followed by specification and comparison questions. Keep those answers on the current Z500 canonical page rather than reproducing city-price or FAQ descendants.",
    intents: ["price", "specs", "ownership"]
  },
  "yamaha-wr155r": {
    seoTitle: "Yamaha WR155R Price Philippines 2026 | Specs & Trail Fit",
    seoDescription: "Yamaha WR155R price Philippines 2026 with 155cc specs, 880mm seat, 134kg weight, 245mm ground clearance, 21/18 wheels, ownership and trail-fit context.",
    intro: "WR155R buyers need more than the headline price. The 880 mm seat, 245 mm ground clearance, 21/18-inch wheels and 134 kg curb weight are central to fit, trail use and ownership planning.",
    intents: ["price", "specs", "colors", "ownership"]
  }
};

export function wave4ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "honda-tmx-supremo": {
    seoTitle: "Honda TMX Supremo Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda TMX Supremo price Philippines 2026 with 149cc specs, 782mm seat, 127kg weight, 10.3L tank, ownership costs, financing context and work-bike use.",
    intro: "TMX Supremo demand is price-led, but its 149cc manual drivetrain, 10.3 L tank, 18-inch tires and utility layout make work use, maintenance and total ownership cost part of the same buying decision.",
    intents: ["price", "specs", "ownership"]
  },
  "yamaha-ytx-125": {
    seoTitle: "Yamaha YTX 125 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha YTX 125 price Philippines 2026 with 125cc specs, 800mm seat, 114kg weight, 7.6L tank, drum brakes, ownership costs and daily commuter-work use.",
    intro: "YTX 125 searches mix purchase price with practical work-bike questions. Keep its 125cc engine, 7.6 L tank, 800 mm seat, drum-brake setup and daily ownership context on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "kawasaki-klx150": {
    seoTitle: "Kawasaki KLX150 Price Philippines 2026 | Specs & Trail Fit",
    seoDescription: "Kawasaki KLX150 price Philippines 2026 with 144cc specs, 866mm seat, 119kg weight, 21/18-inch wheels, ownership costs and dual-sport trail-fit context.",
    intro: "KLX150 research is not just a price query. Its 866 mm seat, 119 kg curb weight and 21/18-inch wheel setup matter directly to rider fit, trail use and day-to-day ownership.",
    intents: ["price", "specs", "ownership"]
  },
  "motorstar-cafe-400": {
    seoTitle: "MotorStar Cafe 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "MotorStar Cafe 400 price Philippines 2026 with 397.2cc specs, 790mm seat, 150kg weight, 13L tank, ownership costs and classic-road-bike alternatives in PH.",
    intro: "Cafe 400 demand is strongly value-led, but its 397.2cc single, 19/18-inch wheels and simpler braking package need to be compared with fit, service support and total ownership cost rather than price alone.",
    intents: ["price", "specs", "ownership"]
  },
  "honda-tmx125-alpha": {
    seoTitle: "Honda TMX125 Alpha Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda TMX125 Alpha price Philippines 2026 with 125cc specs, 759mm seat, 113kg weight, 8.6L tank, fuel economy, ownership costs and practical business-bike use.",
    intro: "TMX125 Alpha intent combines low purchase price with business-bike running costs. Keep its 759 mm seat, 8.6 L tank, simple drum-brake layout and published fuel-economy context together on the canonical model page.",
    intents: ["price", "specs", "ownership"]
  },
  "bajaj-dominar-400": {
    seoTitle: "Bajaj Dominar 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Bajaj Dominar 400 price Philippines 2026 with 373.3cc specs, 39.5hp, 800mm seat, twin-channel ABS, 13L tank, ownership costs and sport-touring context.",
    intro: "Dominar 400 searches combine price, 400-class naming and touring intent. The canonical page should keep its 373.3cc engine, twin-channel ABS, 192 kg weight and ownership costs visible together without implying legal access from the model name alone.",
    intents: ["price", "specs", "ownership"]
  },
  "zontes-400g": {
    seoTitle: "Zontes 400G Price Philippines 2026 | CVT Specs & Ownership",
    seoDescription: "Zontes 400G price Philippines 2026 with 400cc CVT specs, 770mm seat, 203kg weight, ABS, traction control, 17.5L tank and maxi-scooter ownership costs.",
    intro: "The 400G combines a 400cc CVT, 17.5 L tank, 770 mm seat and adventure-style maxi-scooter chassis. Price, support, replacement tires, CVT ownership and rider fit belong on the same canonical buying page.",
    intents: ["price", "specs", "ownership"]
  },
  "kawasaki-barako-ii": {
    seoTitle: "Kawasaki Barako II Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Barako II price Philippines 2026 with 177cc specs, 805mm seat, 142kg weight, 12L tank, ownership costs, financing context and utility-bike use.",
    intro: "Barako II searches are closely tied to utility and business use. Keep its 177cc engine, 12 L tank, long-seat layout, price and recurring maintenance context together rather than splitting finance or work-bike queries into thin descendants.",
    intents: ["price", "specs", "ownership"]
  }
};

export function wave5ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

import type { ModelIntentDepthProfile } from "./modelIntentDepth2026";

const profiles: Record<string, ModelIntentDepthProfile> = {
  "ducati-panigale-v4": {
    seoTitle: "Ducati Panigale V4 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Ducati Panigale V4 price Philippines 2026 with 1103cc specs, 214hp, 835mm seat, 198kg weight, 16L tank, ownership costs and superbike alternatives in PH.",
    intro: "Panigale V4 research is high-value superbike intent where the useful answer goes beyond MSRP. Keep its 1,103cc specification, rider fit, insurance, tires, service and ownership context together on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "yamaha-mio-gear": {
    seoTitle: "Yamaha Mio Gear Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha Mio Gear price Philippines 2026 with 125cc specs, 750mm seat, 96kg weight, 4.2L tank, current pricing, ownership costs and commuter-scooter alternatives.",
    intro: "Mio Gear demand combines entry-level scooter price, rider fit and practical ownership. Keep the current 125cc specification, 750 mm seat and recurring commuter costs together on the canonical Yamaha model page.",
    intents: ["price", "specs", "ownership"]
  },
  "honda-wave-rsx": {
    seoTitle: "Honda Wave RSX Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Honda Wave RSX price Philippines 2026 with 109cc specs, 760mm seat, 98kg weight, 4L tank, ownership costs, fuel-use context and underbone alternatives.",
    intro: "Wave RSX searches mix price with everyday underbone practicality. Keep the 109cc specification, light 98 kg weight, 760 mm seat and recurring ownership context together instead of fragmenting the intent.",
    intents: ["price", "specs", "ownership"]
  },
  "bristol-adx-160": {
    seoTitle: "Bristol ADX 160 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Bristol ADX 160 price Philippines 2026 with 155cc specs, 790mm seat, 151kg weight, 11L tank, ownership costs, tire sizes and adventure-scooter alternatives.",
    intro: "ADX 160 intent combines adventure-scooter styling with price, rider fit and ownership questions. Keep the 155cc specification, 11 L tank, mixed wheel sizes and recurring costs on the canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "ktm-390-duke": {
    seoTitle: "KTM 390 Duke Price Philippines 2026 | Specs & Ownership",
    seoDescription: "KTM 390 Duke price Philippines 2026 with 373cc specs, 43hp, 800mm seat, 139kg weight, 11L tank, ABS, ownership costs and naked-bike alternatives in PH.",
    intro: "390 Duke research is price and performance heavy, but ownership also depends on insurance, tires, chain service and dealer support. Keep those costs beside the current 373cc specification on one canonical page.",
    intents: ["price", "specs", "ownership"]
  },
  "honda-gold-wing": {
    seoTitle: "Honda Gold Wing Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Honda Gold Wing price Philippines 2026 with 1833cc specs, 125.3hp, 745mm seat, 385kg weight, 21.1L tank, ownership costs and luxury-touring alternatives.",
    intro: "Gold Wing demand is premium touring purchase intent where price, weight, rider fit, insurance, service and long-distance ownership matter together. Keep those questions consolidated on the canonical Honda model page.",
    intents: ["price", "specs", "ownership"]
  },
  "motorstar-xplorer-250r": {
    seoTitle: "MotorStar Xplorer 250R Philippines 2026 | Price & Specs",
    seoDescription: "MotorStar Xplorer 250R price Philippines 2026 with 249.6cc specs, 795mm seat, 146kg weight, 16L tank, ownership costs and value-road-bike alternatives.",
    intro: "Xplorer 250R demand is strongly value-led. Keep its 249.6cc specification, 16 L tank, rider fit and ownership trade-offs beside the current Philippine price instead of splitting price and specs into separate thin pages.",
    intents: ["price", "specs", "ownership"]
  },
  "keeway-cafe-racer-152": {
    seoTitle: "Keeway Cafe Racer 152 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Keeway Cafe Racer 152 price Philippines 2026 with 149cc specs, 770mm seat, 108kg weight, 12.1L tank, ownership costs and cafe-style motorcycle alternatives.",
    intro: "Cafe Racer 152 searches combine low purchase price with retro styling and everyday ownership. Keep its 149cc specification, 12.1 L tank, rider fit and maintenance context together on the canonical page.",
    intents: ["price", "specs", "ownership"]
  }
};

export function wave8ModelIntentDepthProfile(modelId: string) {
  return profiles[modelId];
}

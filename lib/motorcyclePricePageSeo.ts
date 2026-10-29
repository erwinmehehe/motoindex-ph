import type { Motorcycle } from "./types";

export type MotorcyclePricePageSeo = {
  heading: string;
  title: string;
  description: string;
  intro: string;
};

// Requested canonical pages only. Do not modify model evidence or current/previous market status.
const PRICE_PAGE_TARGETS: Readonly<Record<string, MotorcyclePricePageSeo>> = {
  "honda-click-125i": {
    "heading": "Click 125i Price Philippines",
    "title": "Click 125i Price Philippines | Honda SRP & Installment",
    "description": "Click 125i Price Philippines: Compare Honda Standard and Smart Edition prices, 125cc specs, CBS braking and installment planning. Verify dealer quotes.",
    "intro": "Click 125i Price Philippines guide: Compare Honda Click 125i Standard and Smart Edition published prices, CBS braking, 125cc specs, fuel economy and installment estimates before requesting a dealer quote."
  },
  "yamaha-sniper-155": {
    "heading": "Sniper 155 Price Philippines",
    "title": "Sniper 155 Price Philippines | Yamaha Specs & SRP",
    "description": "Sniper 155 Price Philippines: Compare Yamaha Sniper 155 and 155 R price references, 155cc specs, ABS by variant and ownership costs. Check dealer quotes.",
    "intro": "Sniper 155 Price Philippines guide: Compare published Yamaha Sniper 155 and Sniper 155 R dealer references, 155cc specs, six-speed manual riding and variant-dependent ABS before checking local quotes."
  },
  "rusi-classic-250i": {
    "heading": "Classic 250i Price Philippines",
    "title": "Classic 250i Price Philippines | Rusi Specs & Costs",
    "description": "Classic 250i Price Philippines: Check the sourced Rusi price reference, 250cc specs and ownership costs. Verify current stock, ABS and dealer pricing.",
    "intro": "Classic 250i Price Philippines guide: Review the third-party Rusi Classic 250i price reference, 250cc manual-bike specs and daily ownership costs. Confirm dealer pricing and ABS equipment on the exact unit."
  },
  "rusi-rfi-175": {
    "heading": "RFI 175 Price Philippines",
    "title": "RFI 175 Price Philippines | Rusi Specs & Installment",
    "description": "RFI 175 Price Philippines: Review Rusi's published price reference, 171.7cc scooter specs, fuel tank and estimated running costs. Confirm dealer pricing.",
    "intro": "RFI 175 Price Philippines guide: Check the published Rusi RFI 175 price reference, 171.7cc automatic scooter specifications, braking and fuel-use details, then confirm the seller's current quote."
  },
  "yamaha-yzf-r15-v3": {
    "heading": "YZF-R15 V3 Price Philippines",
    "title": "YZF-R15 V3 Price Philippines | Yamaha Historic SRP",
    "description": "YZF-R15 V3 Price Philippines: Review Yamaha's historical ₱164,000 price reference, 155cc specs and used-bike checks. Not a current new-bike quote.",
    "intro": "YZF-R15 V3 Price Philippines guide: Explore the Yamaha YZF-R15 V3 historical ₱164,000 Philippine reference, 155cc six-speed specs and used-bike checks. This is a previous generation, not a current new-bike price."
  },
  "yamaha-mio-i-125": {
    "heading": "Mio i 125 Price Philippines",
    "title": "Mio i 125 Price Philippines | Yamaha SRP & Specs",
    "description": "Mio i 125 Price Philippines: Check Yamaha's ₱75,900 dealer reference, 125cc specs, seat height and installment estimates. Prices vary by branch.",
    "intro": "Mio i 125 Price Philippines guide: Compare Yamaha Mio i 125's dated ₱75,900 dealer reference, 125cc scooter specifications, seat height, financing scenarios and running costs. Confirm the exact branch price."
  },
  "yamaha-xmax": {
    "heading": "XMAX Price Philippines",
    "title": "XMAX Price Philippines | Yamaha ABS & Installment",
    "description": "XMAX Price Philippines: See Yamaha's ₱311,000 dealer reference, 292cc specs, ABS, fuel capacity and estimated monthly payments. Verify your quote.",
    "intro": "XMAX Price Philippines guide: Compare Yamaha XMAX's dated ₱311,000 dealer reference with 292cc specifications, ABS, rider fit and monthly financing scenarios. Confirm branch pricing and model year."
  },
  "kawasaki-klx150": {
    "heading": "KLX150 Price Philippines",
    "title": "KLX150 Price Philippines | Kawasaki Specs & SRP",
    "description": "KLX150 Price Philippines: Compare Kawasaki's published price reference, dual-sport specs, seat height and ownership checks. Confirm your dealer quote.",
    "intro": "KLX150 Price Philippines guide: Explore Kawasaki KLX150 published Philippine pricing, dual-sport specifications, seat height, trail suitability and ownership costs. Check current dealer pricing and availability."
  }
};

export const MOTORCYCLE_PRICE_PAGE_TARGET_IDS = Object.freeze(Object.keys(PRICE_PAGE_TARGETS));

export function motorcyclePricePageSeo(modelId: Motorcycle["id"]): MotorcyclePricePageSeo | undefined {
  return PRICE_PAGE_TARGETS[modelId];
}

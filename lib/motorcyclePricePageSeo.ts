import type { Motorcycle } from "./types";

export type MotorcyclePricePageSeo = {
  heading: string;
  title: string;
  description: string;
  intro: string;
};

// Reviewed canonical-page descriptions and hero intros for eight original models.
// Their title, H1 and hero intro use the same brand + model price phrase.
const PRICE_PAGE_TARGETS: Readonly<Record<string, MotorcyclePricePageSeo>> = {
  "honda-click-125i": {
    "heading": "Honda Click 125i Price Philippines",
    "title": "Honda Click 125i Price Philippines",
    "description": "Honda Click 125i Price Philippines: Compare Honda Standard and Smart Edition prices, 125cc specs, CBS braking and installment planning. Verify dealer quotes.",
    "intro": "Honda Click 125i Price Philippines guide: Compare Honda Click 125i Standard and Smart Edition published prices, CBS braking, 125cc specs, fuel economy and installment estimates before requesting a dealer quote."
  },
  "yamaha-sniper-155": {
    "heading": "Yamaha Sniper 155 Price Philippines",
    "title": "Yamaha Sniper 155 Price Philippines",
    "description": "Yamaha Sniper 155 Price Philippines: Compare Yamaha Sniper 155 and 155 R price references, 155cc specs, variant-dependent ABS and ownership costs. Check quotes.",
    "intro": "Yamaha Sniper 155 Price Philippines guide: Compare published Yamaha Sniper 155 and Sniper 155 R dealer references, 155cc specs, six-speed manual riding and variant-dependent ABS before checking local quotes."
  },
  "rusi-classic-250i": {
    "heading": "Rusi Classic 250i Price Philippines",
    "title": "Rusi Classic 250i Price Philippines",
    "description": "Rusi Classic 250i Price Philippines: Check the sourced Rusi price reference, 250cc specs and ownership costs. Verify current stock, ABS and dealer pricing.",
    "intro": "Rusi Classic 250i Price Philippines guide: Review the third-party Rusi Classic 250i price reference, 250cc manual-bike specs and daily ownership costs. Confirm dealer pricing and ABS equipment on the exact unit."
  },
  "rusi-rfi-175": {
    "heading": "Rusi RFI 175 Price Philippines",
    "title": "Rusi RFI 175 Price Philippines",
    "description": "Rusi RFI 175 Price Philippines: Review Rusi's published price reference, 171.7cc scooter specs, fuel tank and estimated running costs. Confirm dealer pricing.",
    "intro": "Rusi RFI 175 Price Philippines guide: Check the published Rusi RFI 175 price reference, 171.7cc automatic scooter specifications, braking and fuel-use details, then confirm the seller's current quote."
  },
  "yamaha-yzf-r15-v3": {
    "heading": "Yamaha YZF-R15 V3 Price Philippines",
    "title": "Yamaha YZF-R15 V3 Price Philippines",
    "description": "Yamaha YZF-R15 V3 Price Philippines: Review Yamaha's historical ₱164,000 price reference, 155cc specs and used-bike checks. Not a current new-bike quote.",
    "intro": "Yamaha YZF-R15 V3 Price Philippines guide: Explore the Yamaha YZF-R15 V3 historical ₱164,000 Philippine reference, 155cc six-speed specs and used-bike checks. This is a previous generation, not a current new-bike price."
  },
  "yamaha-mio-i-125": {
    "heading": "Yamaha Mio i 125 Price Philippines",
    "title": "Yamaha Mio i 125 Price Philippines",
    "description": "Yamaha Mio i 125 Price Philippines: Check Yamaha's ₱75,900 dealer reference, 125cc specs, seat height and installment estimates. Prices vary by branch.",
    "intro": "Yamaha Mio i 125 Price Philippines guide: Compare Yamaha Mio i 125's dated ₱75,900 dealer reference, 125cc scooter specifications, seat height, financing scenarios and running costs. Confirm the exact branch price."
  },
  "yamaha-xmax": {
    "heading": "Yamaha XMAX Price Philippines",
    "title": "Yamaha XMAX Price Philippines",
    "description": "Yamaha XMAX Price Philippines: See Yamaha's ₱311,000 dealer reference, 292cc specs, ABS, fuel capacity and estimated monthly payments. Verify your quote.",
    "intro": "Yamaha XMAX Price Philippines guide: Compare Yamaha XMAX's dated ₱311,000 dealer reference with 292cc specifications, ABS, rider fit and monthly financing scenarios. Confirm branch pricing and model year."
  },
  "kawasaki-klx150": {
    "heading": "Kawasaki KLX150 Price Philippines",
    "title": "Kawasaki KLX150 Price Philippines",
    "description": "Kawasaki KLX150 Price Philippines: Compare Kawasaki's published price reference, dual-sport specs, seat height and ownership checks. Confirm dealer price.",
    "intro": "Kawasaki KLX150 Price Philippines guide: Explore Kawasaki KLX150 published Philippine pricing, dual-sport specifications, seat height, trail suitability and ownership costs. Check current dealer pricing and availability."
  }
};

export const MOTORCYCLE_PRICE_PAGE_TARGET_IDS = Object.freeze(Object.keys(PRICE_PAGE_TARGETS));

export function motorcyclePricePageSeo(modelId: Motorcycle["id"]): MotorcyclePricePageSeo | undefined {
  return PRICE_PAGE_TARGETS[modelId];
}

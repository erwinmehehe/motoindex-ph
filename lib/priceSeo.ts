import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { financingScenario } from "./financing";
import { php } from "./utils";
import { observedMarketRange } from "./marketChecks";
import { hasInstallmentLandingPage } from "./modelIntentLandingPages";

export type PriceSeoTarget = {
  title: string;
  description: string;
  heading: string;
  intro: string;
};

const targets: Record<string, PriceSeoTarget> = {
  "honda-giorno-plus": {
    title: "Honda Giorno Price Philippines 2026: Giorno+ Price & Specs",
    description: "Honda Giorno / Giorno+ price in the Philippines with current dealer references, 125cc specs, fuel economy, market checks and ownership planning.",
    heading: "Honda Giorno+ price in the Philippines (2026)",
    intro: "Philippine searches for Honda Giorno map to the Giorno+ model. Compare the current ₱101,900 All-New Giorno+ listing with the newer ₱106,000 dealer listing, and confirm the exact model code and branch quote before buying."
  },
  "yamaha-mio-gear": {
    title: "Yamaha Mio Gear Price Philippines 2026: SRP & Monthly",
    description: "Yamaha Mio Gear price in the Philippines with current ₱79,400 dealer reference, ₱4,000 down/monthly snapshot, market checks and installment planning.",
    heading: "Yamaha Mio Gear price in the Philippines (2026)",
    intro: "Check the current Mio Gear dealer price and financing snapshot, then replace the indicative downpayment, monthly figure, term and rate with the exact branch or lender quote."
  },
  "kawasaki-ninja-400": {
    title: "Kawasaki Ninja 400 Price Philippines: Historical & Used",
    description: "Kawasaki Ninja 400 historical Philippine price, used-bike context, 399cc specs and direct comparison with the current Ninja 500.",
    heading: "Kawasaki Ninja 400 price in the Philippines",
    intro: "The Ninja 400 is a previous generation. Keep its historical ₱340,900 Philippine reference separate from current used asking prices, and compare any used quote with the current Ninja 500 MSRP."
  },
  "honda-beat": {
    title: "Honda BeAT Price Philippines 2026: Playful vs Premium",
    description: "Honda BeAT price in the Philippines with current ₱72,500 Playful and ₱74,700 Premium references, specs, fuel economy and installment planning.",
    heading: "Honda BeAT price in the Philippines (2026)",
    intro: "Compare the current BeAT Playful and Premium price references before using any dealer promotion or monthly payment as the real purchase cost. Keep regular SRP, temporary discounts and financing separate."
  },
  "honda-crf150l": {
    title: "Honda CRF150L Price Philippines: Last Official SRP & Availability",
    description: "Honda CRF150L price Philippines reference with Honda's last located ₱147,900 SRP, 149cc specs, trail fit and current availability caveats.",
    heading: "Honda CRF150L price in the Philippines",
    intro: "MotoIndex's latest located Honda Philippines SRP for CRF150L is ₱147,900 from 2023. Treat that as a historical official reference and confirm 2026 stock and dealer pricing before planning a new-bike purchase."
  },
  "yamaha-mio-i-125": {
    title: "Yamaha Mio i 125 Price Philippines 2026: SRP & Monthly",
    description: "Yamaha Mio i 125 price in the Philippines with current ₱75,900 reference, 125cc specs, 750mm seat and editable installment planning.",
    heading: "Yamaha Mio i 125 price in the Philippines (2026)",
    intro: "Use the current ₱75,900 Mio i 125 dealer reference as a starting point, then compare the exact branch quote, down payment, term, rate method, registration and fees."
  },
  "suzuki-raider-r150": {
    title: "Suzuki Raider R150 Price Philippines 2026: SRP & Monthly",
    description: "Suzuki Raider R150 price in the Philippines with current ₱130,000 reference, 147cc specs, six-speed manual ownership and installment planning.",
    heading: "Suzuki Raider R150 price in the Philippines (2026)",
    intro: "Compare the current Raider R150 published price with the exact dealer quote and financing terms, then include insurance, registration, tires, chain and sprocket ownership in the budget."
  },
  "yamaha-xmax": {
    title: "Yamaha XMAX Price Philippines 2026: SRP, Specs & Monthly",
    description: "Yamaha XMAX price in the Philippines with current ₱311,000 dealer reference, 292cc specs, ABS, 13L tank and installment planning.",
    heading: "Yamaha XMAX price in the Philippines (2026)",
    intro: "Use the current ₱311,000 Philippine dealer reference for XMAX as a dated market check, then confirm the exact branch cash price, registration, insurance and financing before purchase."
  },
  "yamaha-aerox-v3": {
    title: "Yamaha Aerox V3 Price Philippines 2026: SRP & Variants",
    description: "Yamaha Aerox V3 price in the Philippines with dated SRP references, Standard/SP variant pricing, market checks and installment estimates.",
    heading: "Yamaha Aerox V3 price in the Philippines (2026)",
    intro: "Check the current Yamaha Aerox V3 price references, variant prices and dated market observations in one place. Use the installment calculator as a planning tool, then confirm the final cash price and fees with the seller."
  },
  "honda-adv-160": {
    title: "Honda ADV 160 Price Philippines 2026: SRP & Variants",
    description: "Honda ADV 160 price in the Philippines with dated SRP and market references, current variants, price history and installment planning.",
    heading: "Honda ADV 160 price in the Philippines (2026)",
    intro: "See current Honda ADV 160 price references and variant context without mixing manufacturer SRP with dealer or comparison-site observations. Dates and sources stay visible so you can verify the latest quote."
  },
  "yamaha-aerox-v2": {
    title: "Yamaha Aerox V2 Price Philippines: Historical SRP & Used Context",
    description: "Yamaha Aerox V2 historical Philippine launch price, generation context and links to current Aerox pricing and used-value research.",
    heading: "Yamaha Aerox V2 price in the Philippines",
    intro: "The Aerox V2 is a previous generation, so this page keeps its historical Philippine launch-price context separate from today’s Aerox V3 pricing and current used-market value."
  },
  "honda-click-125i": {
    title: "Honda Click 125i Price Philippines 2026: SRP & Installment",
    description: "Honda Click 125i price in the Philippines with current Standard/Smart Edition context, dated dealer checks, downpayment and monthly-payment snapshots.",
    heading: "Honda Click 125i price in the Philippines (2026)",
    intro: "Compare current Honda Click125 manufacturer and dealer price references, then check the exact Standard or Smart Edition unit before using any downpayment or monthly figure as a purchase quote."
  },
  "honda-pcx-160": {
    title: "Honda PCX 160 Price Philippines 2026: SRP & Installment",
    description: "Honda PCX 160 price in the Philippines with current Standard/RoadSync context, dated market checks, price history and installment estimate.",
    heading: "Honda PCX 160 price in the Philippines (2026)",
    intro: "Compare the current Honda PCX 160 price references, trim context and dated market checks. The installment estimate is editable so you can test your own down payment, term and rate."
  },
  "honda-click-160": {
    title: "Honda Click 160 Price Philippines 2026: SRP & Installment",
    description: "Honda Click 160 price in the Philippines with dated market checks, current price context, installment estimate and ownership links.",
    heading: "Honda Click 160 price in the Philippines (2026)",
    intro: "Check the Honda Click 160 price reference, recent market checks and an editable installment estimate. Confirm the exact cash price, registration charges and financing terms with the dealer before purchase."
  },
  "yamaha-nmax-v3": {
    title: "Yamaha NMAX V3 Price Philippines 2026: SRP & Variants",
    description: "Yamaha NMAX V3 price in the Philippines with current variant pricing, dated market checks, price history and installment planning.",
    heading: "Yamaha NMAX V3 price in the Philippines (2026)",
    intro: "See the current Yamaha NMAX V3 price range and variant context without mixing it with older NMAX generations. Use the family page when you need to compare V2 and V3 pricing side by side."
  },
  "yamaha-fazzio": {
    title: "Yamaha Fazzio Price Philippines 2026: SRP & Installment",
    description: "Yamaha Fazzio price in the Philippines with dated price references, current market checks, installment planning and ownership links.",
    heading: "Yamaha Fazzio price in the Philippines (2026)",
    intro: "Check the current Yamaha Fazzio price reference and dated market observations, then test a down payment and loan term using the editable installment calculator."
  },
  "cfmoto-450sr": {
    title: "CFMOTO 450SR Price Philippines 2026: SRP & Installment",
    description: "CFMOTO 450SR price in the Philippines with current SRP, financing estimate, specs, ownership costs and direct sport-bike alternatives.",
    heading: "CFMOTO 450SR price in the Philippines (2026)",
    intro: "Check the current CFMOTO 450SR Philippine price reference, then test down payment and monthly-payment assumptions before comparing the total ownership picture with other middleweight sport bikes."
  },
  "honda-adv-350": {
    title: "Honda ADV 350 Price Philippines 2026: SRP & Market Checks",
    description: "Honda ADV 350 price in the Philippines with dated market references, current price context, financing estimate and ownership research.",
    heading: "Honda ADV 350 price in the Philippines (2026)",
    intro: "Review the current Honda ADV 350 Philippine price reference with source dates and market checks. Dealer availability and final transaction pricing still need direct confirmation."
  }
};

export function priceSeoForModel(model: Motorcycle): PriceSeoTarget | undefined {
  return targets[model.id];
}

export function priceFaqsForModel(model: Motorcycle, priceLabel: string): FaqItem[] {
  const modelName = `${model.make} ${model.model}`;
  const range = observedMarketRange(model);
  const finance = financingScenario(range.from, 20, 36, 12);
  const financeHigh = financingScenario(range.to && range.to > range.from ? range.to : range.from, 20, 36, 12);

  if (model.marketStatus === "previous") {
    return [
      {
        question: `How much was the ${modelName} in the Philippines?`,
        answer: `The ${modelName} had a Philippine price of ${priceLabel} for this generation. It is now a previous-generation model, so current used prices will depend on year, mileage, condition and location.`
      },
      {
        question: `Is the ${modelName} price still the same today?`,
        answer: "Usually not. A previous-generation motorcycle can sell for more or less than its old launch price depending on condition, mileage, service history, registration, modifications and demand."
      },
      {
        question: `Where can I see the current ${model.make} generation price?`,
        answer: model.successorId
          ? "The current-generation replacement is linked near the top of this page. Use that model for current new-bike pricing and this page for the older generation."
          : "Check the current model lineup for the latest new-bike generation and its current Philippine price."
      }
    ];
  }

  const priceAnswer = range.to && range.to > range.from
    ? `The ${modelName} is priced from ${php(range.from)} to ${php(range.to)} in the Philippines. The exact amount depends on the variant and the seller's current cash price.`
    : `The ${modelName} starts at ${php(range.from)} in the Philippines. The final cash price can vary by dealer, location, registration charges and promotions.`;

  return [
    {
      question: `How much is the ${modelName} in the Philippines?`,
      answer: priceAnswer
    },
    {
      question: `Is the ${modelName} SRP the same at every dealer?`,
      answer: "No. The manufacturer SRP may be the same, but the final cash price can change once dealer fees, registration, insurance, financing and promotions are included. Compare quotes for the exact variant you want."
    },
    ...(!hasInstallmentLandingPage(model.id) ? [{
      question: `How much is the ${modelName} down payment and monthly installment?`,
      answer: model.id === "yamaha-aerox-v3" && range.to && range.to > range.from
        ? `Using the current Standard-to-SP price range, a 20% planning downpayment is about ${php(Math.round(finance.downPaymentPhp))} on the ${php(range.from)} price and ${php(Math.round(financeHigh.downPaymentPhp))} on the ${php(range.to)} price. At 36 months and 12% annual amortizing interest, the monthly estimates are about ${php(Math.round(finance.monthlyPhp))} and ${php(Math.round(financeHigh.monthlyPhp))}. Actual dealer minimum downpayment, fees and lender terms can differ.`
        : `At 20% down over 36 months with 12% annual interest, the estimate is about ${php(Math.round(finance.downPaymentPhp))} down and ${php(Math.round(finance.monthlyPhp))} per month. Actual dealer and lender terms can be different.`
    }] : []),
    {
      question: `When was the ${modelName} price checked?`,
      answer: `The latest price reference on this page was checked on ${model.marketPriceCheckedAt || model.verifiedAt}. Dealer prices can change after that date, so confirm the current quote before buying.`
    }
  ];
}

import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { financingScenario } from "./financing";
import { php } from "./utils";
import { observedMarketRange } from "./marketChecks";

export type PriceSeoTarget = {
  title: string;
  description: string;
  heading: string;
  intro: string;
};

const targets: Record<string, PriceSeoTarget> = {
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
    {
      question: `How much is the ${modelName} down payment and monthly installment?`,
      answer: `At 20% down over 36 months with 12% annual interest, the estimate is about ${php(Math.round(finance.downPaymentPhp))} down and ${php(Math.round(finance.monthlyPhp))} per month. Actual dealer and lender terms can be different.`
    },
    {
      question: `When was the ${modelName} price checked?`,
      answer: `The latest price reference on this page was checked on ${model.marketPriceCheckedAt || model.verifiedAt}. Dealer prices can change after that date, so confirm the current quote before buying.`
    }
  ];
}

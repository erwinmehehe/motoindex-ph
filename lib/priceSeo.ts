import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";

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
  if (model.marketStatus === "previous") {
    return [
      {
        question: `How much was the ${modelName} in the Philippines?`,
        answer: `${priceLabel} is the historical Philippine price context stored for this generation. It is not presented as a current new-bike dealer quote.`
      },
      {
        question: `Is the ${modelName} price still the same today?`,
        answer: "No assumption is made that the historical launch SRP equals today’s market value. Used prices depend on year, mileage, condition, registration, modifications and seller." 
      },
      {
        question: `Where can I see the current ${model.make} generation price?`,
        answer: model.successorId ? "Use the linked successor model on this page for current new-bike pricing. Historical and current generations are kept separate to avoid mixing prices." : "Use MotoIndex’s current model catalog and dated price pages for current new-bike pricing."
      }
    ];
  }

  return [
    {
      question: `How much is the ${modelName} in the Philippines?`,
      answer: `MotoIndex currently shows ${priceLabel} based on the dated price references on this page. Check the source date and confirm the final cash price with the seller because availability, fees and promotions can change.`
    },
    {
      question: `Is the ${modelName} SRP the same at every dealer?`,
      answer: "Not necessarily. Manufacturer SRP, dealer cash prices, financing offers, registration charges and promotions can differ. MotoIndex keeps dated sources separate instead of averaging unlike-for-like prices."
    },
    {
      question: `Can I estimate the ${modelName} monthly installment?`,
      answer: "Yes. The calculator on this page lets you change the down payment, term and interest assumptions. It is a planning estimate, not a lender or dealer quotation."
    },
    {
      question: `When was the ${modelName} price checked?`,
      answer: `The model record was last verified on ${model.marketPriceCheckedAt || model.verifiedAt}. Open the linked source on the page to confirm the latest published price.`
    }
  ];
}

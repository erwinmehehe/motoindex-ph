import type { RecommendationGuide } from "./types";

export const motortradeGapGuides2026: RecommendationGuide[] = [
  {
    slug: "manual-motorcycles-philippines",
    kicker: "Manual motorcycles",
    title: "Manual motorcycles in the Philippines",
    seoTitle: "Manual Motorcycle Prices Philippines 2026 | Models & Specs",
    description: "Compare manual motorcycle prices in the Philippines for 2026, including engine, power, weight, seat height, ABS and riding category.",
    primaryKeyword: "manual motorcycle Philippines",
    secondaryKeywords: [
      "manual motorcycles Philippines",
      "manual motorbike Philippines",
      "manual motorcycle price Philippines",
      "manual motorcycle Philippines price list",
      "manual motor price Philippines",
      "clutch motorcycle Philippines",
      "manual vs automatic motorcycle Philippines"
    ],
    directAnswer: "This guide filters MotoIndex to current Philippine-market motorcycles whose transmission is explicitly recorded as Manual. It keeps price, engine size, power, weight, seat height and braking visible so riders can compare very different manual motorcycle categories without treating engine size as a quality score.",
    inclusionRules: [
      "Transmission is recorded as Manual",
      "Current Philippine-market motorcycle"
    ],
    orderingRule: "Published starting price from lowest to highest; price order is not an overall quality ranking.",
    tieBreakers: ["Lower curb weight", "Lower published seat height"],
    orderLabel: "Price order",
    sourcePolicy: "Published prices use dated Philippine manufacturer, dealer or market checks. Transmission, engine, dimensions and braking equipment come from each canonical model record.",
    caveats: [
      "Manual motorcycles span business bikes, street bikes, dual-sports, cruisers, sport bikes and larger touring models, so category and intended use matter as much as price.",
      "Clutch feel, low-speed balance, throttle response and riding position cannot be fully judged from a specification table.",
      "Dealer stock, promotions, freight, registration and financing can change the final amount paid."
    ],
    tableColumns: ["price", "engine", "power", "weight", "seat", "abs", "context"],
    quickPicks: [
      { label: "Lowest price", metric: "price" },
      { label: "Lightest", metric: "weight" },
      { label: "Lowest seat", metric: "seat" },
      { label: "Highest power", metric: "power" },
      { label: "Largest engine", metric: "engine" }
    ],
    editorialSections: [
      "Lowest-priced manual motorcycles",
      "Manual street and sport motorcycles",
      "Manual dual-sport and adventure choices",
      "Manual vs automatic motorcycles",
      "What to compare before buying a manual motorcycle"
    ],
    faqQuestions: [
      "What is the cheapest manual motorcycle in the Philippines?",
      "Which manual motorcycle is lightest?",
      "Which manual motorcycle has the lowest seat?",
      "Which manual motorcycles list ABS?",
      "Are dealer prices the same as SRP for manual motorcycles?"
    ],
    relatedGuideSlugs: [
      "automatic-motorcycles-philippines",
      "street-motorcycles-philippines",
      "sport-motorcycles-philippines",
      "dual-sport-motorcycles-philippines",
      "motorcycles-under-100k"
    ],
    intent: "category"
  }
];

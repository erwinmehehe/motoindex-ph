import { helmetProducts } from "@/lib/catalog";
import type { HelmetProduct } from "@/lib/types";

export type HelmetSeoCollectionSlug =
  | "under-3000"
  | "under-5000"
  | "ece-22-06"
  | "intercom-ready"
  | "for-commuting";

export type HelmetSeoCollection = {
  slug: HelmetSeoCollectionSlug;
  title: string;
  seoTitle: string;
  description: string;
  kicker: string;
  intro: string;
  selectionNote: string;
  buyingHeading: string;
  buyingCopy: string[];
  checks: string[];
  faqs: { question: string; answer: string }[];
};

const roadTypes = new Set<HelmetProduct["helmetType"]>(["Full face", "Modular", "Half face", "Open face"]);

export const helmetSeoCollections: HelmetSeoCollection[] = [
  {
    slug: "under-3000",
    title: "Motorcycle helmets under ₱3,000 in the Philippines",
    seoTitle: "Motorcycle Helmets Under ₱3,000 Philippines 2026",
    description: "Compare checked motorcycle helmets priced from ₱3,000 or less in the Philippines by type, certification evidence, visor setup and size.",
    kicker: "Budget helmet guide",
    intro: "These are verified MotoIndex helmet records with an observed starting price of ₱3,000 or less. The list is a price filter, not a safety ranking. Check the exact unit for the required Philippine conformity mark and make sure the fit is correct before buying.",
    selectionNote: "Included when the checked starting price is ₱3,000 or less. A graphic, size, visor bundle or seller can cost more than the amount shown.",
    buyingHeading: "What matters more than finding the cheapest helmet",
    buyingCopy: [
      "Start with fit and the conformity mark on the actual helmet, then compare shell, visor and liner features. A lower price does not automatically make a helmet unsuitable, and a higher price does not remove the need to inspect the exact unit.",
      "Budget listings change quickly because colors and sizes move through promotions at different times. Treat the recorded amount as a dated starting point and open the product source before paying."
    ],
    checks: ["PS or ICC mark on the exact Philippine-market unit", "Snug fit with no concentrated pressure point", "Visor closure and replacement-visor availability", "Correct size and graphic in the seller listing"],
    faqs: [
      { question: "Can I buy a motorcycle helmet for under ₱3,000 in the Philippines?", answer: "Yes. MotoIndex has checked helmet records with observed starting prices at or below ₱3,000. Stock, size, graphics and seller promotions can change the final price." },
      { question: "Is a ₱3,000 helmet safe?", answer: "Price alone cannot answer that. Check the required Philippine conformity mark on the exact unit, use the correct size, inspect the retention system and verify the model-specific certification information." },
      { question: "Why can the same helmet model cost more than ₱3,000?", answer: "Graphics, visor bundles, size availability and seller promotions can change the price. MotoIndex uses the checked starting price as the filter rather than claiming every variant is below the budget." }
    ]
  },
  {
    slug: "under-5000",
    title: "Motorcycle helmets under ₱5,000 in the Philippines",
    seoTitle: "Motorcycle Helmets Under ₱5,000 Philippines 2026",
    description: "Compare checked motorcycle helmets under ₱5,000 in the Philippines by price, type, visor features, certification evidence and fit information.",
    kicker: "Mid-budget helmet guide",
    intro: "This page groups verified helmets with an observed starting price of ₱5,000 or less. It is designed for riders comparing a realistic commuter budget while keeping type, visor equipment, fit and certification evidence visible.",
    selectionNote: "Included when the checked starting price is ₱5,000 or less. The exact seller price can differ by size, color, graphic and included accessories.",
    buyingHeading: "How to use a ₱5,000 helmet budget",
    buyingCopy: [
      "Use the extra budget to compare the features you will actually notice on every ride: fit, ventilation, visor quality, removable liners, speaker clearance and replacement parts. Do not pay more for a graphic if the fit is worse.",
      "For Philippine commuting, rain and heat can make visor and ventilation details more useful than a long marketing feature list. Check whether an anti-fog insert is supported and whether replacement visors are easy to source."
    ],
    checks: ["Exact conformity mark and certification label", "Head-shape and cheek-pad fit", "Anti-fog or Pinlock provision where needed", "Replacement visor and liner availability"],
    faqs: [
      { question: "What motorcycle helmets can I get for under ₱5,000?", answer: "MotoIndex filters its verified helmet catalog by checked starting price and shows the models currently recorded at ₱5,000 or less. Use each model page for the exact source and check date." },
      { question: "Should I choose full-face or modular under ₱5,000?", answer: "Choose by riding use and fit. Full-face gives a fixed chin bar, while modular helmets add flip-up convenience but are usually heavier and mechanically more complex." },
      { question: "Does a more expensive helmet automatically have better certification?", answer: "No. Price and certification are different things. Always check the exact model and the conformity marking on the unit sold in the Philippines." }
    ]
  },
  {
    slug: "ece-22-06",
    title: "ECE 22.06 motorcycle helmets in the Philippines",
    seoTitle: "ECE 22.06 Helmets Philippines: Checked Models 2026",
    description: "Compare checked motorcycle helmets with ECE 22.06 certification references, plus Philippine PS or ICC marking guidance, prices and helmet types.",
    kicker: "Certification guide",
    intro: "These verified MotoIndex records explicitly reference ECE 22.06 or R22.06 in the checked model data. That certification reference does not replace the Philippine requirement to inspect the PS or ICC conformity marking on the exact unit offered locally.",
    selectionNote: "Included only when the stored model-level certification text explicitly references ECE 22.06 or R22.06. MotoIndex does not infer certification from a brand name.",
    buyingHeading: "ECE 22.06 and Philippine conformity are separate checks",
    buyingCopy: [
      "ECE 22.06 is a model-level homologation reference. For a Philippine purchase, also inspect the actual helmet for the local PS or ICC marking rather than assuming an overseas certification label is enough by itself.",
      "Certification can vary by market or production batch, so use the exact model page and then verify the physical unit. Fit remains essential because a correctly certified helmet still needs to sit securely on your head."
    ],
    checks: ["ECE 22.06 or R22.06 shown for the exact model", "PS or ICC mark on the local unit", "Correct helmet size and secure retention", "Market-specific visor or chin-bar homologation where relevant"],
    faqs: [
      { question: "What is an ECE 22.06 helmet?", answer: "It is a helmet model homologated to UNECE Regulation No. 22.06 in the market covered by that approval. MotoIndex only includes a model here when the checked record explicitly references 22.06." },
      { question: "Is ECE 22.06 enough for motorcycle use in the Philippines?", answer: "Do not rely on the ECE label alone. Philippine buyers should inspect the exact helmet for the applicable PS or ICC conformity marking." },
      { question: "Does every model from an ECE-certified brand have ECE 22.06?", answer: "No. Certification belongs to the exact model and market configuration. MotoIndex does not apply one model's certification to an entire brand." }
    ]
  },
  {
    slug: "intercom-ready",
    title: "Intercom-ready motorcycle helmets in the Philippines",
    seoTitle: "Intercom-Ready Motorcycle Helmets Philippines 2026",
    description: "Compare checked intercom-ready motorcycle helmets in the Philippines with speaker provision, prices, helmet types, sizing and visor details.",
    kicker: "Communication-ready helmets",
    intro: "These verified helmet records are marked as having intercom or speaker provisions in the MotoIndex catalog. The label means the helmet has recorded accommodation for communication hardware, not that every intercom kit will fit without checking speaker, microphone and clamp clearance.",
    selectionNote: "Included when the model-level record lists intercom readiness or provision. Always match the exact intercom hardware to the helmet before installation.",
    buyingHeading: "Check the helmet and the intercom as one system",
    buyingCopy: [
      "Speaker pockets can reduce pressure on the ears, but depth and position still matter. A thick speaker can create a hotspot even in a helmet that is marketed as communication-ready.",
      "Check microphone placement, cable routing and whether the intercom body uses a clamp or adhesive mount. Avoid modifying the helmet shell or impact liner to force an installation."
    ],
    checks: ["Speaker-pocket position and depth", "Boom or wired-microphone clearance", "Clamp or adhesive mounting space", "Controls that remain usable with gloves"],
    faqs: [
      { question: "What does intercom-ready helmet mean?", answer: "MotoIndex uses the term when the checked model record lists provision for communication hardware, typically speaker or microphone space. It does not guarantee compatibility with every intercom brand." },
      { question: "Can I put an intercom in any motorcycle helmet?", answer: "Some kits can be installed in many helmets, but speaker, microphone, clamp and cable clearance vary. Do not cut or modify protective shell or liner material to make a kit fit." },
      { question: "Is a modular helmet better for an intercom?", answer: "Not automatically. Modular helmets can be convenient for communication, but speaker pockets, microphone routing, wind noise and fit are model-specific." }
    ]
  },
  {
    slug: "for-commuting",
    title: "Motorcycle helmets for commuting in the Philippines",
    seoTitle: "Motorcycle Helmets for Commuting Philippines 2026",
    description: "Compare checked road motorcycle helmets for Philippine commuting by type, price, visor setup, intercom readiness, fit and certification evidence.",
    kicker: "Daily riding guide",
    intro: "This is a commuter comparison set built from verified road-helmet records, not a universal ranking. Full-face, modular and open-face formats solve different problems in heat, rain and stop-go traffic, so compare the tradeoffs against your actual route.",
    selectionNote: "Includes verified road helmets in full-face, modular, half-face and open-face formats. Off-road-only models are excluded from this commuter set.",
    buyingHeading: "Choose for the conditions you ride in every day",
    buyingCopy: [
      "For a daily commute, comfort has a safety consequence because a helmet that is painfully hot, noisy or poorly fitted is harder to wear correctly. Compare ventilation, visor fog management, weight and fit alongside coverage.",
      "A full-face gives a fixed chin bar, a modular adds stop-and-go convenience, and an open-face gives more airflow while leaving the chin and jaw exposed. There is no single format that is best for every route."
    ],
    checks: ["Secure fit for repeated daily use", "Visor clarity and rain or anti-fog plan", "Ventilation at low city speeds", "PS or ICC marking on the exact unit"],
    faqs: [
      { question: "What helmet type is best for daily commuting?", answer: "There is no universal answer. Full-face offers the most complete coverage among common road formats, modular adds flip-up convenience, and open-face increases airflow while exposing more of the face." },
      { question: "Should a commuter helmet have an intercom?", answer: "Only if you need audio navigation or communication. If you do, prioritize a helmet with suitable speaker and microphone clearance rather than forcing hardware into the liner." },
      { question: "What should I check for rainy-season commuting?", answer: "Check visor sealing, anti-fog provisions, ventilation, visibility and fit. A clear visor and a practical fog-management plan matter during repeated wet-weather use." }
    ]
  }
];

export function getHelmetSeoCollection(slug: string) {
  return helmetSeoCollections.find((collection) => collection.slug === slug);
}

export function getHelmetSeoCollectionProducts(slug: HelmetSeoCollectionSlug) {
  const verified = helmetProducts.filter((product) => product.status === "verified");
  let products: HelmetProduct[];
  if (slug === "under-3000") products = verified.filter((product) => typeof product.priceFromPhp === "number" && product.priceFromPhp <= 3000);
  else if (slug === "under-5000") products = verified.filter((product) => typeof product.priceFromPhp === "number" && product.priceFromPhp <= 5000);
  else if (slug === "ece-22-06") products = verified.filter((product) => /(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(product.certification || ""));
  else if (slug === "intercom-ready") products = verified.filter((product) => product.intercomReady);
  else products = verified.filter((product) => roadTypes.has(product.helmetType));
  return products.sort((a, b) => (a.priceFromPhp ?? Number.MAX_SAFE_INTEGER) - (b.priceFromPhp ?? Number.MAX_SAFE_INTEGER) || a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
}

export function isIndexableHelmetSeoCollection(slug: HelmetSeoCollectionSlug) {
  return getHelmetSeoCollectionProducts(slug).length >= 3;
}

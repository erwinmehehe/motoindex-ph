import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { observedMarketPriceLabel } from "./marketChecks";
import { getVerifiedVariantsForModel } from "./variants";
import { performanceAnswerFor } from "./modelPerformance";
import { php } from "./utils";
import { wave3ModelIntentDepthProfile } from "./modelIntentDepthWave3_2026";
import { wave5ModelIntentDepthProfile } from "./modelIntentDepthWave5_2026";
import { wave6ModelIntentDepthProfile } from "./modelIntentDepthWave6_2026";
import { wave7ModelIntentDepthProfile } from "./modelIntentDepthWave7_2026";
import { wave8ModelIntentDepthProfile } from "./modelIntentDepthWave8_2026";
import { hasColorIntentLandingPage } from "./modelColorLandingPages";

export type CanonicalIntentKey = "price" | "specs" | "colors" | "variants" | "performance" | "ownership";

export type ModelIntentDepthProfile = {
  seoTitle: string;
  seoDescription: string;
  intro: string;
  intents: CanonicalIntentKey[];
};

const profiles: Record<string, ModelIntentDepthProfile> = {
  "honda-pcx-160": {
    seoTitle: "Honda PCX160 Price Philippines 2026 | Standard vs RoadSync",
    seoDescription: "Honda PCX160 price Philippines 2026 with Standard vs RoadSync, 157cc specs, ABS/HSTC differences, colors, monthly estimate, ownership and dealer quote checks.",
    intro: "Keep PCX160 price, trim, specification and ownership research on one canonical page so Standard and RoadSync comparisons do not fragment into thin detail URLs.",
    intents: ["price", "variants", "specs", "ownership"]
  },
  "honda-click-160": {
    seoTitle: "Honda Click 160 Price Philippines 2026 | Specs & Colors",
    seoDescription: "Honda Click 160 price Philippines 2026 with 157cc specs, colors, seat height, fuel economy, CBS, monthly estimate, ownership costs and dealer quote checks.",
    intro: "Click160 search demand is primarily model, price and specification intent, so this page answers those directly before sending riders deeper into financing and ownership tools.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-navi": {
    seoTitle: "Honda Navi Price Philippines | Specs, Seat Height & Speed",
    seoDescription: "Honda Navi Philippines guide with price context, 109cc specs, seat height, weight, fuel tank, tire sizes, ownership checks and evidence-based top-speed context.",
    intro: "Honda Navi research mixes specification, price and performance questions. MotoIndex keeps those answers together and labels top-speed evidence instead of turning rider claims into an official specification.",
    intents: ["specs", "price", "performance", "ownership"]
  },
  "yamaha-sniper-155": {
    seoTitle: "Yamaha Sniper 155 Price Philippines 2026 | Specs & Colors",
    seoDescription: "Yamaha Sniper 155 price Philippines 2026 with 155cc specs, colors, seat height, weight, tire sizes, ownership costs, variants and dealer quote guidance.",
    intro: "Sniper 155 buyers usually need the current price, core specifications and exact color/trim context before comparing financing or sport-underbone alternatives.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-adv-350": {
    seoTitle: "Honda ADV350 Price Philippines 2026 | Colors, Specs & ABS",
    seoDescription: "Honda ADV350 price Philippines 2026 with colors, 330cc specs, seat height, weight, ABS, fuel capacity, monthly estimate, ownership and maxi-scooter options.",
    intro: "ADV350 demand combines price and color interest with maxi-scooter specification research, so the canonical page surfaces those answers without splitting them into separate detail pages.",
    intents: ["price", "colors", "specs", "ownership"]
  },
  "yamaha-fazzio": {
    seoTitle: "Yamaha Fazzio Price Philippines 2026 | Specs, Colors & Fit",
    seoDescription: "Yamaha Fazzio price Philippines 2026 with colors, 125cc specs, 750mm seat, light curb weight, tire sizes, monthly estimate and commuter ownership guidance.",
    intro: "Fazzio searches are heavily price-led, but color, weight, seat height and commuter ownership are the practical checks that separate current units from older inventory.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "suzuki-raider-r150": {
    seoTitle: "Suzuki Raider R150 Price Philippines 2026 | Specs & Colors",
    seoDescription: "Suzuki Raider R150 price Philippines 2026 with colors, 147cc specs, seat height, tire sizes, braking, ownership costs and direct underbone alternatives.",
    intro: "Raider R150 intent spans current pricing, specification and color questions. The canonical page keeps those together and avoids creating thin variant or FAQ descendants.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-adv-160": {
    seoTitle: "Honda ADV160 Price Philippines 2026 | ABS vs RoadSync Guide",
    seoDescription: "Honda ADV160 price Philippines 2026 with ABS vs RoadSync, 157cc specs, colors, 780mm seat, fuel economy, HSTC, monthly estimate and ownership guidance.",
    intro: "ADV160 is a trim-sensitive purchase, so the page puts ABS versus RoadSync pricing and equipment alongside the shared 157cc specifications and ownership context.",
    intents: ["price", "variants", "specs", "colors"]
  },
  "honda-giorno-plus": {
    seoTitle: "Honda Giorno+ Price Philippines 2026 | Specs, Colors & Fit",
    seoDescription: "Honda Giorno+ price Philippines 2026 with colors, 125cc specs, seat height, weight, tire sizes, fuel capacity, monthly estimate and commuter ownership.",
    intro: "Giorno+ searches often use the shorter Honda Giorno name, but the canonical page keeps current Philippine price and specification research tied to the correct Giorno+ model.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-beat": {
    seoTitle: "Honda BeAT Price Philippines 2026 | Playful vs Premium Guide",
    seoDescription: "Honda BeAT price Philippines 2026 with Playful vs Premium, colors, 110cc specs, fuel economy, 742mm seat, CBS, monthly estimate and daily ownership guidance.",
    intro: "BeAT buyers commonly compare current pricing with older V1/V2/V3 references. This page centers the current Philippine model while keeping the practical commuter specifications clear.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "yamaha-xmax": {
    seoTitle: "Yamaha XMAX Price Philippines 2026 | Colors, Specs & ABS",
    seoDescription: "Yamaha XMAX price Philippines 2026 with colors, 292cc specs, seat height, ABS, fuel capacity, monthly estimate, ownership costs and maxi-scooter alternatives.",
    intro: "XMAX demand is led by Philippine price intent, followed by model-year, color and specification questions. The canonical page answers those without creating separate price or color URLs.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-x-adv": {
    seoTitle: "Honda X-ADV Price Philippines 2026 | 750 Specs, DCT & ABS",
    seoDescription: "Honda X-ADV price Philippines 2026 with 745cc specs, DCT, seat height, weight, ABS, tire sizes, ownership costs, monthly estimate and touring alternatives.",
    intro: "X-ADV research is a high-ticket decision where price alone is insufficient. The canonical page keeps DCT, weight, seat height, braking and ownership context beside the Philippine price reference.",
    intents: ["price", "specs", "ownership", "colors"]
  },
  "yamaha-mio-i-125": {
    seoTitle: "Yamaha Mio i 125 Price Philippines | Specs & Seat Height",
    seoDescription: "Yamaha Mio i 125 Philippines guide with price context, 125cc specs, seat height, weight, tire sizes, fuel capacity, ownership and availability guidance.",
    intro: "Mio i 125 search results often mix it with Mio Soul and Mio Sporty. This canonical page keeps the model identity, price context and core specifications separate.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "yamaha-xsr155": {
    seoTitle: "Yamaha XSR155 Price Philippines 2026 | Specs & Alternatives",
    seoDescription: "Yamaha XSR155 price Philippines 2026 with 155cc specs, seat height, weight, tire sizes, ownership costs, dealer quote guidance and roadster alternatives.",
    intro: "XSR155 shoppers frequently move from price into comparison intent, so this page makes the core specifications and ownership trade-offs clear before the alternatives section.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "honda-winner-x": {
    seoTitle: "Honda Winner X Price Philippines 2026 | Specs, Colors & Fit",
    seoDescription: "Honda Winner X price Philippines 2026 with colors, 150cc-class specs, seat height, weight, tire sizes, ownership costs, variants and dealer quote guidance.",
    intro: "Winner X demand includes legacy Winner 150 phrasing, price and color questions. The canonical page keeps those searches attached to the correct current model record.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "suzuki-burgman-street": {
    seoTitle: "Suzuki Burgman Street Price Philippines 2026 | Specs Guide",
    seoDescription: "Suzuki Burgman Street price Philippines 2026 with colors, 124cc specs, seat height, fuel economy, ownership checks, variants and 125cc scooter alternatives.",
    intro: "Burgman Street search demand spans price, variant and color intent, so MotoIndex keeps those answers on the main model page and separates the Street EX as its own model where appropriate.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "yamaha-yzf-r3": {
    seoTitle: "Yamaha R3 Price Philippines 2026 | Specs & Ownership Guide",
    seoDescription: "Yamaha R3 price Philippines 2026 with 321cc specs, seat height, weight, tire sizes, ownership costs, rider-fit context and sport-bike alternatives in PH.",
    intro: "R3 searches combine Philippine price with top-speed and specification questions. MotoIndex keeps performance claims evidence-labeled rather than treating dashboard videos as official figures.",
    intents: ["price", "specs", "performance", "ownership"]
  },
  "yamaha-yzf-r15m": {
    seoTitle: "Yamaha R15M Price Philippines 2026 | Specs, Colors & Fit",
    seoDescription: "Yamaha R15M price Philippines 2026 with colors, 155cc specs, seat height, weight, tire sizes, ownership costs and lightweight sport-bike alternatives.",
    intro: "R15M demand includes R15 legacy naming, Philippine price and color intent. The canonical page keeps current-model research together instead of cloning R15 descendant URLs.",
    intents: ["price", "specs", "colors", "ownership"]
  },
  "suzuki-burgman-400": {
    seoTitle: "Suzuki Burgman 400 Price Philippines 2026 | Specs & ABS",
    seoDescription: "Suzuki Burgman 400 price Philippines 2026 with 400cc specs, ABS, 755mm seat, weight, tire sizes, ownership costs, monthly estimate and maxi-scooter options.",
    intro: "Burgman 400 demand is heavily price-led, but weight, seat height, ABS, tire sizes and CVT ownership are essential for comparing it with other maxi scooters.",
    intents: ["price", "specs", "ownership", "colors"]
  },
  "kawasaki-ninja-400": {
    seoTitle: "Kawasaki Ninja 400 Price Philippines | Used & Ninja 500",
    seoDescription: "Kawasaki Ninja 400 Philippines guide with historical price, 399cc specs, seat height, top-speed context, used-bike checks, ownership and Ninja 500 successor.",
    intro: "Ninja 400 remains a large search even though it is a previous generation. The canonical page keeps historical price and specs useful while making current-new-bike research point toward the Ninja 500.",
    intents: ["price", "specs", "performance", "ownership"]
  }
};

export function modelIntentDepthProfile(modelId: string) {
  return profiles[modelId] || wave3ModelIntentDepthProfile(modelId) || wave5ModelIntentDepthProfile(modelId) || wave6ModelIntentDepthProfile(modelId) || wave7ModelIntentDepthProfile(modelId) || wave8ModelIntentDepthProfile(modelId);
}

function priceAnswer(model: Motorcycle) {
  const label = observedMarketPriceLabel(model);
  if (model.marketStatus === "previous" || model.marketStatus === "discontinued") {
    return `${label} is the stored historical price reference for the ${model.make} ${model.model}. Treat it as context for used-bike research, not a guaranteed current new-bike quote.`;
  }
  if (model.marketStatus === "uncertain") {
    return `${label} is the available Philippine price reference for the ${model.make} ${model.model}, but current national availability still needs verification. Confirm dealer stock and the final quote before purchase.`;
  }
  return `MotoIndex currently shows ${label} for the ${model.make} ${model.model}. Confirm the exact variant, branch cash price, registration, insurance and financing terms before purchase.`;
}

function specsAnswer(model: Motorcycle) {
  return `The ${model.make} ${model.model} uses a ${model.engineCc} cc engine rated at ${model.powerHp} hp and ${model.torqueNm} Nm. It has a ${model.seatHeightMm} mm seat, weighs ${model.curbWeightKg} kg, carries ${model.fuelTankL} L of fuel and uses ${model.frontTire} front / ${model.rearTire} rear tires.`;
}

function colorsAnswer(model: Motorcycle) {
  if (!model.colors.length) return `MotoIndex does not have a verified current color list for the ${model.make} ${model.model}. Confirm the exact model-year paint options with the dealer before reserving.`;
  return `Current MotoIndex coverage lists ${model.colors.join(", ")}. Paint availability can vary by model year, trim and dealer stock, so confirm the exact unit before reserving.`;
}

function variantsAnswer(model: Motorcycle) {
  const variants = getVerifiedVariantsForModel(model.id);
  if (variants.length < 2) return `MotoIndex does not split unverified trims into separate pages. Confirm the exact ${model.make} ${model.model} variant and included equipment before comparing quotes.`;
  return `Verified Philippine variants covered here are ${variants.map((variant) => `${variant.name} at ${php(variant.srpPhp)}`).join("; ")}. Use the variant matrix for equipment differences and confirm the current dealer quote.`;
}

function ownershipAnswer(model: Motorcycle) {
  const transmission = model.transmission ? `${model.transmission.toLowerCase()} transmission` : "listed transmission";
  return `Ownership planning should include the ${transmission}, ${model.frontTire} front and ${model.rearTire} rear tires, ${model.abs} braking specification, insurance, scheduled service and the exact local parts/service network for this model.`;
}

export function canonicalIntentAnswer(model: Motorcycle, intent: CanonicalIntentKey) {
  if (intent === "price") return priceAnswer(model);
  if (intent === "specs") return specsAnswer(model);
  if (intent === "colors") return colorsAnswer(model);
  if (intent === "variants") return variantsAnswer(model);
  if (intent === "performance") return performanceAnswerFor(model.id)?.answer || `MotoIndex does not have enough evidence to publish a verified top-speed figure for the ${model.make} ${model.model}. Manufacturer specs and repeatable stock-bike tests take priority over isolated rider claims.`;
  return ownershipAnswer(model);
}

export function canonicalIntentQuestion(model: Motorcycle, intent: CanonicalIntentKey) {
  if (intent === "price") return `How much is the ${model.make} ${model.model} in the Philippines?`;
  if (intent === "specs") return `What are the ${model.make} ${model.model} specifications?`;
  if (intent === "colors") return `What colors are available for the ${model.make} ${model.model}?`;
  if (intent === "variants") return `What variants are available for the ${model.make} ${model.model}?`;
  if (intent === "performance") return `What is the ${model.make} ${model.model} top speed?`;
  return `What should I budget for when owning a ${model.make} ${model.model}?`;
}

export function canonicalIntentFaqs(model: Motorcycle): FaqItem[] {
  const profile = modelIntentDepthProfile(model.id);
  if (!profile) return [];
  return profile.intents
    .filter((intent) => intent !== "price" && intent !== "performance" && !(intent === "colors" && hasColorIntentLandingPage(model.id)))
    .map((intent) => ({
      question: canonicalIntentQuestion(model, intent),
      answer: canonicalIntentAnswer(model, intent)
    }));
}

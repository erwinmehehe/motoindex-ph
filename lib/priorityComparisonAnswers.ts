import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { observedMarketPriceLabel } from "./marketChecks";
import { getVerifiedVariantsForModel } from "./variants";
import { php } from "./utils";

function variantSummary(model: Motorcycle) {
  const variants = getVerifiedVariantsForModel(model.id);
  return variants.length
    ? variants.map(variant => variant.name + " " + php(variant.srpPhp)).join("; ")
    : "no verified trim-level price matrix";
}

/**
 * Two canonical comparisons get rider-question answers derived from verified
 * catalog facts and variant references. The identical Q&A list is rendered
 * visibly and emitted in FAQPage structured data; neither implies live stock.
 */
export function priorityComparisonAnswers(slug: string, a: Motorcycle, b: Motorcycle): FaqItem[] | undefined {
  if (a.marketStatus !== "current" || b.marketStatus !== "current") return undefined;

  if (slug === "aerox-v3-vs-nmax-v3" && a.id === "yamaha-aerox-v3" && b.id === "yamaha-nmax-v3") {
    return [
      {
        question: "Aerox V3 or NMAX V3: which suits everyday riding?",
        answer: "The Aerox V3 lists " + a.curbWeightKg + " kg curb weight, a " + a.seatHeightMm + " mm seat and a " + a.fuelTankL +
          " L tank. The NMAX V3 lists " + b.curbWeightKg + " kg, a " + b.seatHeightMm + " mm seat and a " + b.fuelTankL +
          " L tank. Aerox is lighter by " + (b.curbWeightKg - a.curbWeightKg) +
          " kg in these records; NMAX has the lower published seat and larger fuel tank. Decide by rider fit, parking, passenger needs and exact trim rather than assuming one is universally better."
      },
      {
        question: "How do Aerox V3 Standard/SP and NMAX V3 Standard/Tech Max prices compare?",
        answer: "Verified variant references list Aerox V3 as " + variantSummary(a) + " and NMAX V3 as " + variantSummary(b) +
          ". The broader observed market price spans are " + observedMarketPriceLabel(a) + " and " + observedMarketPriceLabel(b) +
          " respectively. These are dated price references, not confirmed branch inventory or financed transaction quotes."
      },
      {
        question: "Are YECVT, ABS and traction control included on every Aerox V3 and NMAX V3?",
        answer: "Do not apply one trim's equipment to every version. The verified Aerox SP and NMAX Tech Max references identify YECVT, while Aerox V3 braking equipment is variant-dependent. The NMAX V3 model record lists " +
          b.abs + ". Confirm the exact Standard, SP or Tech Max model code and the seller's equipment sheet before comparing final prices."
      }
    ];
  }

  if (slug === "adv-160-vs-pcx-160" && a.id === "honda-adv-160" && b.id === "honda-pcx-160") {
    return [
      {
        question: "Honda ADV160 or PCX160: which has the lower seat and what about ground clearance?",
        answer: "The PCX160 lists a " + b.seatHeightMm + " mm published seat versus " + a.seatHeightMm +
          " mm for the ADV160. The ADV160 has " + a.groundClearanceMm +
          " mm recorded ground clearance; the current PCX160 dataset does not normalize a matching clearance figure, so MotoIndex cannot state a precise clearance difference. Actual rider reach, suspension sag and conditions matter more than styling labels."
      },
      {
        question: "Does PCX160 Standard have ABS, and how do ADV160 ABS and RoadSync differ?",
        answer: "The PCX160 Standard variant record lists CBS, while PCX160 RoadSync lists ABS and HSTC. Both recorded ADV160 ABS and RoadSync configurations list ABS and HSTC; RoadSync adds connectivity. This is an exact-variant comparison, not a claim that every PCX160 includes ABS. Confirm the equipment on the actual unit."
      },
      {
        question: "How much are ADV160 ABS/RoadSync and PCX160 Standard/RoadSync in the Philippines?",
        answer: "Verified variant references list ADV160 as " + variantSummary(a) + " and PCX160 as " + variantSummary(b) +
          ". The broader observed market price spans are " + observedMarketPriceLabel(a) + " and " + observedMarketPriceLabel(b) +
          ". These records may include different source dates and sellers; confirm a current cash quote and full financing terms for the exact trim before buying."
      }
    ];
  }

  return undefined;
}

import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";
import type { HelmetProduct, TireProduct, TopBoxProduct } from "@/lib/types";

function priceDistance(a?: number, b?: number) {
  if (typeof a !== "number" || typeof b !== "number") return Number.MAX_SAFE_INTEGER / 2;
  return Math.abs(a - b);
}

export function helmetAlternatives(product: HelmetProduct, limit = 3) {
  return helmetProducts
    .filter((candidate) => candidate.status === "verified" && candidate.id !== product.id)
    .sort((a, b) => {
      const aBrand = a.brandSlug === product.brandSlug ? 0 : 1;
      const bBrand = b.brandSlug === product.brandSlug ? 0 : 1;
      if (aBrand !== bBrand) return aBrand - bBrand;
      const aType = a.helmetType === product.helmetType ? 0 : 1;
      const bType = b.helmetType === product.helmetType ? 0 : 1;
      if (aType !== bType) return aType - bType;
      return priceDistance(a.priceFromPhp, product.priceFromPhp) - priceDistance(b.priceFromPhp, product.priceFromPhp);
    })
    .slice(0, limit);
}

export function helmetComparisonTargets(product: HelmetProduct, limit = 2) {
  return helmetAlternatives(product, 8).slice(0, limit);
}

export function helmetFaqs(product: HelmetProduct) {
  const sizeText = product.sizes.length ? product.sizes.join(", ") : "the sizes shown by the current seller or manufacturer";
  return [
    {
      question: `How much is the ${product.brand} ${product.model} in the Philippines?`,
      answer: product.priceFromPhp
        ? `MotoIndex has a dated starting-price observation of ₱${product.priceFromPhp.toLocaleString("en-PH")}. Prices can differ by graphic, size, seller and promotion, so check the current listing before buying.`
        : `MotoIndex does not currently publish a reliable Philippine starting price for this exact model. Use the linked product source or retailer to check the current offer.`,
    },
    {
      question: `What sizes does the ${product.brand} ${product.model} come in?`,
      answer: `The checked source lists ${sizeText}. Use the exact model's size chart and measure your head before ordering; letter sizes are not guaranteed to fit the same across brands or models.`,
    },
    {
      question: `Is the ${product.brand} ${product.model} Pinlock-ready?`,
      answer: product.pinlock
        ? `${product.pinlock}. Confirm the insert size or lens code for the exact visor before ordering a replacement.`
        : `MotoIndex does not have a separate Pinlock compatibility record beyond the visor information shown on this page. Confirm the exact visor and insert code before buying.`,
    },
    {
      question: `What certification does the ${product.brand} ${product.model} have?`,
      answer: `${product.certification || "The checked source does not provide a model-specific certification summary."} For Philippine use, inspect the conformity marking on the exact unit being sold locally.`,
    },
    {
      question: `What are good alternatives to the ${product.brand} ${product.model}?`,
      answer: `Compare the alternatives on this page by helmet type, listed price, shell, visor setup, sizing and the features that matter to your riding. MotoIndex keeps those comparisons on the product page instead of creating separate thin “review” or “versus” pages.`,
    },
  ];
}

export function tireAlternatives(product: TireProduct, limit = 3) {
  const sizes = new Set(product.knownSizes.map((size) => size.toUpperCase().replace(/\s+/g, "")));
  return tireProducts
    .filter((candidate) => candidate.status === "verified" && candidate.id !== product.id)
    .map((candidate) => ({
      candidate,
      overlap: candidate.knownSizes.filter((size) => sizes.has(size.toUpperCase().replace(/\s+/g, ""))).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || a.candidate.brand.localeCompare(b.candidate.brand))
    .slice(0, limit)
    .map((row) => row.candidate);
}

export function tireFaqs(product: TireProduct) {
  return [
    {
      question: `What sizes are available for the ${product.brand} ${product.model}?`,
      answer: `MotoIndex currently records these manufacturer-listed sizes for this tire family: ${product.knownSizes.join(", ")}. Availability can differ by market and seller.`,
    },
    {
      question: `Will the ${product.brand} ${product.model} fit my motorcycle?`,
      answer: `A matching printed size is only the first check. Confirm rim size and width, front/rear application, load index, speed rating and physical clearance before purchase.`,
    },
    {
      question: `What is the ${product.brand} ${product.model} best for?`,
      answer: `${product.useCase}. Use the application and size guidance from the manufacturer for the exact tire you are considering.`,
    },
    {
      question: `How much does the ${product.brand} ${product.model} cost in the Philippines?`,
      answer: product.priceFromPhp
        ? `MotoIndex has a dated starting-price observation of ₱${product.priceFromPhp.toLocaleString("en-PH")}. Tire prices vary significantly by size and seller.`
        : `MotoIndex does not currently publish a reliable Philippine starting-price observation for this tire family. Check the current seller for the exact size you need.`,
    },
  ];
}

export function topBoxAlternatives(product: TopBoxProduct, limit = 3) {
  return topBoxProducts
    .filter((candidate) => candidate.status === "verified" && candidate.id !== product.id)
    .sort((a, b) => Math.abs(a.capacityL - product.capacityL) - Math.abs(b.capacityL - product.capacityL))
    .slice(0, limit);
}

export function topBoxFaqs(product: TopBoxProduct) {
  return [
    {
      question: `How much is the ${product.brand} ${product.model} top box in the Philippines?`,
      answer: product.priceFromPhp
        ? `MotoIndex has a dated starting-price observation of ₱${product.priceFromPhp.toLocaleString("en-PH")}. The total installed cost may be higher once a rack, bracket or plate is added.`
        : `MotoIndex does not currently publish a reliable Philippine starting price for this exact top box. Check the linked product source or current retailer.`,
    },
    {
      question: `What fits inside the ${product.brand} ${product.model}?`,
      answer: `${product.capacityL} L is the nominal capacity. ${product.helmetCapacity}. Actual fit depends on helmet shell shape and any items already inside the box.`,
    },
    {
      question: `Will the ${product.brand} ${product.model} fit my motorcycle?`,
      answer: `Not from capacity alone. ${product.mountingNote} Use the model-specific fitment rows on this page when available and confirm the motorcycle year before ordering hardware.`,
    },
    {
      question: `What is the maximum load for the ${product.brand} ${product.model}?`,
      answer: typeof product.maxLoadKg === "number"
        ? `The checked product information lists up to ${product.maxLoadKg} kg, but the motorcycle rack or carrier may have a lower limit. Always follow the lowest applicable load limit.`
        : `MotoIndex does not currently record a model-specific maximum load. Check the case, plate and motorcycle rack instructions before carrying luggage.`,
    },
  ];
}

import type { HelmetProduct, TireProduct, TopBoxProduct } from "./types";

export type ProductEditorial = { bestFor: string; pros: string[]; cons: string[] };

export function helmetEditorial(p: HelmetProduct): ProductEditorial {
  const pros = [
    `${p.helmetType} format with ${p.visor.toLowerCase()}.`,
    p.intercomReady ? "Speaker/intercom provision is listed for this model." : "Core visor, shell and sizing details are recorded from a checked source.",
    p.priceFromPhp ? `MotoIndex has a dated observed starting price from ₱${p.priceFromPhp.toLocaleString("en-PH")}.` : "The model identity and product specifications are source-checked."
  ];
  const cons = [
    p.weightG ? `Listed weight is about ${p.weightG.toLocaleString("en-PH")} g; actual feel still depends on size and fit.` : "A reliable model-specific weight is not recorded in the current source set.",
    p.intercomReady ? "Intercom-ready does not guarantee every communicator clamp, speaker or microphone will fit." : "No intercom-ready claim is recorded; speaker and clamp clearance need checking.",
    "Certification and fit must be checked on the exact Philippine-market unit; brand/model labels alone are not enough."
  ];
  const bestFor = p.helmetType === "Full face" ? "Riders prioritizing full-face coverage for commuting, touring or sport use." : p.helmetType === "Modular" ? "Riders who want a flip-up chin bar for stops and touring convenience." : p.helmetType === "Off-road" ? "Motocross and off-road riders who need a peak-based helmet designed around goggles, ventilation and dirt-riding impact management." : p.helmetType === "Adventure" ? "Mixed-surface riders comparing road visibility, peak use and off-road ventilation in one helmet." : p.helmetType === "Half face" || p.helmetType === "Open face" ? "Urban riders who prioritize ventilation and easy on/off use, while accepting less facial coverage than a full-face helmet." : "Riders comparing a multi-purpose helmet format with the exact fit and certification checked in person.";
  return { bestFor, pros, cons };
}

export function tireEditorial(p: TireProduct): ProductEditorial {
  return {
    bestFor: `${p.useCase} riders who need one of the manufacturer-listed sizes recorded on this page.`,
    pros: [
      `${p.knownSizes.length} checked size records are available for MotoIndex stock-size matching.`,
      `${p.construction} construction and use-case positioning are recorded from the cited source.`,
      "The page links exact MotoIndex motorcycles whose printed stock size matches a listed size."
    ],
    cons: [
      "A printed-size match does not prove load index, speed rating, rim width or physical clearance.",
      p.priceFromPhp ? "Observed prices can change by size and seller." : "MotoIndex does not yet have a reliable Philippine starting-price observation for this tire family.",
      "Final front/rear application should be confirmed with the tire maker and motorcycle manufacturer."
    ]
  };
}

export function topBoxEditorial(p: TopBoxProduct): ProductEditorial {
  return {
    bestFor: `${p.capacityL}L-class storage for riders whose motorcycle has the correct compatible rack, plate and load allowance.`,
    pros: [
      `${p.capacityL} L capacity with ${p.helmetCapacity.toLowerCase()}.`,
      `${p.shell} construction and mounting requirements are recorded from the checked product source.`,
      p.priceFromPhp ? `A dated observed starting price from ₱${p.priceFromPhp.toLocaleString("en-PH")} is recorded.` : "Model-specific fitment records are kept separate from generic capacity claims."
    ],
    cons: [
      "The box does not automatically fit a motorcycle just because the capacity looks suitable.",
      "A compatible rack/plate and their load limits must be checked for the exact motorcycle and model year.",
      p.priceFromPhp ? "Final price can change with the required rack, plate, shipping and seller." : "No reliable current Philippine starting price is recorded yet."
    ]
  };
}

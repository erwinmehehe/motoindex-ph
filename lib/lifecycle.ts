import type { Motorcycle } from "./types";

export function lifecycleLabel(model: Motorcycle) {
  if (model.marketStatus === "previous") return "Previous generation";
  if (model.marketStatus === "discontinued") return "Discontinued";
  if (model.marketStatus === "uncertain") return "Availability needs recheck";
  return "Current model";
}

export function lifecycleTone(model: Motorcycle) {
  if (model.marketStatus === "current" || !model.marketStatus) return "verified";
  if (model.marketStatus === "previous" || model.marketStatus === "discontinued") return "neutral";
  return "review";
}

export function lifecycleCopy(model: Motorcycle) {
  if (model.marketStatus === "previous") return `${model.generation}. Kept separate from its successor so old launch pricing and specifications are not mixed with the current motorcycle.`;
  if (model.marketStatus === "discontinued") return `${model.generation}. This model is retained for reference but is not treated as a current new-bike listing.`;
  if (model.marketStatus === "uncertain") return `${model.generation}. MotoIndex needs a fresh availability check before presenting it as currently sold.`;
  return `${model.generation}. Last source check ${model.verifiedAt}.`;
}

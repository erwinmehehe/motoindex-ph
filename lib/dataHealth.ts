import { currentMotorcycles, isIndexableModel, motorcycles } from "./data";
import { priceChecksForModel } from "./marketChecks";
import { getRenderableMedia } from "./media";
import { getTireProductsForModel } from "./catalog";
import { maintenanceForModel } from "./maintenance";
import { safetyResourceForModel } from "./safety";
import { marketPriceNeedsRefresh, modelSourceNeedsRefresh } from "./freshnessPolicy";
import { getVerifiedVariantsForModel } from "./variants";
import { priceRangeSuggestsVariants, priceSnapshotsForModel } from "./priceIntelligence";

export type ModelHealth = {
  id: string;
  label: string;
  verifiedAt: string;
  flags: string[];
  priceSources: number;
  imageCount: number;
  fuelEconomy: boolean;
  maintenance: boolean;
  safetyResource: boolean;
  indexable: boolean;
  sourceRefreshDue: boolean;
  marketRefreshDue: boolean;
  variantCount: number;
  variantMappingNeeded: boolean;
  priceSnapshotCount: number;
  priorityScore: number;
  nextAction: string;
};

function nextActionFor(input: Omit<ModelHealth, "nextAction">) {
  if (!input.indexable || input.sourceRefreshDue) return "Refresh the primary model source before publication/indexing.";
  if (!input.imageCount) return "Add or replace the model image with a usable sourced asset.";
  if (input.marketRefreshDue) return "Recheck manufacturer/dealer market pricing and store a new dated snapshot.";
  if (input.priceSources < 2) return "Add a second independent current price source.";
  if (input.variantMappingNeeded) return "Review whether the observed price range represents trims; map only verified variants.";
  if (!input.fuelEconomy) return "Find a manufacturer-listed fuel-consumption figure or keep the planning estimate explicitly labeled.";
  if (!input.maintenance) return "Add a manual-backed maintenance schedule.";
  if (input.priceSnapshotCount < 2 && input.priceSources > 0) return "Refresh pricing on a later date to turn the baseline into usable history.";
  if (!input.safetyResource) return "Add an official safety/recall campaign resource.";
  return "Healthy — keep on the routine refresh cycle.";
}

export function modelHealthRows(): ModelHealth[] {
  return currentMotorcycles.map((model)=>{
    const priceSources = priceChecksForModel(model.id).length;
    const imageCount = getRenderableMedia("motorcycle", model.id).length;
    const variantCount = getVerifiedVariantsForModel(model.id).length;
    const priceSnapshotCount = priceSnapshotsForModel(model.id).length;
    const variantMappingNeeded = priceRangeSuggestsVariants(model) && variantCount < 2;
    const flags:string[]=[];
    const sourceRefreshDue = modelSourceNeedsRefresh(model);
    const marketRefreshDue = marketPriceNeedsRefresh(model);
    const indexable = isIndexableModel(model);
    const fuelEconomy = Boolean(model.fuelConsumptionKmL);
    const maintenance = Boolean(maintenanceForModel(model.id));
    const safetyResource = Boolean(safetyResourceForModel(model));
    if (!indexable) flags.push("not public/indexable");
    if (sourceRefreshDue) flags.push("model source refresh due");
    if (marketRefreshDue) flags.push("market price refresh due");
    if (priceSources < 2) flags.push("<2 price sources");
    if (!imageCount) flags.push("missing image");
    if (!fuelEconomy) flags.push("fuel economy unverified");
    if (!maintenance) flags.push("maintenance schedule pending");
    if (!getTireProductsForModel(model.id).some((p)=>p.status==="verified")) flags.push("no verified tire family");
    if (!safetyResource) flags.push("no official safety resource");
    if (variantMappingNeeded) flags.push("variant/range review pending");
    if (priceSnapshotCount === 1 && priceSources > 0) flags.push("price history baseline only");

    let priorityScore = 0;
    if (!indexable || sourceRefreshDue) priorityScore += 100;
    if (!imageCount) priorityScore += 90;
    if (marketRefreshDue) priorityScore += 55;
    if (priceSources < 2) priorityScore += 35;
    if (variantMappingNeeded) priorityScore += 25;
    if (!fuelEconomy) priorityScore += 15;
    if (!maintenance) priorityScore += 12;
    if (priceSnapshotCount === 1 && priceSources > 0) priorityScore += 8;
    if (!safetyResource) priorityScore += 6;

    const rowWithoutAction = { id:model.id, label:`${model.make} ${model.model}`, verifiedAt:model.verifiedAt, flags, priceSources, imageCount, fuelEconomy, maintenance, safetyResource, indexable, sourceRefreshDue, marketRefreshDue, variantCount, variantMappingNeeded, priceSnapshotCount, priorityScore };
    return { ...rowWithoutAction, nextAction: nextActionFor(rowWithoutAction) };
  });
}

export function attentionQueue(limit = 12) {
  return [...modelHealthRows()]
    .filter((row)=>row.priorityScore > 0)
    .sort((a,b)=>b.priorityScore-a.priorityScore || a.label.localeCompare(b.label))
    .slice(0,limit);
}

export function healthSummary() {
  const rows=modelHealthRows();
  return {
    total:motorcycles.length,
    publicModels:rows.filter(r=>r.indexable).length,
    sourceRefreshDue:rows.filter(r=>r.sourceRefreshDue).length,
    marketRefreshDue:rows.filter(r=>r.marketRefreshDue).length,
    missingImages:rows.filter(r=>r.imageCount===0).length,
    weakPriceCoverage:rows.filter(r=>r.priceSources<2).length,
    missingFuelEconomy:rows.filter(r=>!r.fuelEconomy).length,
    maintenanceCovered:rows.filter(r=>r.maintenance).length,
    safetyCovered:rows.filter(r=>r.safetyResource).length,
    variantMappedModels:rows.filter(r=>r.variantCount>=2).length,
    verifiedVariants:rows.reduce((sum,row)=>sum+row.variantCount,0),
    variantMappingPending:rows.filter(r=>r.variantMappingNeeded).length,
    priceTrackingModels:rows.filter(r=>r.priceSnapshotCount>=1).length,
    priceHistoryReady:rows.filter(r=>r.priceSnapshotCount>=2).length,
  };
}

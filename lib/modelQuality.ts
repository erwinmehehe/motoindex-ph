import type { Motorcycle } from "./types";
import { modelAuthorityProfile } from "./modelAuthority";
import { phBrandSupportFor } from "./phBrandSupport";
import { priceChecksForModel } from "./marketChecks";
import { getRenderableMedia } from "./media";
import { maintenanceForModel, serviceResourceForModel } from "./maintenance";
import { safetyResourceForModel } from "./safety";
import { getVerifiedVariantsForModel } from "./variants";

export type ModelQualityGrade = "strong" | "publishable" | "hold";

export type ModelAuthorityQuality = {
  score: number;
  grade: ModelQualityGrade;
  indexable: boolean;
  strengths: string[];
  gaps: string[];
  evidenceCount: number;
};

export function isAuthorityExpansionModel(model: Motorcycle) {
  return Boolean(modelAuthorityProfile(model.id));
}

function hasCoreSpecs(model: Motorcycle) {
  return [
    model.srp,
    model.engineCc,
    model.powerHp,
    model.torqueNm,
    model.curbWeightKg,
    model.seatHeightMm,
    model.fuelTankL,
  ].every((value) => typeof value === "number" && value > 0) && Boolean(model.frontTire && model.rearTire && model.abs);
}

export function modelAuthorityQuality(model: Motorcycle): ModelAuthorityQuality {
  const authority = modelAuthorityProfile(model.id);
  const brandSupport = phBrandSupportFor(model.makeSlug);
  const checks = priceChecksForModel(model.id);
  const media = getRenderableMedia("motorcycle", model.id);
  const maintenance = maintenanceForModel(model.id);
  const legacyService = serviceResourceForModel(model);
  const safety = safetyResourceForModel(model);
  const variants = getVerifiedVariantsForModel(model.id);
  const sourceReady = model.freshness === "verified" && /^https:\/\//.test(model.sourceUrl) && Boolean(model.verifiedAt);
  const specsReady = hasCoreSpecs(model);

  let score = 0;
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (sourceReady) {
    score += 20;
    strengths.push("Dated HTTPS model source");
  } else {
    gaps.push("Current model-level source needs verification");
  }

  if (specsReady) {
    score += 15;
    strengths.push("Core price, engine and chassis specifications");
  } else {
    gaps.push("Core specification record is incomplete");
  }

  if (authority) {
    score += 20;
    strengths.push("Unique PH buyer verdict and decision brief");
    if (authority.comparisonIds.length >= 2) {
      score += 10;
      strengths.push("Named direct cross-shopping set");
    } else {
      gaps.push("Direct competitor set needs expansion");
    }
  } else {
    gaps.push("Unique buyer/editorial authority brief not stored");
  }

  if (brandSupport) {
    score += 10;
    strengths.push("Philippine brand/dealer/after-sales resource");
  } else if (legacyService) {
    score += 8;
    strengths.push("Official brand service resource");
  } else {
    gaps.push("Philippine after-sales/dealer resource not stored");
  }

  // Every published entity still exposes its model-level price/source baseline. Independent
  // dealer/comparison checks add depth, but their absence is surfaced instead of padded.
  score += 5;
  strengths.push("Model-level dated price baseline");
  if (checks.length > 0) {
    score += 5;
    strengths.push(`${checks.length} additional PH price ${checks.length === 1 ? "check" : "checks"}`);
  } else {
    gaps.push("Independent second PH price check not stored yet");
  }

  if (media.length > 0) {
    score += 5;
    strengths.push("Renderable motorcycle media with provenance");
  } else {
    gaps.push("Local/provenance-tracked motorcycle media pending");
  }

  if (typeof model.fuelConsumptionKmL === "number" && model.fuelConsumptionKmL > 0) {
    score += 3;
    strengths.push("Model-level fuel-consumption basis");
  } else {
    gaps.push("Model-specific fuel-economy evidence not stored");
  }

  if (typeof model.groundClearanceMm === "number" && model.groundClearanceMm > 0) {
    score += 2;
    strengths.push("Ground-clearance data stored");
  }

  if (maintenance) {
    score += 3;
    strengths.push("Parsed exact maintenance schedule");
  } else {
    gaps.push("Exact model-year maintenance schedule not parsed yet");
  }

  if (safety || brandSupport?.recallUrl) {
    score += 2;
    strengths.push("Official safety/recall support path");
  } else {
    gaps.push("Model/brand recall checker not stored");
  }

  if (variants.length >= 2) {
    score += 5;
    strengths.push("Verified variant matrix");
  } else if (typeof model.marketPriceHighPhp === "number" && model.marketPriceHighPhp > model.srp) {
    gaps.push("Price range suggests variants; exact trim mapping still needs verification");
  }

  const capped = Math.min(100, score);
  const grade: ModelQualityGrade = capped >= 85 ? "strong" : capped >= 65 ? "publishable" : "hold";
  const hardGate = sourceReady && specsReady && (!isAuthorityExpansionModel(model) || Boolean(authority && brandSupport));

  return {
    score: capped,
    grade,
    indexable: hardGate && capped >= 65,
    strengths,
    gaps,
    evidenceCount: strengths.length,
  };
}

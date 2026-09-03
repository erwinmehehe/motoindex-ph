import {
  commerceAgeDays,
  commerceFreshDays,
  isHttpsUrl,
  parseStrictIsoDate,
} from "./commercePolicy";
import type { OfferEntityType, OfferImportRow } from "./types";

const validTypes = new Set<OfferEntityType>(["motorcycle", "helmet", "tire", "topbox"]);
export const offerImportColumns = [
  "sellerSlug", "entityType", "entityId", "pricePhp", "downpaymentPhp", "monthlyPhp",
  "termMonths", "availability", "observedAt", "sourceUrl", "affiliateUrl"
];

export function validateImportRow(row: Record<string, unknown>, index: number, now = new Date()) {
  const issues: string[] = [];
  const sellerSlug = String(row.sellerSlug || "").trim();
  const entityType = String(row.entityType || "") as OfferEntityType;
  const entityId = String(row.entityId || "").trim();
  const availability = String(row.availability || "").trim();
  const observedAt = String(row.observedAt || "").trim();
  const sourceUrl = str(row.sourceUrl);
  const affiliateUrl = str(row.affiliateUrl);

  if (!sellerSlug) issues.push("sellerSlug required");
  if (!validTypes.has(entityType)) issues.push("entityType invalid");
  if (!entityId) issues.push("entityId required");
  if (!availability) issues.push("availability required");

  const parsedObservedAt = parseStrictIsoDate(observedAt);
  if (!parsedObservedAt) {
    issues.push("observedAt must be a real YYYY-MM-DD calendar date");
  } else {
    const age = commerceAgeDays(observedAt, now);
    if (age < 0) issues.push("observedAt cannot be in the future");
    if (age > commerceFreshDays) issues.push(`observedAt is older than the ${commerceFreshDays}-day live-offer window`);
  }

  for (const key of ["pricePhp", "downpaymentPhp", "monthlyPhp", "termMonths"]) {
    const value = row[key];
    if (value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
      issues.push(`${key} must be a non-negative number`);
    }
  }
  if (row.pricePhp === undefined || row.pricePhp === "") {
    if (row.monthlyPhp === undefined || row.monthlyPhp === "") issues.push("pricePhp or monthlyPhp required");
  }

  if (!sourceUrl) issues.push("sourceUrl required for a verified offer");
  else if (!isHttpsUrl(sourceUrl)) issues.push("sourceUrl must be an https URL");
  if (affiliateUrl && !isHttpsUrl(affiliateUrl)) issues.push("affiliateUrl must be an https URL");

  return {
    index,
    ok: issues.length === 0,
    issues,
    row: {
      sellerSlug,
      entityType,
      entityId,
      pricePhp: num(row.pricePhp),
      downpaymentPhp: num(row.downpaymentPhp),
      monthlyPhp: num(row.monthlyPhp),
      termMonths: num(row.termMonths),
      availability,
      observedAt,
      sourceUrl,
      affiliateUrl
    } as OfferImportRow
  };
}

function num(value: unknown) { return value === undefined || value === "" ? undefined : Number(value); }
function str(value: unknown) { return value === undefined || value === "" ? undefined : String(value).trim(); }

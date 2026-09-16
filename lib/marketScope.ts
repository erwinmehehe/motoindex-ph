import type { Motorcycle } from "./types";
import { isGlobalDemandModel } from "./globalDemandExpansion2026";
import { globalExpansionModelIds } from "./globalModelExpansion2026";

export type MotorcycleMarketScope =
  | "Philippines"
  | "Global"
  | "Imported / grey market"
  | "Discontinued / previous generation";

const scopeOrder: MotorcycleMarketScope[] = [
  "Philippines",
  "Global",
  "Imported / grey market",
  "Discontinued / previous generation"
];

/**
 * Every motorcycle receives an effective market scope through this function.
 * Existing MotoIndex records default to Philippines because the historical
 * catalog was Philippine-first. Explicit global expansion records are kept in
 * a separate registry so they cannot silently enter PH shopping flows.
 */
export function motorcycleMarketScopes(model: Motorcycle): MotorcycleMarketScope[] {
  const scopes = new Set<MotorcycleMarketScope>();

  if (globalExpansionModelIds.has(model.id)) scopes.add("Global");
  else scopes.add("Philippines");

  // The original global-demand batch was source-backed for the Philippine
  // market while also targeting international demand, so it legitimately has
  // both scopes.
  if (isGlobalDemandModel(model)) {
    scopes.add("Philippines");
    scopes.add("Global");
  }

  if (/grey market|gray market|import(?:ed)? only/i.test(model.priceContext || "")) {
    scopes.add("Imported / grey market");
  }

  if (model.marketStatus === "previous" || model.marketStatus === "discontinued") {
    scopes.add("Discontinued / previous generation");
  }

  return scopeOrder.filter((scope) => scopes.has(scope));
}

export function hasMarketScope(model: Motorcycle, scope: MotorcycleMarketScope) {
  return motorcycleMarketScopes(model).includes(scope);
}

export function isGlobalOnlyModel(model: Motorcycle) {
  const scopes = motorcycleMarketScopes(model);
  return scopes.includes("Global") && !scopes.includes("Philippines");
}

export function isCurrentPhilippineMarketModel(model: Motorcycle) {
  if (!hasMarketScope(model, "Philippines")) return false;
  return !["previous", "discontinued", "uncertain"].includes(model.marketStatus || "current");
}

export function isPhilippineShoppingEligible(model: Motorcycle) {
  return isCurrentPhilippineMarketModel(model) && model.freshness === "verified" && model.srp > 0;
}

export function marketScopeLabel(model: Motorcycle) {
  return motorcycleMarketScopes(model).join(" · ");
}

export function globalResearchPriceNote(model: Motorcycle) {
  if (!isGlobalOnlyModel(model)) return undefined;
  return model.marketStatus === "previous" || model.marketStatus === "discontinued"
    ? "Previous global generation. Local availability and pricing vary by country."
    : "Global research model. Local availability and pricing vary by country.";
}

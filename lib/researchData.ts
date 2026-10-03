import { getModelById, publicMotorcycles } from "./data";
import { observedMarketRange } from "./marketChecks";
import { financingScenario } from "./financing";
import { dealerFinancingObservations } from "./dealerFinancing";

export const researchMotorcycles = [...publicMotorcycles].sort((a, b) =>
  observedMarketRange(a).from - observedMarketRange(b).from || a.make.localeCompare(b.make) || a.model.localeCompare(b.model)
);

export function latestResearchCheck() {
  return researchMotorcycles
    .map((model) => model.marketPriceCheckedAt || model.verifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || "2026-08-27";
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const rows = [...values].sort((a, b) => a - b);
  const middle = Math.floor(rows.length / 2);
  return rows.length % 2 ? rows[middle] : (rows[middle - 1] + rows[middle]) / 2;
}

export function researchPriceRows() {
  return researchMotorcycles.map((model) => {
    const range = observedMarketRange(model);
    return {
      model,
      fromPhp: range.from,
      toPhp: range.to,
      checkedAt: model.marketPriceCheckedAt || model.verifiedAt,
    };
  });
}

export function researchSeatRows() {
  return [...researchMotorcycles]
    .sort((a, b) => a.seatHeightMm - b.seatHeightMm || a.curbWeightKg - b.curbWeightKg || a.model.localeCompare(b.model))
    .map((model) => ({ model, range: observedMarketRange(model) }));
}

export function researchFinancingRows() {
  return researchMotorcycles
    .map((model) => {
      const range = observedMarketRange(model);
      return {
        model,
        pricePhp: range.from,
        scenario: financingScenario(range.from, 20, 36, 12),
      };
    })
    .sort((a, b) => a.scenario.monthlyPhp - b.scenario.monthlyPhp || a.pricePhp - b.pricePhp);
}


export const PRICE_INDEX_BASELINE_DATE = "2026-10-03";
export const PRICE_INDEX_METHOD_VERSION = "v1";

export function researchPriceSegments() {
  const rows = researchPriceRows();
  const makeSegment = (label: string, filter: (row: (typeof rows)[number]) => boolean) => {
    const segmentRows = rows.filter(filter);
    const values = segmentRows.map((row) => row.fromPhp);
    return {
      label,
      count: segmentRows.length,
      medianPhp: Math.round(median(values)),
      minPhp: values.length ? Math.min(...values) : 0,
      maxPhp: values.length ? Math.max(...values) : 0,
    };
  };

  return [
    makeSegment("All current motorcycles", () => true),
    makeSegment("Scooters", ({ model }) => /scooter/i.test(model.category)),
    makeSegment("Underbones", ({ model }) => /underbone/i.test(model.category)),
    makeSegment("400cc+ motorcycles", ({ model }) => model.engineCc >= 400),
  ];
}

export function researchBrandPriceBenchmarks(minModels = 3) {
  const groups = new Map<string, ReturnType<typeof researchPriceRows>>();
  for (const row of researchPriceRows()) {
    const existing = groups.get(row.model.make) || [];
    existing.push(row);
    groups.set(row.model.make, existing);
  }

  return [...groups.entries()]
    .filter(([, rows]) => rows.length >= minModels)
    .map(([make, rows]) => {
      const values = rows.map((row) => row.fromPhp);
      return {
        make,
        makeSlug: rows[0].model.makeSlug,
        count: rows.length,
        medianPhp: Math.round(median(values)),
        minPhp: Math.min(...values),
        maxPhp: Math.max(...values),
      };
    })
    .sort((a, b) => a.medianPhp - b.medianPhp || a.make.localeCompare(b.make));
}

export function researchBudgetBands() {
  const rows = researchPriceRows();
  const bands = [
    { label: "Below ₱100K", min: 0, max: 99999 },
    { label: "₱100K–₱149,999", min: 100000, max: 149999 },
    { label: "₱150K–₱299,999", min: 150000, max: 299999 },
    { label: "₱300K–₱599,999", min: 300000, max: 599999 },
    { label: "₱600K and above", min: 600000, max: Number.POSITIVE_INFINITY },
  ];
  return bands.map((band) => ({
    label: band.label,
    count: rows.filter((row) => row.fromPhp >= band.min && row.fromPhp <= band.max).length,
  }));
}

export function researchDealerFinancingRows() {
  return dealerFinancingObservations
    .map((observation) => ({ observation, model: getModelById(observation.modelId) }))
    .filter((row): row is { observation: (typeof dealerFinancingObservations)[number]; model: NonNullable<ReturnType<typeof getModelById>> } => Boolean(row.model))
    .sort((a, b) => a.observation.srpPhp - b.observation.srpPhp || a.model.model.localeCompare(b.model.model));
}

export function researchPriceCsv() {
  const header = [
    "make","model","canonical_url","category","engine_cc","starting_price_php","upper_price_php",
    "seat_height_mm","curb_weight_kg","checked_at","core_source_url","price_source_url"
  ];
  const escape = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = researchPriceRows().map(({ model, fromPhp, toPhp, checkedAt }) => [
    model.make,
    model.model,
    `https://motoindexph.com/motorcycles/${model.makeSlug}/${model.slug}`,
    model.category,
    model.engineCc,
    fromPhp,
    toPhp ?? "",
    model.seatHeightMm,
    model.curbWeightKg,
    checkedAt,
    model.sourceUrl,
    model.marketPriceSourceUrl || model.sourceUrl,
  ].map(escape).join(","));
  return [header.join(","), ...lines].join("\n");
}

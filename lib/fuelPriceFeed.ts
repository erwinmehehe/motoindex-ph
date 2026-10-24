import bootstrap from "@/data/fuel-price-adjustments.seed.json";

export const DOE_FUEL_SOURCE = "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/price-adjustments";
export const FUEL_FEED_URL = "https://raw.githubusercontent.com/erwinmehehe/motoindex-ph/fuel-data/data/fuel-price-adjustments.json";
export const FUEL_TYPES = ["gasoline", "diesel", "kerosene"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];
export type FuelMovement = { min: number; max: number; reportingCompanies: number } | null;
export type FuelCompany = { company: string; gasoline: number | null; diesel: number | null; kerosene: number | null };
export type FuelWeek = {
  weekStart: string;
  weekEnd: string;
  sourceTitle: string;
  sourceUrl: string;
  companies: FuelCompany[];
  summary: Record<FuelType, FuelMovement>;
};
export type FuelFeed = { schemaVersion: 1; sourcePage: string; updatedAt: string; weeks: FuelWeek[] };
export type FuelFeedResult = { feed: FuelFeed; usingFallback: boolean };

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isoDay(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  // JS Date.parse silently rolls invalid dates forward (e.g., February 30).
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function verifiedPdfUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["d24qbtp4vooyzi.cloudfront.net", "doe.gov.ph", "www.doe.gov.ph"].includes(url.hostname) &&
      decodeURIComponent(url.pathname).toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

function amount(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= 50);
}

export function summarizeFuelCompanies(companies: FuelCompany[]): Record<FuelType, FuelMovement> {
  const output = {} as Record<FuelType, FuelMovement>;
  for (const type of FUEL_TYPES) {
    const values = companies.map((row) => row[type]).filter((value): value is number => value !== null);
    output[type] = values.length
      ? { min: Math.min(...values), max: Math.max(...values), reportingCompanies: values.length }
      : null;
  }
  return output;
}

// Do not blindly render an external JSON payload as verified DOE figures.
export function parseFuelFeed(value: unknown): FuelFeed | null {
  if (!object(value) || value.schemaVersion !== 1 || value.sourcePage !== DOE_FUEL_SOURCE ||
      typeof value.updatedAt !== "string" || Number.isNaN(Date.parse(value.updatedAt)) ||
      Date.parse(value.updatedAt) > Date.now() + 24 * 60 * 60 * 1000 ||
      !Array.isArray(value.weeks) || value.weeks.length < 1 || value.weeks.length > 12) return null;

  const weeks: FuelWeek[] = [];
  const seenWeeks = new Set<string>();
  for (const input of value.weeks) {
    if (!object(input) || !isoDay(input.weekStart) || !isoDay(input.weekEnd) ||
        Date.parse(input.weekStart) > Date.parse(input.weekEnd) ||
        Date.parse(input.weekEnd) - Date.parse(input.weekStart) > 10 * 86400000 ||
        !verifiedPdfUrl(input.sourceUrl) || typeof input.sourceTitle !== "string" ||
        !Array.isArray(input.companies) || input.companies.length < 3 || input.companies.length > 100 ||
        seenWeeks.has(input.weekStart)) return null;

    const companies: FuelCompany[] = [];
    const seenCompanies = new Set<string>();
    for (const company of input.companies) {
      if (!object(company) || typeof company.company !== "string" ||
          company.company.trim().length < 2 || company.company.length > 80 ||
          !FUEL_TYPES.every((type) => amount(company[type])) ||
          FUEL_TYPES.every((type) => company[type] === null)) return null;
      const name = company.company.trim();
      if (seenCompanies.has(name.toLowerCase())) return null;
      seenCompanies.add(name.toLowerCase());
      companies.push({
        company: name,
        gasoline: company.gasoline as number | null,
        diesel: company.diesel as number | null,
        kerosene: company.kerosene as number | null
      });
    }
    seenWeeks.add(input.weekStart);
    weeks.push({
      weekStart: input.weekStart,
      weekEnd: input.weekEnd,
      sourceTitle: input.sourceTitle.trim(),
      sourceUrl: input.sourceUrl,
      companies,
      summary: summarizeFuelCompanies(companies)
    });
  }

  weeks.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  return { schemaVersion: 1, sourcePage: DOE_FUEL_SOURCE, updatedAt: value.updatedAt, weeks };
}

export async function getFuelFeed(): Promise<FuelFeedResult> {
  try {
    const response = await fetch(FUEL_FEED_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Fuel feed unavailable");
    const feed = parseFuelFeed(await response.json());
    if (!feed) throw new Error("Fuel feed failed validation");
    return { feed, usingFallback: false };
  } catch {
    const seed = parseFuelFeed(bootstrap);
    if (!seed) throw new Error("Bundled DOE fuel-price seed is invalid");
    return { feed: seed, usingFallback: true };
  }
}

export function fuelAmount(value: number): string {
  const formatted = Math.abs(value).toFixed(2);
  if (value < 0) return "−₱" + formatted;
  if (value > 0) return "+₱" + formatted;
  return "₱0.00";
}

export function fuelRange(value: FuelMovement): string {
  if (!value) return "Not reported";
  return value.min === value.max
    ? fuelAmount(value.min)
    : fuelAmount(value.min) + " to " + fuelAmount(value.max);
}

export function fuelDirection(value: FuelMovement | number | null): "up" | "down" | "flat" | "mixed" | "missing" {
  if (value === null) return "missing";
  const min = typeof value === "number" ? value : value.min;
  const max = typeof value === "number" ? value : value.max;
  if (min < 0 && max > 0) return "mixed";
  if (min < 0 && max <= 0) return "down";
  if (min >= 0 && max > 0) return "up";
  return "flat";
}

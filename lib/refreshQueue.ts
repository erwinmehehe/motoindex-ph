import { currentMotorcycles } from "./data";
import { helmetProducts, tireProducts, topBoxProducts } from "./catalog";
import { ownershipGuides } from "./ownershipGuides";
import { topBoxFitments } from "./topBoxFitment";
import { MARKET_PRICE_MAX_AGE_DAYS, MODEL_SOURCE_MAX_AGE_DAYS } from "./freshnessPolicy";

const DAY_MS = 86_400_000;

type RefreshArea = "market price" | "model facts" | "LTO / insurance" | "helmet" | "tire" | "top box" | "compatibility";

export type RefreshQueueRow = {
  id: string;
  label: string;
  area: RefreshArea;
  checkedAt: string;
  dueAt: string;
  daysUntilDue: number;
  status: "overdue" | "due-soon" | "scheduled";
  href?: string;
  sourceUrl?: string;
};

function addDays(date: string, days: number) {
  const ms = Date.parse(`${date}T00:00:00Z`);
  return new Date(ms + days * DAY_MS).toISOString().slice(0, 10);
}

function daysBetween(from: Date, date: string) {
  const target = Date.parse(`${date}T00:00:00Z`);
  const today = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.ceil((target - today) / DAY_MS);
}

function makeRow(input: Omit<RefreshQueueRow, "dueAt" | "daysUntilDue" | "status"> & { maxAgeDays: number }, now: Date): RefreshQueueRow {
  const dueAt = addDays(input.checkedAt, input.maxAgeDays);
  const daysUntilDue = daysBetween(now, dueAt);
  return {
    id: input.id,
    label: input.label,
    area: input.area,
    checkedAt: input.checkedAt,
    dueAt,
    daysUntilDue,
    status: daysUntilDue < 0 ? "overdue" : daysUntilDue <= 14 ? "due-soon" : "scheduled",
    href: input.href,
    sourceUrl: input.sourceUrl,
  };
}

export function refreshQueueRows(now = new Date()) {
  const rows: RefreshQueueRow[] = [];

  for (const model of currentMotorcycles) {
    rows.push(makeRow({
      id: `${model.id}:facts`, label: `${model.make} ${model.model} — model facts`, area: "model facts",
      checkedAt: model.verifiedAt, maxAgeDays: MODEL_SOURCE_MAX_AGE_DAYS,
      href: `/motorcycles/${model.makeSlug}/${model.slug}`, sourceUrl: model.sourceUrl,
    }, now));
    if (model.marketPriceCheckedAt) rows.push(makeRow({
      id: `${model.id}:price`, label: `${model.make} ${model.model} — market price`, area: "market price",
      checkedAt: model.marketPriceCheckedAt, maxAgeDays: MARKET_PRICE_MAX_AGE_DAYS,
      href: `/motorcycles/${model.makeSlug}/${model.slug}#price`, sourceUrl: model.marketPriceSourceUrl,
    }, now));
  }

  for (const guide of ownershipGuides) {
    const area: RefreshArea = guide.slug === "registration-renewal" || guide.slug === "motorcycle-insurance" ? "LTO / insurance" : "model facts";
    rows.push(makeRow({ id: `ownership:${guide.slug}`, label: guide.title, area, checkedAt: guide.lastChecked, maxAgeDays: 90, href: `/ownership/${guide.slug}`, sourceUrl: guide.sources[0]?.url }, now));
  }

  for (const product of helmetProducts.filter((item)=>item.status === "verified" && item.lastChecked)) rows.push(makeRow({
    id: `helmet:${product.id}`, label: `${product.brand} ${product.model}`, area: "helmet", checkedAt: product.lastChecked!, maxAgeDays: 90,
    href: `/gear/helmets/${product.brandSlug}/${product.slug}`, sourceUrl: product.sourceUrl,
  }, now));

  for (const product of tireProducts.filter((item)=>item.status === "verified" && item.lastChecked)) rows.push(makeRow({
    id: `tire:${product.id}`, label: `${product.brand} ${product.model}`, area: "tire", checkedAt: product.lastChecked!, maxAgeDays: 120,
    href: `/tires/${product.brandSlug}/${product.slug}`, sourceUrl: product.sourceUrl,
  }, now));

  for (const product of topBoxProducts.filter((item)=>item.status === "verified" && item.lastChecked)) rows.push(makeRow({
    id: `topbox:${product.id}`, label: `${product.brand} ${product.model}`, area: "top box", checkedAt: product.lastChecked!, maxAgeDays: 120,
    href: `/accessories/top-box/${product.slug}`, sourceUrl: product.sourceUrl,
  }, now));

  for (const fitment of topBoxFitments.filter((item)=>item.status === "verified")) rows.push(makeRow({
    id: `fitment:${fitment.id}`, label: `${fitment.topBoxLabel} fitment — ${fitment.modelId}`, area: "compatibility", checkedAt: fitment.lastChecked, maxAgeDays: 90,
    sourceUrl: fitment.sourceUrl,
  }, now));

  return rows.sort((a,b)=>a.dueAt.localeCompare(b.dueAt) || a.area.localeCompare(b.area) || a.label.localeCompare(b.label));
}

export function refreshQueueSummary(now = new Date()) {
  const rows = refreshQueueRows(now);
  return {
    total: rows.length,
    overdue: rows.filter((row)=>row.daysUntilDue < 0).length,
    due14: rows.filter((row)=>row.daysUntilDue >= 0 && row.daysUntilDue <= 14).length,
    due30: rows.filter((row)=>row.daysUntilDue >= 0 && row.daysUntilDue <= 30).length,
    nextDueAt: rows[0]?.dueAt,
  };
}

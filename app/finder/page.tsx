import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { MotorcycleFinder, type FinderInitialFilters } from "@/components/MotorcycleFinder";
import { DecisionPath } from "@/components/DecisionPath";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { siteStats } from "@/lib/siteStats";

const models = publicMotorcycles;
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Finder Philippines",
  description: "Find motorcycles in the Philippines by budget, inseam, use case, passenger needs, traffic, highway use, transmission, ABS, seat height and weight.",
  path: "/finder",
  index: models.length >= 3,
});

function one(v?: string | string[]) { return Array.isArray(v) ? v[0] : v; }
function allowed<T extends string>(value: string | undefined, values: readonly T[], fallback?: T) {
  return values.includes(value as T) ? value as T : fallback;
}
function allowedNumber(value: string | undefined, values: readonly number[], fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && values.includes(n) ? n : fallback;
}

const budgetValues = ["80000", "100000", "125000", "150000", "200000", "300000", "500000", "any"] as const;
const useValues = ["city", "short", "work", "performance", "touring"] as const;
const trafficValues = ["heavy", "mixed", "light"] as const;
const transmissionValues = ["any", "Automatic", "Manual"] as const;
const absValues = ["any", "yes", "no"] as const;
const seatValues = ["any", "760", "780", "800", "820"] as const;
const weightValues = ["any", "110", "120", "140", "180"] as const;

export default async function FinderPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const makes = [...new Set(models.map((model) => model.make))];
  const categories = [...new Set(models.map((model) => model.category))];
  const initial: FinderInitialFilters = {
    budget: allowed(one(q.budget), budgetValues, "150000"),
    make: allowed(one(q.make), ["any", ...makes], "any"),
    transmission: allowed(one(q.transmission), transmissionValues, "any"),
    useCase: allowed(one(q.use), useValues, "city"),
    abs: allowed(one(q.abs), absValues, "any"),
    maxSeat: allowed(one(q.seat), seatValues, "any"),
    maxWeight: allowed(one(q.weight), weightValues, "any"),
    category: allowed(one(q.type), ["any", ...categories], "any"),
    inseam: allowedNumber(one(q.inseam), [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], 30),
    passenger: one(q.passenger) === "1",
    highway: one(q.highway) === "1",
    expresswayClass: one(q.expressway) === "1",
    luggage: one(q.luggage) === "1",
    traffic: allowed(one(q.traffic), trafficValues, "heavy"),
    dailyKm: allowedNumber(one(q.km), [10, 20, 30, 40, 60, 80], 20),
    monthlyBudget: allowedNumber(one(q.monthly), [0, 4000, 6000, 8000, 10000, 15000, 25000], 0),
    downPaymentPct: allowedNumber(one(q.down), [10, 20, 30, 40], 20),
    termMonths: allowedNumber(one(q.term), [12, 24, 36, 48, 60], 36),
    annualRatePct: allowedNumber(one(q.rate), [0, 8, 12, 18, 24], 12),
  };

  return <section className="page shell">
    <div className="page-head"><span className="entity-kicker">{siteStats.currentMotorcycles} current models</span><h1>Find the motorcycle that fits your actual life.</h1><p>Rank the current Philippine catalog against budget, rider fit, traffic, daily distance, passenger and luggage needs, open-road use and a transparent monthly ownership-planning estimate.</p></div>
    <MotorcycleFinder models={forClient(models)} initialFilters={initial} />
    <DecisionPath stage="finder" />
  </section>;
}

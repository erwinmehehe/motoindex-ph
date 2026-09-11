"use client";

import { useEffect, useState } from "react";
import { MotorcycleFinder, type FinderInitialFilters } from "@/components/MotorcycleFinder";
import type { Motorcycle } from "@/lib/types";
import type { DecisionUseCase, TrafficLevel } from "@/lib/decisionEngine";

const budgetValues = ["80000", "100000", "125000", "150000", "200000", "300000", "500000", "any"] as const;
const useValues = ["city", "short", "work", "performance", "touring"] as const;
const trafficValues = ["heavy", "mixed", "light"] as const;
const transmissionValues = ["any", "Automatic", "Manual"] as const;
const absValues = ["any", "yes", "no"] as const;
const seatValues = ["any", "760", "780", "800", "820"] as const;
const weightValues = ["any", "110", "120", "140", "180"] as const;

function allowed<T extends string>(value: string | null, values: readonly T[], fallback?: T) {
  return values.includes(value as T) ? value as T : fallback;
}
function allowedNumber(value: string | null, values: readonly number[], fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && values.includes(n) ? n : fallback;
}

export function MotorcycleFinderFromQuery({ models }: { models: Motorcycle[] }) {
  const [initial, setInitial] = useState<FinderInitialFilters | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const makes = [...new Set(models.map((model) => model.make))];
    const categories = [...new Set(models.map((model) => model.category))];
    setInitial({
      budget: allowed(q.get("budget"), budgetValues, "150000"),
      make: allowed(q.get("make"), ["any", ...makes], "any"),
      transmission: allowed(q.get("transmission"), transmissionValues, "any"),
      useCase: allowed(q.get("use"), useValues, "city") as DecisionUseCase,
      abs: allowed(q.get("abs"), absValues, "any"),
      maxSeat: allowed(q.get("seat"), seatValues, "any"),
      maxWeight: allowed(q.get("weight"), weightValues, "any"),
      category: allowed(q.get("type"), ["any", ...categories], "any"),
      inseam: allowedNumber(q.get("inseam"), [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], 30),
      passenger: q.get("passenger") === "1",
      highway: q.get("highway") === "1",
      expresswayClass: q.get("expressway") === "1",
      luggage: q.get("luggage") === "1",
      traffic: allowed(q.get("traffic"), trafficValues, "heavy") as TrafficLevel,
      dailyKm: allowedNumber(q.get("km"), [10, 20, 30, 40, 60, 80], 20),
      monthlyBudget: allowedNumber(q.get("monthly"), [0, 4000, 6000, 8000, 10000, 15000, 25000], 0),
      downPaymentPct: allowedNumber(q.get("down"), [10, 20, 30, 40], 20),
      termMonths: allowedNumber(q.get("term"), [12, 24, 36, 48, 60], 36),
      annualRatePct: allowedNumber(q.get("rate"), [0, 8, 12, 18, 24], 12),
    });
  }, [models]);

  if (!initial) return <div className="decision-finder" aria-busy="true" />;
  return <MotorcycleFinder models={models} initialFilters={initial} />;
}

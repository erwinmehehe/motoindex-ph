"use client";

import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { MotorcycleFinder, type FinderInitialFilters } from "@/components/MotorcycleFinder";
import type { DecisionUseCase } from "@/lib/decisionEngine";
import styles from "./FinderClient.module.css";
import resultStyles from "./FinderResultsPolish.module.css";
import decisionStyles from "./FinderDecision.module.css";

const budgets = new Set(["80000", "100000", "125000", "150000", "200000", "300000", "500000", "any"]);
const uses = new Set<DecisionUseCase>(["city", "short", "work", "performance", "touring"]);
const transmissions = new Set(["any", "Automatic", "Manual"]);
const absValues = new Set(["any", "yes", "no"]);
const seatValues = new Set(["any", "760", "780", "800", "820"]);
const weightValues = new Set(["any", "110", "120", "140", "180"]);
const trafficValues = new Set(["heavy", "mixed", "light"]);

const defaultInitial: FinderInitialFilters = {
  budget: "150000",
  make: "any",
  transmission: "any",
  useCase: "city",
  abs: "any",
  maxSeat: "any",
  maxWeight: "any",
  category: "any",
  inseam: 30,
  passenger: false,
  highway: false,
  expresswayClass: false,
  luggage: false,
  traffic: "heavy",
  dailyKm: 20,
  monthlyBudget: 0,
  downPaymentPct: 20,
  termMonths: 36,
  annualRatePct: 12,
};

function intFrom(params: URLSearchParams, key: string, allowed: number[], fallback: number) {
  const value = Number(params.get(key));
  return Number.isFinite(value) && allowed.includes(value) ? value : fallback;
}

export function FinderClient({ models }: { models: Motorcycle[] }) {
  const [initial, setInitial] = useState<FinderInitialFilters>(defaultInitial);
  const [sharedState, setSharedState] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) {
      setSharedState(false);
      return;
    }
    const makes = new Set(models.map(model => model.make));
    const categories = new Set(models.map(model => model.category));
    const useValue = params.get("use") as DecisionUseCase | null;
    const makeValue = params.get("make") || "any";
    const categoryValue = params.get("type") || "any";
    const transmissionValue = params.get("transmission") || "any";
    const absValue = params.get("abs") || "any";
    const seatValue = params.get("seat") || "any";
    const weightValue = params.get("weight") || "any";
    const trafficValue = params.get("traffic") || "heavy";
    const budgetValue = params.get("budget") || "150000";

    setInitial({
      budget: budgets.has(budgetValue) ? budgetValue : "150000",
      make: makeValue === "any" || makes.has(makeValue) ? makeValue : "any",
      transmission: transmissions.has(transmissionValue) ? transmissionValue : "any",
      useCase: useValue && uses.has(useValue) ? useValue : "city",
      abs: absValues.has(absValue) ? absValue : "any",
      maxSeat: seatValues.has(seatValue) ? seatValue : "any",
      maxWeight: weightValues.has(weightValue) ? weightValue : "any",
      category: categoryValue === "any" || categories.has(categoryValue) ? categoryValue : "any",
      inseam: intFrom(params, "inseam", [26,27,28,29,30,31,32,33,34,35,36,37,38], 30),
      passenger: params.get("passenger") === "1",
      highway: params.get("highway") === "1",
      expresswayClass: params.get("expressway") === "1",
      luggage: params.get("luggage") === "1",
      traffic: trafficValues.has(trafficValue) ? trafficValue : "heavy",
      dailyKm: intFrom(params, "km", [10,20,30,40,60,80], 20),
      monthlyBudget: intFrom(params, "monthly", [0,4000,6000,8000,10000,15000,25000], 0),
      downPaymentPct: intFrom(params, "down", [10,20,30,40], 20),
      termMonths: intFrom(params, "term", [12,24,36,48,60], 36),
      annualRatePct: intFrom(params, "rate", [0,8,12,18,24], 12),
    });
    setSharedState(true);
  }, [models]);

  const finderKey = useMemo(() => `${sharedState ? "shared" : "fresh"}:${JSON.stringify(initial)}`, [initial, sharedState]);
  const className = `${styles.refined} ${resultStyles.results} ${decisionStyles.decision}`;
  return <div className={className}><MotorcycleFinder key={finderKey} models={models} initialFilters={initial} initiallyComplete={sharedState} /></div>;
}

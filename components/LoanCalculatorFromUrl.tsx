"use client";

import { useEffect, useState } from "react";
import { LoanCalculator } from "@/components/LoanCalculator";

type CalculatorState = {
  price: number;
  down: number;
  term: number;
  rate: number;
  modelLabel?: string;
};

function numberParam(value: string | null, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export function LoanCalculatorFromUrl() {
  const [initial, setInitial] = useState<CalculatorState | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setInitial({
      price: numberParam(query.get("price"), 1000, 10000000, 100000),
      down: numberParam(query.get("down"), 0, 95, 20),
      term: numberParam(query.get("term"), 1, 84, 36),
      rate: numberParam(query.get("rate"), 0, 60, 12),
      modelLabel: query.get("model")?.slice(0, 80) || undefined,
    });
  }, []);

  if (!initial) {
    return <LoanCalculator syncUrl={false} />;
  }

  return (
    <LoanCalculator
      key={`${initial.price}-${initial.down}-${initial.term}-${initial.rate}-${initial.modelLabel || ""}`}
      initialPrice={initial.price}
      initialDownPct={initial.down}
      initialMonths={initial.term}
      initialRate={initial.rate}
      modelLabel={initial.modelLabel}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { MotorcycleInsuranceCalculator } from "@/components/MotorcycleInsuranceCalculator";

type CalculatorState = {
  value: number;
  rate: number;
  ctpl: number;
  modelLabel?: string;
};

function numberParam(value: string | null, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export function MotorcycleInsuranceCalculatorFromUrl() {
  const [initial, setInitial] = useState<CalculatorState | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setInitial({
      value: numberParam(query.get("value"), 10000, 10000000, 100000),
      rate: numberParam(query.get("rate"), 0, 20, 1.4),
      ctpl: numberParam(query.get("ctpl"), 0, 100000, 0),
      modelLabel: query.get("model")?.slice(0, 80) || undefined,
    });
  }, []);

  if (!initial) {
    return <div className="insurance-tool" aria-busy="true"><p>Loading calculator…</p></div>;
  }

  return (
    <MotorcycleInsuranceCalculator
      initialValue={initial.value}
      initialRate={initial.rate}
      initialCtpl={initial.ctpl}
      modelLabel={initial.modelLabel}
    />
  );
}

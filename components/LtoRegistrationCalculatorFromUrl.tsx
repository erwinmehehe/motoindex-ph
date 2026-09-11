"use client";

import { useEffect, useState } from "react";
import { LtoRegistrationCalculator } from "@/components/LtoRegistrationCalculator";

type CalculatorState = {
  modelLabel?: string;
  sidecar: boolean;
  includeInspection: boolean;
  inspection: number;
  ctpl: number;
  other: number;
};

function money(value: string | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100000 ? parsed : fallback;
}

export function LtoRegistrationCalculatorFromUrl() {
  const [initial, setInitial] = useState<CalculatorState | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const inspectionRaw = query.get("inspection");
    setInitial({
      modelLabel: query.get("model")?.slice(0, 80) || undefined,
      sidecar: query.get("sidecar") === "1",
      includeInspection: inspectionRaw !== "off",
      inspection: inspectionRaw === "off" ? 500 : money(inspectionRaw, 500),
      ctpl: money(query.get("ctpl")),
      other: money(query.get("other")),
    });
  }, []);

  if (!initial) {
    return <div className="fee-tool" aria-busy="true"><p>Loading calculator…</p></div>;
  }

  return (
    <LtoRegistrationCalculator
      modelLabel={initial.modelLabel}
      initialSidecar={initial.sidecar}
      initialIncludeInspection={initial.includeInspection}
      initialInspection={initial.inspection}
      initialCtpl={initial.ctpl}
      initialOther={initial.other}
    />
  );
}

import type { Motorcycle } from "@/lib/types";
import { observedMarketRange } from "@/lib/marketChecks";
import { php } from "@/lib/utils";

function absAvailable(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}

function lead(label: string, a: Motorcycle, b: Motorcycle, aValue: number, bValue: number, lowerIsBetter = false, format: (value:number)=>string = String) {
  if (aValue === bValue) return { label, model: "Tie", detail: format(aValue) };
  const aLeads = lowerIsBetter ? aValue < bValue : aValue > bValue;
  const model = aLeads ? a : b;
  const value = aLeads ? aValue : bValue;
  return { label, model: model.model, detail: format(value) };
}

export function ComparisonHighlights({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const aPrice = observedMarketRange(a).from;
  const bPrice = observedMarketRange(b).from;
  const rows = [
    lead("Lower starting price", a, b, aPrice, bPrice, true, php),
    lead("More power", a, b, a.powerHp, b.powerHp, false, v=>`${v} hp`),
    lead("Lighter curb weight", a, b, a.curbWeightKg, b.curbWeightKg, true, v=>`${v} kg`),
    lead("Lower seat", a, b, a.seatHeightMm, b.seatHeightMm, true, v=>`${v} mm`),
    lead("Larger fuel tank", a, b, a.fuelTankL, b.fuelTankL, false, v=>`${v} L`)
  ];
  const absA=absAvailable(a); const absB=absAvailable(b);
  const absRow = absA===absB ? {label:"ABS listing",model:"Tie",detail:absA?"Both list ABS":"Neither record lists ABS"} : {label:"ABS listing",model:absA?a.model:b.model,detail:"ABS listed in the current record"};
  return <section className="comparison-highlights" aria-label="Comparison highlights">
    <div className="section-head compact"><div><h2>Where the specs differ</h2></div></div>
    <div className="comparison-highlight-grid">{[...rows,absRow].map(row=><article key={row.label}><span>{row.label}</span><strong>{row.model}</strong><small>{row.detail}</small></article>)}</div>
    <p className="muted-copy">These rows show the numerical lead only. Rider fit, exact trim, road conditions and intended use can matter more than a single spec.</p>
  </section>;
}

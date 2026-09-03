import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { commuteMonthlyCosts } from "@/lib/commuteMath";
import { efficiencyEvidence } from "@/lib/efficiency";

export function CommuteSnapshot({model}:{model:Motorcycle}){
  const c=commuteMonthlyCosts(model);
  const efficiency=efficiencyEvidence(model);
  return <div className="commute-snapshot"><div><h2>What {model.model} looks like at 20 km/day</h2><p>Uses 22 commute days per month as the default. Change the distance, fuel price and other assumptions in the commute calculator.</p><Link className="button small" href={`/commute/cost-calculator?bike=${model.id}`}>Open commute calculator →</Link></div><div className="commute-snapshot-kpis"><span><small>Monthly distance</small><b>{c.monthlyKm.toLocaleString()} km</b></span><span><small>Fuel-economy basis</small><b>{efficiency.kmPerL} km/L {efficiency.status === "planning-estimate" ? "estimated" : "listed"}</b></span><span><small>Fuel + maintenance*</small><b>₱{Math.round(c.total).toLocaleString("en-PH")}/mo</b></span><span><small>Curb weight</small><b>{model.curbWeightKg} kg</b></span></div></div>;
}

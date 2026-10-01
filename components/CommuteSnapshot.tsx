import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { commuteMonthlyCosts } from "@/lib/commuteMath";
import { efficiencyEvidence } from "@/lib/efficiency";

export function CommuteSnapshot({model}:{model:Motorcycle}){
  const c=commuteMonthlyCosts(model);
  const efficiency=efficiencyEvidence(model);
  const efficiencyLabel=efficiency.status === "planning-estimate" ? "estimated" : "listed";
  return <div className="commute-snapshot">
    <div className="commute-snapshot-copy">
      <span className="commute-snapshot-kicker">20 km/day baseline</span>
      <h3>Monthly running-cost snapshot</h3>
      <p>At 20 km/day across 22 commute days, the {model.model} covers {c.monthlyKm.toLocaleString("en-PH")} km per month. Fuel and routine maintenance are planning estimates, not a dealer quote.</p>
      <Link className="commute-snapshot-link" href={`/commute/cost-calculator?bike=${model.id}`}>Adjust commute estimate →</Link>
    </div>
    <div className="commute-snapshot-kpis">
      <span className="is-primary"><small>Fuel + maintenance</small><b>₱{Math.round(c.total).toLocaleString("en-PH")}/mo</b><em>planning estimate</em></span>
      <span><small>Monthly distance</small><b>{c.monthlyKm.toLocaleString("en-PH")} km</b></span>
      <span><small>Fuel economy</small><b>{efficiency.kmPerL} km/L</b><em>{efficiencyLabel}</em></span>
      <span><small>Fuel used</small><b>{c.liters.toLocaleString("en-PH",{maximumFractionDigits:1})} L/mo</b></span>
    </div>
  </div>;
}

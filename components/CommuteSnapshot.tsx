import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { commuteMonthlyCosts } from "@/lib/commuteMath";
import { efficiencyEvidence } from "@/lib/efficiency";

export function CommuteSnapshot({model}:{model:Motorcycle}){
  const c=commuteMonthlyCosts(model);
  const efficiency=efficiencyEvidence(model);
  const monthlyTotal=Math.round(c.total);
  const monthlyFuel=Math.round(c.fuel);
  const perWorkday=Math.round(c.perWorkday);

  return <div className="commute-snapshot" data-commute-snapshot={model.id}>
    <div className="commute-snapshot-copy">
      <span className="commute-snapshot-eyebrow">20 km/day example</span>
      <h2>Daily commute cost snapshot</h2>
      <p>For the {model.make} {model.model}, this uses 22 commute days per month. Adjust distance, fuel price, parking and maintenance when you want a closer estimate.</p>
      <Link className="button small commute-snapshot-action" href={`/commute/cost-calculator?bike=${model.id}`}>Adjust commute assumptions →</Link>
    </div>
    <div className="commute-snapshot-kpis">
      <span className="commute-snapshot-primary">
        <small>Fuel + maintenance</small>
        <b>₱{monthlyTotal.toLocaleString("en-PH")}/mo</b>
        <em>About ₱{perWorkday.toLocaleString("en-PH")} per commute day</em>
      </span>
      <span>
        <small>Monthly distance</small>
        <b>{c.monthlyKm.toLocaleString("en-PH")} km</b>
        <em>20 km/day × 22 days</em>
      </span>
      <span>
        <small>Fuel-economy basis</small>
        <b>{efficiency.kmPerL} km/L</b>
        <em>{efficiency.status === "planning-estimate" ? "Planning estimate" : "Published figure"}</em>
      </span>
      <span>
        <small>Fuel only</small>
        <b>₱{monthlyFuel.toLocaleString("en-PH")}/mo</b>
        <em>Before maintenance and parking</em>
      </span>
    </div>
  </div>;
}

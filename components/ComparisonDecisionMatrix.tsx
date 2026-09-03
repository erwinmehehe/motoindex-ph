import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { allScenarioComparisons } from "@/lib/comparisonDecision";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export function ComparisonDecisionMatrix({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const rows = allScenarioComparisons(a, b);
  const aWins = rows.filter((row) => row.winner?.id === a.id).length;
  const bWins = rows.filter((row) => row.winner?.id === b.id).length;
  const ties = rows.length - aWins - bWins;
  return <section className="comparison-decision-matrix">
    <div className="section-head compact"><div><span className="decision-kicker">Decision matrix</span><h2>Which one fits which rider?</h2><p>This is scenario scoring, not a universal winner. Each row uses the same transparent MotoIndex decision factors with a different rider/use profile.</p></div></div>
    <div className="comparison-decision-summary">
      <article><span>{a.make}</span><strong>{a.model}</strong><b>{aWins} scenario {aWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(a)}</small></article>
      <article className="comparison-decision-middle"><span>Across {rows.length} profiles</span><strong>{ties ? `${ties} close call${ties > 1 ? "s" : ""}` : "No close-call rows"}</strong><small>Scores within 2 points are treated as a close call.</small></article>
      <article><span>{b.make}</span><strong>{b.model}</strong><b>{bWins} scenario {bWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(b)}</small></article>
    </div>
    <div className="comparison-scenario-list">{rows.map((row) => <article key={row.scenario.key}>
      <div className="comparison-scenario-copy"><span>{row.scenario.label}</span><p>{row.scenario.description}</p></div>
      <div className={`comparison-scenario-score ${row.winner?.id === a.id ? "winner" : ""}`}><strong>{row.a.score}</strong><span>{a.model}</span></div>
      <div className="comparison-scenario-verdict"><b>{row.winner ? `${row.winner.model} leads` : "Close call"}</b><small>{row.winner ? `${row.difference}-point gap on this profile` : "Within 2 points on this profile"}</small></div>
      <div className={`comparison-scenario-score ${row.winner?.id === b.id ? "winner" : ""}`}><strong>{row.b.score}</strong><span>{b.model}</span></div>
    </article>)}</div>
    <div className="comparison-decision-cta"><div><strong>Use your own priorities instead.</strong><span>Set budget, inseam, traffic, passenger, luggage and monthly ownership limits in the finder.</span></div><Link className="button" href={{pathname:"/finder",query:{budget:String(Math.ceil(Math.max(a.srp,b.srp)/50000)*50000),use:"city"}}}>Open personalized finder</Link></div>
  </section>;
}

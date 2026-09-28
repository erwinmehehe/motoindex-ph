import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { allScenarioComparisons } from "@/lib/comparisonDecision";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

function fitLabel(winnerId: string | undefined, modelId: string) {
  if (!winnerId) return "Good fit";
  return winnerId === modelId ? "Best for" : "Trade-off";
}

export function ComparisonDecisionMatrix({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const rows = allScenarioComparisons(a, b);
  const aWins = rows.filter((row) => row.winner?.id === a.id).length;
  const bWins = rows.filter((row) => row.winner?.id === b.id).length;
  const ties = rows.length - aWins - bWins;
  return <section className="comparison-decision-matrix">
    <div className="section-head compact"><div><span className="decision-kicker">Decision matrix</span><h2>Which one suits which kind of ride?</h2><p>These are plain-language judgments based on the measurable MotoIndex decision factors. They are not universal motorcycle scores.</p></div></div>
    <div className="comparison-decision-summary">
      <article><span>{a.make}</span><strong>{a.model}</strong><b>{aWins} profile {aWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(a)}</small></article>
      <article className="comparison-decision-middle"><span>Across {rows.length} rider profiles</span><strong>{ties ? `${ties} close call${ties > 1 ? "s" : ""}` : "Clearer trade-offs"}</strong><small>Use the row reasoning and measurable differences instead of treating a numeric score as a verdict.</small></article>
      <article><span>{b.make}</span><strong>{b.model}</strong><b>{bWins} profile {bWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(b)}</small></article>
    </div>
    <div className="comparison-scenario-list">{rows.map((row) => <article key={row.scenario.key}>
      <div className="comparison-scenario-copy"><span>{row.scenario.label}</span><p>{row.scenario.description}</p></div>
      <div className={`comparison-scenario-score ${row.winner?.id === a.id ? "winner" : ""}`}><strong>{fitLabel(row.winner?.id, a.id)}</strong><span>{a.model}</span></div>
      <div className="comparison-scenario-verdict"><b>{row.winner ? `${row.winner.model} is the better starting point` : "Close call"}</b><small>{row.winner ? "Open the evidence below and check whether that advantage matters for your ride." : "The measurable factors are close enough that fit, price and preference should decide."}</small></div>
      <div className={`comparison-scenario-score ${row.winner?.id === b.id ? "winner" : ""}`}><strong>{fitLabel(row.winner?.id, b.id)}</strong><span>{b.model}</span></div>
    </article>)}</div>
    <details className="comparison-score-method"><summary>How MotoIndex forms these judgments</summary><p>The underlying decision engine evaluates the same transparent factors used by Finder, including rider fit, use case, traffic, passenger or luggage needs and ownership-cost assumptions. The public comparison emphasizes the interpretation instead of presenting small score differences as precision.</p></details>
    <div className="comparison-decision-cta"><div><strong>Use your own priorities instead.</strong><span>Set budget, inseam, traffic, passenger, luggage and monthly ownership limits in the Finder.</span></div><Link className="button" href={{pathname:"/finder",query:{budget:String(Math.ceil(Math.max(a.srp,b.srp)/50000)*50000),use:"city"}}}>Open personalized Finder</Link></div>
  </section>;
}

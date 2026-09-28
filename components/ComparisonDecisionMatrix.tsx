import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { allScenarioComparisons } from "@/lib/comparisonDecision";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import styles from "./ComparisonDecisionMatrix.module.css";

function fitLabel(winnerId: string | undefined, modelId: string) {
  if (!winnerId) return "Good fit";
  return winnerId === modelId ? "Best for" : "Trade-off";
}

export function ComparisonDecisionMatrix({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const rows = allScenarioComparisons(a, b);
  const aWins = rows.filter((row) => row.winner?.id === a.id).length;
  const bWins = rows.filter((row) => row.winner?.id === b.id).length;
  const ties = rows.length - aWins - bWins;
  return <section className={styles.matrix}>
    <div className={styles.head}><span>Decision matrix</span><h2>Which one suits which kind of ride?</h2><p>Plain-language judgments based on measurable MotoIndex factors—not universal motorcycle scores.</p></div>
    <div className={styles.summary}>
      <article><span>{a.make}</span><strong>{a.model}</strong><b>{aWins} profile {aWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(a)}</small></article>
      <article className={styles.summaryMiddle}><span>Across {rows.length} rider profiles</span><strong>{ties ? `${ties} close call${ties > 1 ? "s" : ""}` : "Clearer trade-offs"}</strong><small>Use the evidence behind each row instead of treating a score as a verdict.</small></article>
      <article><span>{b.make}</span><strong>{b.model}</strong><b>{bWins} profile {bWins === 1 ? "lead" : "leads"}</b><small>{observedMarketPriceLabel(b)}</small></article>
    </div>
    <div className={styles.scenarios}>{rows.map((row) => <article key={row.scenario.key}>
      <div className={styles.scenarioCopy}><span>{row.scenario.label}</span><p>{row.scenario.description}</p></div>
      <div className={`${styles.score} ${row.winner?.id === a.id ? styles.winner : ""}`}><strong>{fitLabel(row.winner?.id, a.id)}</strong><span>{a.model}</span></div>
      <div className={styles.verdict}><b>{row.winner ? `${row.winner.model} is the better starting point` : "Close call"}</b><small>{row.winner ? "Check whether that advantage matters for your ride." : "Fit, price and preference should decide."}</small></div>
      <div className={`${styles.score} ${row.winner?.id === b.id ? styles.winner : ""}`}><strong>{fitLabel(row.winner?.id, b.id)}</strong><span>{b.model}</span></div>
    </article>)}</div>
    <details className={styles.method}><summary>How MotoIndex forms these judgments</summary><p>The decision engine evaluates rider fit, use case, traffic, passenger or luggage needs and ownership-cost assumptions. The comparison emphasizes interpretation instead of presenting small score differences as precision.</p></details>
    <div className={styles.cta}><div><strong>Use your own priorities.</strong><span>Set budget, inseam, traffic and ownership limits in Finder.</span></div><Link href={{pathname:"/finder",query:{budget:String(Math.ceil(Math.max(a.srp,b.srp)/50000)*50000),use:"city"}}}>Open personalized Finder</Link></div>
  </section>;
}

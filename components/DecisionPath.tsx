import Link from "next/link";
import styles from "./DecisionPath.module.css";

export type DecisionPathStage = "finder" | "compare" | "model" | "helmet";

type Props = {
  stage: DecisionPathStage;
  modelName?: string;
  make?: string;
  makeSlug?: string;
  modelSlug?: string;
};

export function DecisionPath({ stage, modelName, make, makeSlug, modelSlug }: Props) {
  if (stage === "helmet") {
    return <section className={`${styles.path} decision-path`} aria-labelledby="helmet-decision-path">
      <div className="decision-path-copy"><span>Next steps</span><h2 id="helmet-decision-path">From filter to the helmet you can actually buy</h2><p>Use the finder to narrow the catalog, compare exact models, then open the product page to check sizing, certification wording and the seller source.</p></div>
      <div className="decision-path-steps">
        <article><b>01</b><strong>Filter the catalog</strong><small>Budget, type, size and features.</small></article>
        <article><b>02</b><strong>Compare finalists</strong><small>Put exact helmets side by side.</small><Link href="/gear/helmets/compare">Compare helmets →</Link></article>
        <article><b>03</b><strong>Verify the exact unit</strong><small>Confirm fit, PS/ICC marking, variant and seller before buying.</small></article>
      </div>
    </section>;
  }

  if (stage === "finder") {
    return <section className={`${styles.path} decision-path`} aria-labelledby="finder-decision-path">
      <div className="decision-path-copy"><span>What to do with your results</span><h2 id="finder-decision-path">Turn the shortlist into a buying decision</h2><p>Do not stop at a ranking. Save two or three realistic candidates, compare them directly, then open the exact model before contacting dealers.</p></div>
      <div className="decision-path-steps">
        <article><b>01</b><strong>Save 2–3 candidates</strong><small>Keep only motorcycles that fit the real budget and use case.</small><Link href="/shortlist">Open shortlist →</Link></article>
        <article><b>02</b><strong>Compare the finalists</strong><small>Price, fit, engine, fuel and braking side by side.</small><Link href="/compare">Compare motorcycles →</Link></article>
        <article><b>03</b><strong>Check the exact model</strong><small>Review price sources, ownership costs, maintenance and dealer options.</small><Link href="/motorcycles">Browse model pages →</Link></article>
      </div>
    </section>;
  }

  if (stage === "compare") {
    return <section className={`${styles.path} decision-path`} aria-labelledby="compare-decision-path">
      <div className="decision-path-copy"><span>After the comparison</span><h2 id="compare-decision-path">Choose a finalist, then verify the ownership details</h2><p>The comparison is for narrowing choices. Before paying, open the exact model, estimate ownership cost and check more than one dealer for the same variant.</p></div>
      <div className="decision-path-steps">
        <article><b>01</b><strong>Keep the winner</strong><small>Save the model you would realistically own.</small><Link href="/shortlist">Open shortlist →</Link></article>
        <article><b>02</b><strong>Read the model guide</strong><small>Price evidence, fit, maintenance and ownership context.</small><Link href="/motorcycles">Open motorcycles →</Link></article>
        <article><b>03</b><strong>Check dealers</strong><small>Confirm stock, exact variant and complete cash price.</small><Link href="/dealers">Find checked dealers →</Link></article>
      </div>
    </section>;
  }

  const dealerHref = make ? { pathname: "/dealers", query: { brand: make } } : "/dealers";
  const compareHref = modelSlug ? { pathname: "/compare", query: { model: modelSlug } } : "/compare";
  return <section className={`${styles.path} decision-path model-decision-path`} aria-labelledby="model-decision-path">
    <div className="decision-path-copy"><span>Ready to narrow it down?</span><h2 id="model-decision-path">Take {modelName || "this motorcycle"} from research to ownership planning</h2><p>Save it, compare the closest alternative, price the gear you may need, then verify the exact variant and complete price with checked dealers before paying a reservation.</p></div>
    <div className="decision-path-steps">
      <article><b>01</b><strong>Save it</strong><small>Keep it with the other motorcycles you are seriously considering.</small><Link href="/shortlist">Open shortlist →</Link></article>
      <article><b>02</b><strong>Compare alternatives</strong><small>Use the same price and specification records.</small><Link href={compareHref}>Compare motorcycles →</Link></article>
      <article><b>03</b><strong>Check ownership gear</strong><small>Price the helmet, tires and luggage you may actually need, then verify the motorcycle with dealers.</small><div><Link href="/gear/helmets">Helmets →</Link> <Link href="/tires">Tires →</Link> <Link href="/accessories/top-box">Top boxes →</Link> <Link href={dealerHref}>Dealers →</Link></div></article>
    </div>
  </section>;
}

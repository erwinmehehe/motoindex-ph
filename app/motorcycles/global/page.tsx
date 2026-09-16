import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { globalModelExpansion2026 } from "@/lib/globalModelExpansion2026";
import { globalDemandExpansion2026 } from "@/lib/globalDemandExpansion2026";
import { motorcycleMarketScopes } from "@/lib/marketScope";
import styles from "./global.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Global Motorcycle Models, Specs & Research | MotoIndex",
  description: "Research globally searched motorcycles by model, engine, power, weight and seat height without mixing overseas bikes into Philippine prices, financing or dealer results.",
  path: "/motorcycles/global",
  index: true
});

const models = [...globalModelExpansion2026, ...globalDemandExpansion2026]
  .filter((model, index, all) => all.findIndex((item) => item.id === model.id) === index)
  .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

export default function GlobalMotorcyclesPage() {
  const brands = [...new Set(models.map((model) => model.make))];
  const electricCount = models.filter((model) => model.engineCc === 0).length;
  const previousCount = models.filter((model) => motorcycleMarketScopes(model).includes("Discontinued / previous generation")).length;

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className="shell">
        <span className={styles.kicker}>International search coverage</span>
        <h1>Global motorcycle research, kept separate from Philippine shopping.</h1>
        <p>MotoIndex can cover motorcycles riders search from other countries without pretending every model has a current Philippine price, dealer network or financing offer. Each record carries a market scope before it can enter a local buying flow.</p>
        <div className={styles.actions}>
          <a className="button" href="#models">Browse global models</a>
          <Link className="button secondary" href="/motorcycles">Philippine motorcycle catalog</Link>
        </div>
        <div className={styles.facts}>
          <div><span>Global-interest models</span><strong>{models.length}</strong><small>Current and previous global records with checked sources</small></div>
          <div><span>Brands</span><strong>{brands.length}</strong><small>BMW, Ducati, Aprilia, Triumph, KTM and more</small></div>
          <div><span>Electric records</span><strong>{electricCount}</strong><small>Kept out of cc-based Philippine filters</small></div>
          <div><span>Previous generations</span><strong>{previousCount}</strong><small>Clearly separated from current-market shopping</small></div>
        </div>
      </div>
    </section>

    <div className={`shell ${styles.body}`}>
      <section className={styles.scopeExplainer}>
        <div><span>Market scope</span><h2>One model can belong to more than one market context</h2><p>Philippine models can also have international search demand. Global-only and previous-generation records stay indexable for research, but PH recommendations and commercial tools only use the Philippine shopping scope.</p></div>
        <div className={styles.scopeGrid}>
          <article><strong>Philippines</strong><p>Eligible for PH recommendations and local commercial tools only when current and price-verified.</p></article>
          <article><strong>Global</strong><p>Search and specification research that can serve visitors from multiple countries.</p></article>
          <article><strong>Imported / grey market</strong><p>Reserved for models that appear locally without an official Philippine-market position.</p></article>
          <article><strong>Previous generation</strong><p>Kept for ownership, used-bike and historical research, never mixed with current new-bike pricing.</p></article>
        </div>
      </section>

      <section id="models" className={styles.modelsSection}>
        <div className={styles.sectionHead}><span>Browse models</span><h2>Global motorcycle model coverage</h2><p>Prices are intentionally omitted here. Open a model for its source-backed specifications and market status.</p></div>
        <div className={styles.modelGrid}>
          {models.map((model) => {
            const scopes = motorcycleMarketScopes(model);
            return <Link href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id} className={styles.modelCard}>
              <div><span>{model.make}</span><h3>{model.model}</h3><p>{model.category}</p></div>
              <dl>
                <div><dt>{model.engineCc ? "Engine" : "Powertrain"}</dt><dd>{model.engineCc ? `${model.engineCc.toLocaleString("en-PH")} cc` : "Electric"}</dd></div>
                <div><dt>Power</dt><dd>{model.powerHp.toLocaleString("en-PH", { maximumFractionDigits: 1 })} hp</dd></div>
                <div><dt>Weight</dt><dd>{model.curbWeightKg.toLocaleString("en-PH", { maximumFractionDigits: 1 })} kg</dd></div>
                <div><dt>Seat</dt><dd>{model.seatHeightMm.toLocaleString("en-PH")} mm</dd></div>
              </dl>
              <div className={styles.scopeTags}>{scopes.map((scope) => <span key={scope}>{scope}</span>)}</div>
              <strong className={styles.open}>Open model research →</strong>
            </Link>;
          })}
        </div>
      </section>
    </div>
  </main>;
}

import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { motorcycleMarketScopes, globalResearchPriceNote } from "@/lib/marketScope";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EntityMedia } from "@/components/EntityMedia";
import { AuthorBox } from "@/components/AuthorBox";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import styles from "./GlobalMotorcycleEntityPage.module.css";

function powerLabel(model: Motorcycle) {
  return `${model.powerHp.toLocaleString("en-PH", { maximumFractionDigits: 1 })} hp`;
}

export function GlobalMotorcycleEntityPage({ model }: { model: Motorcycle }) {
  const scopes = motorcycleMarketScopes(model);
  const previous = scopes.includes("Discontinued / previous generation");
  const faqItems: FaqItem[] = [
    {
      question: `Is the ${model.make} ${model.model} officially sold in the Philippines?`,
      answer: `MotoIndex currently treats this as a ${previous ? "previous-generation global" : "global research"} record, not a current Philippine-market shopping record. That is why this page does not show a Philippine dealer quote, financing estimate or current PH price.`
    },
    {
      question: `Can I use the specs on this ${model.model} page for every country?`,
      answer: "Use them as a researched reference, then confirm the exact model year and local-market specification. Equipment, homologation, colors, accessories and sometimes dimensions can vary by country."
    },
    {
      question: `Why is there no Philippine monthly payment for the ${model.model}?`,
      answer: "MotoIndex only shows Philippine financing examples when a motorcycle is in the current Philippine shopping scope with a checked Philippine price. Global-only records are deliberately kept out of that flow."
    }
  ];

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className="shell">
        <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Global research", href: "/motorcycles/global" }, { label: `${model.make} ${model.model}` }]} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>{previous ? "Previous-generation global research" : "Global motorcycle research"}</span>
            <h1>{model.make} {model.model}</h1>
            <p>{model.summary}</p>
            <div className={styles.scopes} aria-label="Market scope">
              {scopes.map((scope) => <span key={scope}>{scope}</span>)}
            </div>
            <div className={styles.priceGuard}>
              <span>Pricing status</span>
              <strong>{globalResearchPriceNote(model)}</strong>
              <small>No Philippine SRP, dealer quote or monthly-payment estimate is inferred from an overseas listing.</small>
            </div>
          </div>
          <div className={styles.media}>
            <EntityMedia
              entityType="motorcycle"
              entityId={model.id}
              className={styles.entityMedia}
              showCredit={false}
              sizes="(max-width: 900px) 100vw, 46vw"
              fallback={<div className={styles.mediaFallback}><span>{model.make}</span><strong>{model.model}</strong><small>Verified model data · exact image pending</small></div>}
            />
          </div>
        </div>
      </div>
    </section>

    <div className={`shell ${styles.body}`}>
      <section className={styles.specSection}>
        <div className={styles.sectionHead}><span>Core specifications</span><h2>Published {model.model} specifications</h2><p>These are model-level figures from the linked manufacturer or official-market reference. Confirm the exact model year sold in your country before buying parts or making a purchase decision.</p></div>
        <div className={styles.specGrid}>
          <div><span>Power</span><strong>{powerLabel(model)}</strong></div>
          <div><span>{model.engineCc ? "Engine" : "Powertrain"}</span><strong>{model.engineCc ? `${model.engineCc.toLocaleString("en-PH")} cc` : "Electric"}</strong></div>
          <div><span>Torque</span><strong>{model.torqueNm.toLocaleString("en-PH", { maximumFractionDigits: 1 })} Nm</strong></div>
          <div><span>Published weight</span><strong>{model.curbWeightKg.toLocaleString("en-PH", { maximumFractionDigits: 1 })} kg</strong></div>
          <div><span>Seat height</span><strong>{model.seatHeightMm.toLocaleString("en-PH")} mm</strong></div>
          {model.fuelTankL > 0 && <div><span>Fuel tank</span><strong>{model.fuelTankL.toLocaleString("en-PH", { maximumFractionDigits: 1 })} L</strong></div>}
          <div><span>Front tire</span><strong>{model.frontTire}</strong></div>
          <div><span>Rear tire</span><strong>{model.rearTire}</strong></div>
          <div><span>Braking</span><strong>{model.abs}</strong></div>
          <div><span>Transmission</span><strong>{model.transmission || "Check source"}</strong></div>
        </div>
      </section>

      <section className={styles.marketSection}>
        <div>
          <span>Market boundary</span>
          <h2>Kept separate from Philippine shopping tools</h2>
          <p>This page is intentionally research-only for the Philippine buying flow. The motorcycle can rank for international model research without being inserted into PH budget guides, dealer searches, price rankings or loan estimates.</p>
        </div>
        <div className={styles.marketRules}>
          <article><strong>Included</strong><p>Global model search, specifications, market status, source trail and editorial research.</p></article>
          <article><strong>Excluded</strong><p>Philippine recommendations, PH dealer quote CTAs, local financing examples and “current Philippine price” claims.</p></article>
        </div>
      </section>

      <section className={styles.sourceSection}>
        <div><span>Primary research source</span><h2>Check the manufacturer record</h2><p>Source checked {model.verifiedAt}. Market equipment can change, so use the destination below for the latest local-market configuration.</p></div>
        <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer">{model.sourceLabel} ↗</a>
      </section>

      <div className={styles.nextLinks}>
        <Link href="/motorcycles/global">Browse global research models →</Link>
        <Link href="/motorcycles">Browse Philippine motorcycle catalog →</Link>
      </div>
      <FaqSection title={`${model.make} ${model.model} market questions`} items={faqItems} />
      <AuthorBox />
    </div>
  </main>;
}

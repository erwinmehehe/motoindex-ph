import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { observedMarketPriceLabel, observedMarketRange } from "@/lib/marketChecks";
import { currentPublicMotorcycles, hasAbs, marketBrandCount, marketMedianPrice, priceOrdered } from "@/lib/motorcycleMarket";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";

const legalThresholdCc = 400;
const eligible = priceOrdered(currentPublicMotorcycles.filter((model) => model.engineCc >= 400));
const borderline = priceOrdered(currentPublicMotorcycles.filter((model) => model.engineCc >= 350 && model.engineCc < 400));
const medianPrice = marketMedianPrice(eligible);
const absCount = eligible.filter(hasAbs).length;
const under300k = eligible.filter((model) => observedMarketRange(model).from < 300000).length;
const tableColumns: CSSProperties = { gridTemplateColumns: "1.7fr 1.15fr .55fr .65fr .65fr 1.35fr" };

export const metadata: Metadata = pageMetadata({
  title: "Expressway-Legal Motorcycles Philippines 2026 | 400cc Guide",
  description: "Check 400cc+ motorcycles for Philippine expressway planning, the official 400cc threshold, current tollway requirements, prices and sub-400cc models not to round up.",
  path: "/motorcycles/expressway-legal",
  index: eligible.length >= 3
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "400cc+ motorcycle candidates for Philippine expressway planning",
  numberOfItems: eligible.length,
  itemListElement: eligible.map((model, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${model.make} ${model.model}`,
    url: `${SITE_URL}/motorcycles/${model.makeSlug}/${model.slug}`
  }))
};

export default function ExpresswayLegalMotorcyclesPage() {
  return <main className="page">
    <div className="shell">
      <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Expressway legal" }]} />
      <PageHero
        kicker="Philippine expressway planning"
        title="Expressway-legal motorcycles in the Philippines"
        description="Shortlist current 400cc+ motorcycles for Philippine expressway planning, compare their prices and specifications, then verify the exact registered motorcycle and current tollway requirements before travel."
        actions={<CTAGroup>
          <a className="button" href="#qualifying-models">View 400cc+ candidates</a>
          <Link className="button secondary" href="/recommendations/motorcycles-400cc-plus-philippines">Compare all 400cc+ models</Link>
          <Link className="button secondary" href="/compare">Compare motorcycles</Link>
        </CTAGroup>}
      />

      <section className="section" aria-labelledby="expressway-rule">
        <SectionHeader
          kicker="Legal threshold"
          title="The rule is at least 400cc, not a 400-style model badge"
          titleId="expressway-rule"
          description="DOTC Department Order No. 2007-38 states that only motorcycles with an engine displacement of at least 400 cubic centimeters may operate on limited-access facilities."
        />
        <div className="ui-content-grid">
          <InfoPanel>
            <h3>Official legal source</h3>
            <p><strong>DOTC Department Order No. 2007-38</strong> sets the minimum engine-displacement threshold at 400cc for motorcycles using limited-access facilities.</p>
            <p><a href="https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/45210" target="_blank" rel="noreferrer">Read the order in the Supreme Court E-Library →</a></p>
          </InfoPanel>
          <InfoPanel>
            <h3>What MotoIndex treats as qualifying</h3>
            <p>The shortlist below uses the recorded motorcycle specification and includes only current indexable models where <code>engineCc &gt;= 400</code>. It does not round 398cc or 399cc up to 400cc.</p>
          </InfoPanel>
          <InfoPanel>
            <h3>What you still need to verify</h3>
            <p>Confirm the exact unit, its registration/OR-CR details, current operator entry requirements, RFID/payment setup, safety equipment and any route-specific restrictions before travel.</p>
          </InfoPanel>
          <InfoPanel>
            <h3>Why this is separate from the 400cc buying guide</h3>
            <p>The 400cc+ guide compares price, weight, seat height and performance. This page focuses on the legal threshold, borderline models and the checks needed before an expressway trip.</p>
          </InfoPanel>
        </div>
      </section>

      <section className="section" aria-labelledby="current-tollway-evidence">
        <SectionHeader
          kicker="Current tollway checks"
          title="Separate the 400cc legal threshold from current operator requirements"
          titleId="current-tollway-evidence"
          description="The legal displacement threshold is only one part of expressway planning. Current operator and Toll Regulatory Board requirements can add payment, RFID and route-specific checks."
        />
        <div className="ui-content-grid">
          <InfoPanel>
            <h3>NLEX confirms the 400cc+ motorcycle class</h3>
            <p>NLEX Corporation's official NLEX Connector release states that the road caters to motorcycles with displacement of 400cc and above. That supports using 400cc+ as the expressway-research threshold, while the Department Order remains the legal source.</p>
            <p><a href="https://nlex.com.ph/wp-content/uploads/2023/03/NLEX-Corporation-SEC-17-C-Inauguration-of-NLEX-Connector-Road.pdf" target="_blank" rel="noreferrer">Read the NLEX Corporation release →</a></p>
          </InfoPanel>
          <InfoPanel>
            <h3>RFID and toll-system requirements can change</h3>
            <p>The Toll Regulatory Board re-implemented cashless/contactless requirements from March 15, 2025 for toll expressways under its jurisdiction. Check the latest RFID and payment guidance before a trip rather than relying on an old forum post or dealer claim.</p>
            <p><a href="https://www.trb.gov.ph/index.php/toll-rates/nlex-slex-connector-road-toll-rate/47-press-release" target="_blank" rel="noreferrer">Check the Toll Regulatory Board guidance →</a></p>
          </InfoPanel>
          <InfoPanel>
            <h3>399cc is still below 400cc</h3>
            <p>MotoIndex uses the recorded displacement field, not the marketing badge. A motorcycle recorded at 398cc or 399cc stays in the caution table even if its model name includes 400.</p>
          </InfoPanel>
          <InfoPanel>
            <h3>Buying guide and legal guide have different jobs</h3>
            <p><Link href="/recommendations/motorcycles-400cc-plus-philippines">The 400cc+ buying guide</Link> compares price, weight, seat height, power and ABS. This page owns the expressway rule, borderline-displacement and trip-verification intent.</p>
          </InfoPanel>
        </div>
      </section>

      <section className="section" aria-labelledby="expressway-snapshot">
        <SectionHeader
          kicker="Current dataset"
          title="400cc+ market snapshot"
          titleId="expressway-snapshot"
          description="Calculated from current indexable MotoIndex motorcycle records with at least 400cc recorded displacement."
        />
        <StatRow items={[
          { label: "400cc+ records", value: eligible.length, note: "Current indexable models" },
          { label: "Brands", value: marketBrandCount(eligible), note: "Brands represented" },
          { label: "Median starting price", value: medianPrice ? php(medianPrice) : "Updating", note: "Median observed entry price" },
          { label: "Below ₱300K", value: under300k, note: "Current recorded models" },
          { label: "ABS listed", value: absCount, note: "Records listing ABS equipment" }
        ]} />
      </section>

      <section id="qualifying-models" className="section" aria-labelledby="qualifying-models-title">
        <SectionHeader
          kicker="400cc and above"
          title="Current motorcycles that clear the recorded displacement threshold"
          titleId="qualifying-models-title"
          description="Rows are ordered by observed starting price. Inclusion here means the MotoIndex record is at least 400cc; it is not a substitute for checking the exact registered unit before entering an expressway."
        />
        <DataTable label="400cc and above motorcycle records">
          <div className="head" role="row" style={tableColumns}>
            <span>Model</span><span>Price</span><span>CC</span><span>Seat</span><span>Weight</span><span>Braking</span>
          </div>
          {eligible.map((model) => <div role="row" style={tableColumns} key={model.id}>
            <span role="cell"><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}><strong>{model.make} {model.model}</strong></Link><br /><small>{model.category}</small></span>
            <span role="cell"><strong>{observedMarketPriceLabel(model)}</strong><br /><small>Checked {model.marketPriceCheckedAt || model.verifiedAt}</small></span>
            <span role="cell">{model.engineCc} cc</span>
            <span role="cell">{model.seatHeightMm} mm</span>
            <span role="cell">{model.curbWeightKg} kg</span>
            <span role="cell">{model.abs}</span>
          </div>)}
        </DataTable>
      </section>

      {borderline.length > 0 && <section className="section" aria-labelledby="borderline-models">
        <SectionHeader
          kicker="Do not round up"
          title="Models below 400cc that need extra caution"
          titleId="borderline-models"
          description="These current motorcycles sit between 350cc and 399cc in the MotoIndex record. A model name containing 390, 400 or 401 is not enough to satisfy an at-least-400cc displacement rule."
        />
        <DataTable label="Current motorcycle records below the 400cc threshold">
          <div className="head" role="row" style={{ gridTemplateColumns: "1.7fr .8fr 1.1fr" }}>
            <span>Model</span><span>Recorded CC</span><span>Status for this page</span>
          </div>
          {borderline.map((model) => <div role="row" style={{ gridTemplateColumns: "1.7fr .8fr 1.1fr" }} key={model.id}>
            <span role="cell"><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}><strong>{model.make} {model.model}</strong></Link></span>
            <span role="cell">{model.engineCc} cc</span>
            <span role="cell"><strong>Below {legalThresholdCc}cc</strong><br /><small>Do not assume expressway eligibility from the model badge.</small></span>
          </div>)}
        </DataTable>
      </section>}

      <section className="section" aria-labelledby="expressway-checklist">
        <SectionHeader
          kicker="Before you ride"
          title="Verify the exact motorcycle and route"
          titleId="expressway-checklist"
          description="MotoIndex can narrow the motorcycle list, but the final travel decision depends on the registered unit and current operator requirements."
        />
        <div className="ui-content-grid">
          <InfoPanel subtle><h3>1. Check registered displacement</h3><p>Match the motorcycle you are actually riding to its registration details. Do not rely on the marketing name or rounded class label.</p></InfoPanel>
          <InfoPanel subtle><h3>2. Check the operator</h3><p>Review current entry, RFID/payment, lane, speed and equipment rules for the specific expressway you will use.</p></InfoPanel>
          <InfoPanel subtle><h3>3. Check the motorcycle</h3><p>Confirm tires, brakes, lights, mirrors, fluids and fuel before sustained higher-speed travel.</p></InfoPanel>
          <InfoPanel subtle><h3>4. Check the rider</h3><p>Use compliant protective equipment and make sure your licence, registration and other required documents are current.</p></InfoPanel>
        </div>
      </section>

      <section className="section" aria-labelledby="expressway-research-next">
        <SectionHeader
          kicker="Research next"
          title="Compare the motorcycle, not only the legal threshold"
          titleId="expressway-research-next"
          description="A motorcycle can clear the displacement threshold and still be a poor fit for your budget, height, experience or ownership needs."
        />
        <CTAGroup>
          <Link className="button secondary" href="/recommendations/motorcycles-400cc-plus-philippines">400cc motorcycle prices and specs</Link>
          <Link className="button secondary" href="/recommendations/best-motorcycles-for-long-rides">Long-ride motorcycles</Link>
          <Link className="button secondary" href="/research/motorcycle-seat-height-database">Seat-height database</Link>
          <Link className="button secondary" href="/tools/motorcycle-loan-calculator">Loan calculator</Link>
          <Link className="button secondary" href="/ownership/cost-calculator">Ownership cost</Link>
        </CTAGroup>
      </section>

      <JsonLd data={itemListSchema} />
    </div>
  </main>;
}

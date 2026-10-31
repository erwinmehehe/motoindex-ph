import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FuelCompanyExplorer, FuelCostImpactCalculator } from "@/components/FuelPriceInteractives";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, SITE_URL } from "@/lib/site";
import {
  DOE_FUEL_SOURCE, FUEL_TYPES, fuelDirection, fuelRange, getFuelFeed,
  type FuelMovement, type FuelType
} from "@/lib/fuelPriceFeed";
import pumpSnapshot from "@/data/fuel-pump-prices.ncr.json";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Gas Price Philippines: Actual Pump Price Ranges & DOE Updates | MotoIndex",
  description: "Check dated Metro Manila gasoline and diesel pump-price ranges per liter, plus official DOE weekly price adjustments and regional source reports.",
  path: "/gas-price-philippines",
  index: true
});

const fuelNames: Record<FuelType, string> = { gasoline: "Gasoline", diesel: "Diesel", kerosene: "Kerosene" };
const regionLinks = [
  { label: "Metro Manila / NCR", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/ncr-pump-prices" },
  { label: "North Luzon", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/north-luzon-pump-prices" },
  { label: "South Luzon", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/south-luzon-pump-prices" },
  { label: "Visayas", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/visayas-pump-prices" },
  { label: "Mindanao", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/mindanao-pump-prices" }
];

function dateLabel(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-PH", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Manila"
  });
}
function weekLabel(start: string, end: string) {
  return `${dateLabel(start)} – ${dateLabel(end)}`;
}
function movementStatus(movement: FuelMovement) {
  const direction = fuelDirection(movement);
  return direction === "down" ? "Decrease" : direction === "up" ? "Increase" :
    direction === "mixed" ? "Mixed adjustments" : direction === "flat" ? "No change" : "Not reported";
}
function movementCount(movement: FuelMovement) {
  if (!movement) return "No company figure reported";
  return `${movement.reportingCompanies} reporting ${movement.reportingCompanies === 1 ? "company" : "companies"}`;
}

function FuelIcon({ type }: { type: FuelType }) {
  return <span className={styles.fuelIcon} aria-hidden="true">
    {type === "gasoline" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V4.8A1.8 1.8 0 0 1 5.8 3h8.4A1.8 1.8 0 0 1 16 4.8V21M4 9h12M3 21h15M19 9l2 2v6a2 2 0 0 1-4 0v-4"/></svg> :
    type === "diesel" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h10l2 5v13H5V8l2-5ZM5 9h14M9 13h6M9 17h6"/></svg> :
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2S6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12ZM9 15c.3 1.8 1.2 2.7 3 3"/></svg>}
  </span>;
}

const faqs = [
  { question: "Are these today’s pump prices at my station?", answer: "No. The Metro Manila price section shows the lowest and highest observed station prices for its displayed report week. It is a dated retail-price reference, not a live station quote or a national average. The weekly DOE adjustment figures elsewhere on this page are changes, not pump totals." },
  { question: "How often will MotoIndex update this page?", answer: "The importer checks DOE notices on weekdays. A new verified report appears only after its PDF passes format and value checks. If a source is unavailable, the last valid report stays visible with a warning." },
  { question: "Why do some oil companies have no kerosene figure?", answer: "A dash means that the oil company's kerosene adjustment was not stated in the DOE notice. It does not mean there was no price change." },
  { question: "How can I estimate my commuting fuel expense?", answer: "Enter your weekly fuel volume in the calculator. It multiplies that volume by the reported per-liter change. To estimate your full monthly budget, use the commute cost calculator and a current pump price near you." }
];

export default async function GasPricePhilippinesPage() {
  const pumpPeriod = weekLabel(pumpSnapshot.weekStart, pumpSnapshot.weekEnd);
  const pumpIsOlder = Date.now() - Date.parse(`${pumpSnapshot.weekEnd}T15:59:59Z`) > 7 * 86400000;
  const { feed, usingFallback } = await getFuelFeed();
  const latest = feed.weeks[0];
  const dated = weekLabel(latest.weekStart, latest.weekEnd);
  const isOlder = Date.now() - Date.parse(`${latest.weekEnd}T15:59:59Z`) > 14 * 86400000;
  const lastChecked = new Date(feed.updatedAt).toLocaleString("en-PH", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila"
  });
  const peak = Math.max(1, ...FUEL_TYPES.flatMap((type) => {
    const value = latest.summary[type];
    return value ? [Math.abs(value.min), Math.abs(value.max)] : [0];
  }));
  const sourceSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Philippines DOE weekly retail fuel price adjustments",
    description: "Officially notified weekly per-liter fuel price changes by reporting oil company. These are not actual station pump prices.",
    url: SITE_URL + "/gas-price-philippines",
    dateModified: feed.updatedAt,
    isBasedOn: DOE_FUEL_SOURCE,
    creator: { "@type": "GovernmentOrganization", name: "Philippines Department of Energy" },
    publisher: { "@type": "Organization", name: "MotoIndex PH", url: SITE_URL },
    variableMeasured: ["Gasoline price change in PHP per liter", "Diesel price change in PHP per liter", "Kerosene price change in PHP per liter"]
  };

  return <section className={`page shell ${styles.page}`} data-fuel-price-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Gas price monitoring" }]} />

    <div className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}><i className={styles.eyebrowDot} aria-hidden="true"/>Fuel watch · Philippines</span>
        <h1>Gas price updates<br/>in the <span>Philippines.</span></h1>
        <p className={styles.lede}>See dated gasoline and diesel prices per liter in Metro Manila, then track weekly DOE price changes and compare oil-company adjustments.</p>
        <div className={styles.heroActions}>
          <a className="button" href="#pump-prices">See pump prices per liter ↓</a>
          <a className={styles.secondaryButton} href={latest.sourceUrl} target="_blank" rel="noopener noreferrer">View DOE weekly notice ↗</a>
        </div>
        <div className={styles.heroTrust} aria-label="Data transparency">
          <span>✓ DOE source-linked</span><span>▦ By-company breakdown</span><span>◷ Dated reports</span>
        </div>
      </div>

      <aside className={styles.reportCard} aria-label="Latest available DOE fuel adjustment report">
        <div className={styles.reportTop}><span>Latest available weekly report</span><span className={styles.sourceLabel}>✓ DOE source</span></div>
        <h2>{dated}</h2>
        <p>{usingFallback ? "Showing the last bundled source-checked report" : "Source-validated DOE adjustments"}</p>
        <div className={styles.reportGraph}>
          <div className={styles.reportGraphHeading}><span>Fuel adjustment overview</span><span>PHP/L</span></div>
          {FUEL_TYPES.map((type) => {
            const value = latest.summary[type];
            const direction = fuelDirection(value);
            const size = value ? Math.max(Math.abs(value.min), Math.abs(value.max)) / peak * 88 : 0;
            return <div className={styles.reportBar} key={type}>
              <span>{fuelNames[type]}</span>
              <div className={styles.track}><i className={direction === "up" ? styles.barUp : direction === "down" ? styles.barDown : styles.barNeutral} style={{ width: `${size}%` }}/></div>
              <strong>{fuelRange(value)}</strong>
            </div>;
          })}
          <p>Changes per liter, not current pump prices.</p>
        </div>
        <small>Feed checked {lastChecked} (Philippine time)</small>
      </aside>
    </div>

    {(usingFallback || isOlder) ? <div className={styles.warning} role="status">
      <strong>{usingFallback ? "Live feed temporarily unavailable." : "The latest available report may be outdated."}</strong>
      <span>{usingFallback ? "Showing the last source-checked figures bundled with MotoIndex, not claiming current prices." :
        "Check the DOE for newer notices before using these figures."}</span>
      <a href={DOE_FUEL_SOURCE} target="_blank" rel="noopener noreferrer">Check DOE notices ↗</a>
    </div> : null}

    <nav className={styles.jumpNav} aria-label="Sections on this page">
      <span>Jump to</span><a href="#pump-prices">Pump prices per liter</a><a href="#weekly">Weekly changes</a><a href="#companies">Oil company changes</a>
      <a href="#impact">Cost impact</a><a href="#sources">Sources</a><a href="#history">History</a>
    </nav>


    <section id="pump-prices" className={styles.section} aria-labelledby="pump-prices-heading">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Retail pump prices · Metro Manila</span>
          <h2 id="pump-prices-heading">How much is gasoline and diesel per liter?</h2>
          <p>Latest linked DOE retail report checked {dateLabel(pumpSnapshot.sourceCheckedAt)}: {pumpSnapshot.coverage}, {pumpPeriod}. These are low-to-high pump prices, not a single Philippine average and not the weekly price changes shown below.</p>
        </div>
        <span className={styles.dateChip}>{pumpPeriod}</span>
      </div>
      <div className={styles.pumpGrid}>
        {pumpSnapshot.fuels.map((fuel) => <article className={styles.pumpCard} key={fuel.id}>
          <span className={styles.pumpGrade}>{fuel.grade}</span>
          <h3>{fuel.name}</h3>
          <strong>₱{fuel.low.toFixed(2)} <span>–</span> ₱{fuel.high.toFixed(2)}</strong>
          <small>Observed range, PHP per liter</small>
          <p>DOE common price <b>₱{fuel.common.toFixed(2)}/L</b></p>
        </article>)}
      </div>
      <div className={styles.pumpNote} role={pumpIsOlder ? "status" : undefined}>
        <div>
          <strong>{pumpIsOlder ? "Older retail-price snapshot." : "Prices are from a dated monitoring week."}</strong>
          <p>DOE monitored these NCR prices on {weekLabel(pumpSnapshot.monitoringStart, pumpSnapshot.monitoringEnd)}. The common price is the figure listed by DOE, not an average or a guaranteed station price. A newer retail report was not linked when checked; later weekly adjustments below are separate and have not been added to these observed ranges.</p>
        </div>
        <div className={styles.pumpSources}>
          <a href={pumpSnapshot.sourceUrl} target="_blank" rel="noopener noreferrer">DOE NCR reports ↗</a>
          <a href={pumpSnapshot.sourcePdfUrl} target="_blank" rel="noopener noreferrer">View retail price PDF ↗</a>
        </div>
      </div>
    </section>

    <section id="weekly" className={styles.section} aria-labelledby="weekly-heading">
      <div className={styles.sectionHeading}>
        <div><span className={styles.eyebrow}>The weekly picture</span><h2 id="weekly-heading">Fuel price adjustments</h2>
          <p>Latest available report: {dated}. A negative number means a decrease, and a positive number means an increase.</p></div>
        <span className={styles.unit}>₱ per liter</span>
      </div>
      <div className={styles.fuelGrid}>
        {FUEL_TYPES.map((type) => {
          const movement = latest.summary[type];
          const direction = fuelDirection(movement);
          return <article key={type} className={styles.fuelCard}>
            <div className={styles.fuelCardTop}><FuelIcon type={type}/><span className={`${styles.movePill} ${direction === "down" ? styles.pillDown : direction === "up" ? styles.pillUp : styles.pillFlat}`}>{movementStatus(movement)}</span></div>
            <h3>{fuelNames[type]}</h3>
            <strong className={`${styles.fuelValue} ${direction === "down" ? styles.decrease : direction === "up" ? styles.increase : styles.unchanged}`}>{fuelRange(movement)}</strong>
            <span className={styles.perLiter}>per liter adjusted</span>
            <p>{movementCount(movement)}</p>
          </article>;
        })}
      </div>
      <div className={styles.notice}><span aria-hidden="true">i</span><div><strong>These are price changes, not total station prices.</strong>
        <p>Actual pump prices vary by station, location and fuel grade. A dash means the oil company did not report that fuel. All values are linked to a dated DOE notice.</p></div></div>
    </section>

    <section id="companies" className={styles.section} aria-labelledby="company-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Compare the market</span>
        <h2 id="company-heading">Price changes by oil company</h2>
        <p>Search companies and filter by reported fuel type. Figures come from the DOE notice for {dated}.</p></div>
        <span className={styles.dateChip}>{dated}</span>
      </div>
      <FuelCompanyExplorer companies={latest.companies} sourceUrl={latest.sourceUrl}/>
      <p className={styles.footnote}>A dash indicates a missing reported figure, not a zero-price change. Source: <a href={latest.sourceUrl} target="_blank" rel="noopener noreferrer">official DOE PDF ↗</a>.</p>
    </section>

    <section id="impact" className={styles.section} aria-labelledby="impact-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>For everyday riders</span>
        <h2 id="impact-heading">What does it mean for your ride?</h2>
        <p>See weekly movement at a glance and estimate a change in your regular fuel purchases.</p></div></div>
      <div className={styles.impactGrid}>
        <article className={styles.impactCard}>
          <span className={styles.eyebrow}>Movement at a glance</span>
          <h3>Up, down, or unchanged?</h3>
          <p>The direction and magnitude of the reported per-liter adjustments for {dated}.</p>
          <div className={styles.movementList}>{FUEL_TYPES.map((type) => {
            const movement = latest.summary[type];
            const value = movement ? Math.max(Math.abs(movement.min), Math.abs(movement.max)) : 0;
            const width = `${value / peak * 90}%`;
            return <div className={styles.movementRow} key={type}>
              <span>{fuelNames[type]}</span><div className={styles.movementTrack}><i style={{ width }} className={fuelDirection(movement) === "down" ? styles.barDown : fuelDirection(movement) === "up" ? styles.barUp : styles.barNeutral}/></div>
              <strong>{fuelRange(movement)}</strong>
            </div>;
          })}</div>
          <small>Bars show the magnitude of each adjustment within this report, not nationwide pump prices.</small>
        </article>
        <FuelCostImpactCalculator summary={latest.summary}/>
      </div>
      <p className={styles.moreTools}>For your full budget, <Link href="/commute/cost-calculator">open the motorcycle commute cost calculator ↗</Link>.</p>
    </section>

    <section id="sources" className={styles.section} aria-labelledby="source-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Source transparency</span>
        <h2 id="source-heading">Check local pump prices</h2>
        <p>Weekly adjustments are not posted station prices. For local retail rates, check DOE regional reports and confirm the displayed price at your fuel station.</p></div></div>
      <div className={styles.regionLinks}>{regionLinks.map((item) =>
        <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label} ↗</a>)}</div>
    </section>

    <section id="history" className={styles.section} aria-labelledby="history-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Previous verified notices</span>
        <h2 id="history-heading">Fuel price adjustment history</h2>
        <p>Compare available reporting weeks without assuming that a missing week means prices stayed flat.</p></div></div>
      <div className={styles.tableBox}><div className={styles.tableScroll}><table className={styles.dataTable}>
        <caption className={styles.srOnly}>Dated DOE price adjustments in Philippine pesos per liter</caption>
        <thead><tr><th scope="col">Week</th>{FUEL_TYPES.map((type) => <th scope="col" key={type}>{fuelNames[type]}</th>)}<th scope="col">Source</th></tr></thead>
        <tbody>{feed.weeks.map((week) => <tr key={week.weekStart}>
          <th scope="row">{weekLabel(week.weekStart, week.weekEnd)}</th>
          {FUEL_TYPES.map((type) => <td key={type}><span className={`${styles.number} ${fuelDirection(week.summary[type]) === "down" ? styles.decrease : fuelDirection(week.summary[type]) === "up" ? styles.increase : styles.unchanged}`}>{fuelRange(week.summary[type])}</span></td>)}
          <td><a href={week.sourceUrl} target="_blank" rel="noopener noreferrer">DOE PDF ↗</a></td>
        </tr>)}</tbody>
      </table></div></div>
    </section>

    <section className={styles.section} aria-labelledby="methods-heading">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Behind the numbers</span>
        <h2 id="methods-heading">How MotoIndex tracks fuel changes</h2>
        <p>We show the source and reporting limitations rather than guessing prices.</p></div></div>
      <div className={styles.methodGrid}>
        <article><span>01</span><h3>Monitor DOE notices</h3><p>Check official Department of Energy publications for weekly notified fuel adjustments.</p></article>
        <article><span>02</span><h3>Check company figures</h3><p>Verify the fuel type, per-liter amount, dates and linked PDF before publication.</p></article>
        <article><span>03</span><h3>Show the report date</h3><p>Keep dates and source links visible. Older or unavailable reports are not presented as new prices.</p></article>
      </div>
      <p className={styles.methodNote}>This independent page uses public DOE data and is not operated by the Department of Energy. <a href={DOE_FUEL_SOURCE} target="_blank" rel="noopener noreferrer">DOE Prior Notice on Price Adjustments ↗</a></p>
    </section>

    <section className={styles.faqSection} aria-labelledby="faq-heading">
      <div className={styles.faqIntro}><span className={styles.eyebrow}>Frequently asked questions</span>
        <h2 id="faq-heading">Good questions.<br/>Clear answers.</h2>
        <p>Understand the figures before using them to plan your commute.</p></div>
      <div className={styles.faqList}>{faqs.map((faq, index) =>
        <details key={faq.question} className={styles.faqItem} open={index === 0 ? true : undefined}>
          <summary>{faq.question}<span aria-hidden="true"/></summary><p>{faq.answer}</p>
        </details>)}</div>
    </section>
    <JsonLd data={sourceSchema}/>
  </section>;
}

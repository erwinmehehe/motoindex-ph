import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { DOE_FUEL_SOURCE, FUEL_TYPES, fuelAmount, fuelDirection, fuelRange, getFuelFeed, type FuelMovement, type FuelType } from "@/lib/fuelPriceFeed";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Gas Price Philippines: Weekly DOE Fuel Updates | MotoIndex",
  description: "Track DOE weekly gasoline, diesel and kerosene price adjustments in the Philippines, with oil-company comparisons and links to official reports.",
  path: "/gas-price-philippines",
  index: true
});

const labels: Record<FuelType, string> = { gasoline: "Gasoline", diesel: "Diesel", kerosene: "Kerosene" };
const regionalPrices = [
  { label: "Metro Manila / NCR", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/ncr-pump-prices" },
  { label: "North Luzon", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/north-luzon-pump-prices" },
  { label: "South Luzon", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/south-luzon-pump-prices" },
  { label: "Visayas", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/visayas-pump-prices" },
  { label: "Mindanao", url: "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/mindanao-pump-prices" }
];

function shortDate(value: string): string {
  return new Date(value + "T00:00:00Z").toLocaleDateString("en-PH", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Manila"
  });
}

function periodLabel(start: string, end: string): string {
  return shortDate(start) + " – " + shortDate(end);
}

function movementNote(movement: FuelMovement): string {
  if (!movement) return "No company figure reported";
  if (movement.min !== movement.max) return "Range across " + movement.reportingCompanies + " reporting companies";
  return movement.reportingCompanies + " reporting " + (movement.reportingCompanies === 1 ? "company" : "companies");
}

function movementKind(movement: FuelMovement): string {
  const direction = fuelDirection(movement);
  return direction === "up" ? "Price increase" : direction === "down" ? "Price decrease" :
    direction === "mixed" ? "Mixed price movements" : direction === "flat" ? "No price change" : "Not reported";
}

export default async function GasPricePhilippinesPage() {
  const { feed, usingFallback } = await getFuelFeed();
  const latest = feed.weeks[0];
  const older = Date.now() - Date.parse(latest.weekEnd + "T15:59:59Z") > 14 * 86400000;
  const checkedAt = new Date(feed.updatedAt).toLocaleString("en-PH", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila"
  });
  const sourceSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Philippines DOE weekly retail fuel price adjustments",
    description: "DOE prior notices of per-liter gasoline, diesel and kerosene price changes by reporting oil company. Not actual station pump prices.",
    url: SITE_URL + "/gas-price-philippines",
    dateModified: feed.updatedAt,
    isBasedOn: DOE_FUEL_SOURCE,
    creator: { "@type": "GovernmentOrganization", name: "Philippines Department of Energy" },
    publisher: { "@type": "Organization", name: "MotoIndex PH", url: SITE_URL },
    variableMeasured: ["Gasoline price change in PHP per liter", "Diesel price change in PHP per liter", "Kerosene price change in PHP per liter"]
  };

  return <section className={"page shell " + styles.page} data-fuel-price-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Gas price Philippines" }]} />
    <div className={styles.hero}>
      <div>
        <span className={styles.eyebrow}>DOE fuel watch · Updated from official notices</span>
        <h1>Gas price updates in the Philippines</h1>
        <p className={styles.lede}>See the latest weekly gasoline, diesel and kerosene <strong>price changes per liter</strong>, including differences between oil companies.</p>
        <div className={styles.heroActions}>
          <a className="button" href={latest.sourceUrl} target="_blank" rel="noopener noreferrer">View latest DOE notice ↗</a>
          <a className="button secondary" href="#company-prices">Compare oil companies ↓</a>
        </div>
      </div>
      <aside className={styles.weekCard} aria-label="Current Department of Energy report">
        <span className={styles.weekCaption}>Latest verified report</span>
        <strong>{periodLabel(latest.weekStart, latest.weekEnd)}</strong>
        <span>Prices shown below are changes in ₱/liter, <strong>not the total pump price</strong>.</span>
        <small>Feed updated {checkedAt} (Philippine time)</small>
      </aside>
    </div>

    {(usingFallback || older) && <div className={styles.warning} role="status">
      <strong>{usingFallback ? "Live feed temporarily unavailable." : "This report may be out of date."}</strong>
      <span>{usingFallback ? "Showing the last source-checked figures bundled with MotoIndex, not claiming new prices." :
        "Check the DOE page for newer weekly notices before relying on these figures."}</span>
      <a href={DOE_FUEL_SOURCE} target="_blank" rel="noopener noreferrer">Check the DOE →</a>
    </div>}

    <section className={styles.section} aria-labelledby="weekly-fuel-changes">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>Latest weekly movement</span>
          <h2 id="weekly-fuel-changes">Fuel price adjustments this week</h2>
          <p>Effective week: {periodLabel(latest.weekStart, latest.weekEnd)}. Negative figures mean a decrease; positive figures mean an increase.</p>
        </div>
        <span className={styles.unit}>PHP / liter</span>
      </div>
      <div className={styles.cards}>
        {FUEL_TYPES.map((type) => {
          const movement = latest.summary[type];
          const direction = fuelDirection(movement);
          return <article key={type} className={styles.fuelCard}>
            <div className={styles.cardTop}>
              <span>{labels[type]}</span>
              <span className={styles[direction]}>{movementKind(movement)}</span>
            </div>
            <strong className={styles.value + " " + styles[direction]}>{fuelRange(movement)}</strong>
            <small>{movementNote(movement)}</small>
          </article>;
        })}
      </div>
      <p className={styles.disclaimer}><strong>Important:</strong> The DOE publishes notified adjustments by company, not one nationwide pump price. Stations, grades and locations can have different actual selling prices. Blank kerosene entries are unreported, not zero.</p>
    </section>

    <section id="company-prices" className={styles.section} aria-labelledby="company-heading">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>Company breakdown</span>
          <h2 id="company-heading">Fuel price changes by oil company</h2>
          <p>Based on the oil companies included in the official DOE notice for the stated week.</p>
        </div>
        <a className={styles.inlineLink} href={latest.sourceUrl} target="_blank" rel="noopener noreferrer">Official PDF ↗</a>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>DOE reported price adjustments in Philippine pesos per liter by company</caption>
          <thead><tr><th scope="col">Oil company</th>{FUEL_TYPES.map((type) => <th key={type} scope="col">{labels[type]} <span>(₱/L)</span></th>)}</tr></thead>
          <tbody>{latest.companies.map((company) => <tr key={company.company}>
            <th scope="row">{company.company}</th>
            {FUEL_TYPES.map((type) => {
              const value = company[type];
              return <td key={type}><span className={styles.cellNumber + " " + styles[fuelDirection(value)]}>{value === null ? "—" : fuelAmount(value)}</span></td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>
      <p className={styles.tableFootnote}>— means no figure reported for that fuel in the DOE notice. It does not mean the pump price stayed unchanged.</p>
    </section>

    <section className={styles.section} aria-labelledby="price-history">
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>Previous reports</span>
          <h2 id="price-history">Weekly fuel price adjustment history</h2>
          <p>Compare DOE-notified movements across available weeks. A range means companies reported different changes.</p>
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead><tr><th scope="col">Week</th>{FUEL_TYPES.map((type) => <th key={type} scope="col">{labels[type]}</th>)}<th scope="col">Source</th></tr></thead>
          <tbody>{feed.weeks.map((week) => <tr key={week.weekStart}>
            <th scope="row">{periodLabel(week.weekStart, week.weekEnd)}</th>
            {FUEL_TYPES.map((type) => <td key={type}><span className={styles.cellNumber + " " + styles[fuelDirection(week.summary[type])]}>{fuelRange(week.summary[type])}</span></td>)}
            <td><a href={week.sourceUrl} target="_blank" rel="noopener noreferrer">DOE PDF ↗</a></td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className={styles.tableFootnote}>The latest available weeks are added automatically after a DOE PDF passes format and value checks.</p>
    </section>

    <section className={styles.infoGrid} aria-label="Find actual prices and estimate commute costs">
      <div className={styles.infoPanel}>
        <span className={styles.eyebrow}>Actual price at the pump</span>
        <h2>Looking for the price of one liter of gasoline?</h2>
        <p>Weekly changes cannot tell you the retail price at a particular station. Use the DOE&apos;s geographic pump-price reports, then check your station&apos;s displayed price.</p>
        <div className={styles.regionLinks}>{regionalPrices.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label} ↗</a>)}</div>
      </div>
      <div className={styles.infoPanel}>
        <span className={styles.eyebrow}>For everyday riders</span>
        <h2>How will a fuel price change affect your commute?</h2>
        <p>For example, a hypothetical ₱1.00-per-liter gasoline change would change an 8-liter weekly fuel bill by ₱8.00, assuming you buy the same volume. Check the latest DOE figures above for the actual reported weekly movement.</p>
        <p>Use your real local pump price and fuel economy to estimate a more useful monthly total.</p>
        <Link href="/commute/cost-calculator">Open motorcycle commute cost calculator →</Link>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="how-it-works">
      <span className={styles.eyebrow}>Source and methodology</span>
      <h2 id="how-it-works">How MotoIndex updates this page</h2>
      <p>MotoIndex checks the Department of Energy&apos;s price-adjustment publication page on weekdays. A scheduled importer reads the attached PDF notices, verifies the effective week and oil-company figures, and publishes new data only when the report passes validation. The public page reads that published feed independently of production website deployments.</p>
      <p>If the DOE is delayed, a PDF format changes or a fetch fails, older figures remain labeled with their source week rather than being replaced with guessed prices. This is an independent presentation of public DOE data, not a DOE-operated page.</p>
      <p>Source: <a href={DOE_FUEL_SOURCE} target="_blank" rel="noopener noreferrer">DOE Prior Notice on Price Adjustments ↗</a>. Published values are price movements, not a guarantee of retail prices at any station.</p>
    </section>
    <JsonLd data={sourceSchema} />
  </section>;

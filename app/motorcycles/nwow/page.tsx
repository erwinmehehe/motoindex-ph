import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";

const checkedAt = "2026-10-04";
const marketModels = [
  { model: "ARS", price: 34000, source: "https://www.zigwheels.ph/new-motorcycles/nwow/electric" },
  { model: "ERV", price: 36000, source: "https://www.zigwheels.ph/new-motorcycles/nwow/electric" },
  { model: "TK10", price: 38800, source: "https://www.zigwheels.ph/new-motorcycles/nwow/tk10/price" },
  { model: "WSP", price: 43800, source: "https://www.zigwheels.ph/new-motorcycles/nwow/wsp/price" },
  { model: "V11", price: 70000, source: "https://www.zigwheels.ph/new-motorcycles/nwow/electric" }
] as const;

export const metadata: Metadata = pageMetadata({
  title: "NWOW E-Bike Price Philippines 2026 | WSP, TK10, ARS",
  description: "NWOW e-bike Philippines market price guide for WSP, TK10, ARS, ERV and V11, with source dates and a clear warning to verify LTO classification before buying.",
  path: "/motorcycles/nwow"
});

export default function NwowPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NWOW e-bike market price references Philippines",
    numberOfItems: marketModels.length,
    itemListElement: marketModels.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `NWOW ${item.model}`,
      url: `${SITE_URL}/motorcycles/nwow#market-prices`
    }))
  };

  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "NWOW" }]} />
    <PageHero
      kicker="Demand-backed market research"
      title="NWOW e-bike prices in the Philippines"
      description="Compare current Philippine market-reference prices for searched NWOW models such as WSP, TK10 and ARS. MotoIndex has not located a sufficiently complete first-party Philippine model catalog, so these are source-labeled market references rather than manufacturer-verified SRPs."
      actions={<CTAGroup><a className="button" href="#market-prices">See NWOW prices</a><Link className="button secondary" href="/motorcycles/electric">Verified electric motorcycles</Link></CTAGroup>}
    />

    <StatRow items={[
      { label: "Market-reference models", value: marketModels.length, note: `Checked ${checkedAt}` },
      { label: "Lowest listed reference", value: php(Math.min(...marketModels.map(m=>m.price))), note: "Comparison-site market reference" },
      { label: "NWOW WSP", value: php(43800), note: "Current market reference" },
      { label: "NWOW TK10", value: php(38800), note: "Current market reference" }
    ]} />

    <section className="section" id="market-prices">
      <SectionHeader kicker="Price list" title="NWOW WSP, TK10, ARS, ERV and V11 price references" description="These figures come from current Philippine comparison listings. Treat them as research starting points, then verify the exact seller, model code, battery specification, warranty and final cash price." />
      <DataTable label="NWOW e-bike Philippines market price references">
        <div className="head" role="row" style={{gridTemplateColumns:"1.5fr 1fr 1.5fr"}}><span>Model</span><span>Reference price</span><span>Evidence</span></div>
        {marketModels.map(item => <div role="row" style={{gridTemplateColumns:"1.5fr 1fr 1.5fr"}} key={item.model}>
          <span role="cell"><strong>NWOW {item.model}</strong></span>
          <span role="cell">{php(item.price)}</span>
          <span role="cell"><a href={item.source} target="_blank" rel="nofollow noopener noreferrer">Current Philippine listing ↗</a></span>
        </div>)}
      </DataTable>
    </section>

    <section className="section">
      <SectionHeader kicker="Important verification" title="Do not assume every NWOW model has the same LTO status" description="Seller labels such as e-bike, electric scooter and electric motorcycle are not enough to determine registration and licensing requirements." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>Check the exact classification</h3><p>Ask for the exact model code and written LTO classification for the unit you intend to buy. Registration requirements depend on the vehicle category, not the marketing label.</p></InfoPanel>
        <InfoPanel subtle><h3>Check the battery specification</h3><p>Confirm battery chemistry, voltage, capacity, charger, replacement price, warranty and whether the published range refers to the exact battery supplied with the unit.</p></InfoPanel>
        <InfoPanel subtle><h3>Check after-sales support</h3><p>Before paying, verify the actual service location, replacement battery availability, controller/motor parts and written warranty terms.</p></InfoPanel>
      </div>
      <CTAGroup>
        <Link className="button secondary" href="/guides/electric-motorcycle-registration-philippines">Electric registration guide</Link>
        <Link className="button secondary" href="/tools/electric-motorcycle-charging-cost">Charging cost calculator</Link>
        <Link className="button secondary" href="/tools/electric-motorcycle-range-calculator">Range calculator</Link>
      </CTAGroup>
    </section>

    <FaqSection title="NWOW e-bike Philippines FAQ" items={[
      { question: "How much is an NWOW WSP in the Philippines?", answer: "The current Philippine comparison-site reference checked by MotoIndex lists NWOW WSP at ₱43,800. Confirm the actual seller price, battery and warranty before buying." },
      { question: "How much is an NWOW TK10?", answer: "The current market reference checked by MotoIndex lists NWOW TK10 at ₱38,800." },
      { question: "How much is an NWOW ARS?", answer: "The current market reference checked by MotoIndex lists NWOW ARS at ₱34,000." },
      { question: "Does an NWOW e-bike need registration?", answer: "Do not decide this from the word e-bike alone. Ask for the exact model's LTO classification and current registration requirements before purchase." }
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

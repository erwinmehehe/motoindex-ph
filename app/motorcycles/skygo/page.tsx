import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";

const checkedAt = "2026-10-04";
const shopUrl = "https://www.skygo.com.ph/index.php/shop/";

const catalog = [
  ["Blink", 62000], ["Bolt 150", 115000], ["Boss 150", 55000], ["Duke", 47000],
  ["Earl", 55000], ["Hero", 50000], ["King", 48000], ["KPV", 109800],
  ["Lance 150", 97000], ["Prince 125", 43000], ["Stallion", 70000],
  ["Wizard", 45500], ["Wizard 175", 50000]
] as const;

const highlighted = [
  { model: "Prince 125", price: 43000, engine: "125cc", weight: "105 kg dry", tank: "10 L", source: "https://www.skygo.com.ph/index.php/product/prince-125/" },
  { model: "Earl", price: 55000, engine: "150cc", weight: "106 kg dry", tank: "14 L", source: "https://www.skygo.com.ph/index.php/product/earl/" },
  { model: "Boss 150", price: 55000, engine: "150cc", weight: "129 kg dry", tank: "10.5 L", source: "https://www.skygo.com.ph/index.php/product/boss-150/" },
  { model: "Lance 150", price: 97000, engine: "Water-cooled EFI", weight: "125 kg net", tank: "7 L", source: "https://www.skygo.com.ph/index.php/product/lance-150/" },
  { model: "KPV", price: 109800, engine: "Water-cooled EFI", weight: "143 kg net", tank: "11 L", source: "https://www.skygo.com.ph/index.php/product/kpv/" }
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Skygo Motorcycle Philippines 2026 | Price List & Models",
  description: "Skygo motorcycle Philippines price list with 13 current official-site models, including Earl, Boss 150, Prince 125, KPV, Lance 150 and Bolt 150.",
  path: "/motorcycles/skygo"
});

export default function SkygoMotorcyclesPage() {
  const low = Math.min(...catalog.map(([, price]) => price));
  const high = Math.max(...catalog.map(([, price]) => price));
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Skygo motorcycle price list Philippines",
    numberOfItems: catalog.length,
    itemListElement: catalog.map(([model, price], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Skygo ${model}`,
      url: `${SITE_URL}/motorcycles/skygo#price-list`,
      item: { "@type": "Product", name: `Skygo ${model}`, offers: { "@type": "Offer", priceCurrency: "PHP", price } }
    }))
  };

  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Skygo" }]} />
    <PageHero
      kicker="Official-site price research"
      title="Skygo motorcycle price list Philippines"
      description="Compare the 13 motorcycles currently listed in Skygo Marketing Corporation's official online catalog, with current posted prices and focused specification checks for the most searched models."
      actions={<CTAGroup><a className="button" href="#price-list">View Skygo prices</a><Link className="button secondary" href="/motorcycles">Compare all motorcycles</Link></CTAGroup>}
    />

    <StatRow items={[
      { label: "Official-site models", value: catalog.length, note: `Checked ${checkedAt}` },
      { label: "Lowest posted price", value: php(low), note: "Official catalog" },
      { label: "Highest posted price", value: php(high), note: "Official catalog" },
      { label: "Popular searches", value: "Earl · Boss · 125/150", note: "Mapped to this canonical brand page" }
    ]} />

    <section className="section" id="price-list">
      <SectionHeader kicker="Current catalog" title="Skygo motorcycle prices in the Philippines" description="Prices below are the amounts displayed by Skygo's official shop when checked. Branch stock, promos, registration and financing can change the final amount." />
      <DataTable label="Skygo motorcycle Philippines price list">
        <div className="head" role="row" style={{gridTemplateColumns:"1.6fr 1fr 1.4fr"}}><span>Model</span><span>Posted price</span><span>Source</span></div>
        {catalog.map(([model, price]) => <div role="row" style={{gridTemplateColumns:"1.6fr 1fr 1.4fr"}} key={model}>
          <span role="cell"><strong>Skygo {model}</strong></span>
          <span role="cell">{php(price)}</span>
          <span role="cell"><a href={shopUrl} target="_blank" rel="nofollow noopener noreferrer">Skygo official shop ↗</a></span>
        </div>)}
      </DataTable>
    </section>

    <section className="section">
      <SectionHeader kicker="High-search models" title="Skygo Earl, Boss 150, Prince 125, Lance 150 and KPV" description="These specification snapshots stay tied to Skygo's own product pages instead of copying unverified marketplace listings." />
      <div className="ui-content-grid">
        {highlighted.map(item => <InfoPanel subtle key={item.model}>
          <h3>Skygo {item.model}</h3>
          <p><strong>{php(item.price)}</strong> · {item.engine} · {item.weight} · {item.tank} tank</p>
          <p><a href={item.source} target="_blank" rel="nofollow noopener noreferrer">Official Skygo specifications ↗</a></p>
        </InfoPanel>)}
      </div>
    </section>

    <section className="section">
      <SectionHeader kicker="Search intent" title="One Skygo page instead of thin model-keyword clones" description="Broad searches such as Skygo motorcycle, Skygo 150, Skygo 125, Skygo Earl and Skygo Boss can start here, while future model pages should only be split out when the evidence supports a complete standalone entity." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>Skygo Earl 150</h3><p>Skygo lists Earl at 150cc, ₱55,000, 106 kg dry, 780 mm seat height and a 14 L tank.</p></InfoPanel>
        <InfoPanel subtle><h3>Skygo Boss 150</h3><p>Skygo lists Boss 150 at ₱55,000 with 129 kg dry weight, 780 mm seat height and a 10.5 L tank.</p></InfoPanel>
        <InfoPanel subtle><h3>Skygo 125</h3><p>Prince 125 is the clearest official 125cc record in the current catalog, listed at ₱43,000 with 105 kg dry weight.</p></InfoPanel>
      </div>
    </section>

    <FaqSection title="Skygo motorcycle Philippines FAQ" items={[
      { question: "How much is a Skygo motorcycle in the Philippines?", answer: `Skygo's official shop currently lists motorcycles from ${php(low)} to ${php(high)}. The exact branch price, registration, fees, promos and financing can change the final amount.` },
      { question: "How much is the Skygo Earl 150?", answer: "Skygo's official Earl page currently lists an SRP of ₱55,000 and identifies the engine displacement as 150cc." },
      { question: "How much is the Skygo Boss 150?", answer: "Skygo's official Boss 150 page currently lists an SRP of ₱55,000." },
      { question: "Does Skygo offer installment plans?", answer: "Skygo model pages currently state that 12, 24 and 36 month installment terms are available. Approval, downpayment and final monthly payment depend on the actual branch and financing terms." }
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

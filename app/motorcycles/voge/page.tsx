import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";

const checkedAt = "2026-10-04";
const models = [
  ["SR150GT",115000,"Scooter"],
  ["300 AC",170000,"Classic"],
  ["300 ACX",180000,"Classic"],
  ["300 ACT",180000,"Classic"],
  ["300 DS",200000,"Adventure"],
  ["300 Rally",210000,"Adventure"],
  ["525R",330000,"Naked"],
  ["CU525",330000,"Cruiser"],
  ["650 DS",340000,"Adventure"],
  ["525RR",350000,"Sport"],
  ["525ACX",360000,"Classic"],
  ["525 DSX",380000,"Adventure"],
  ["DS900X",630000,"Adventure"]
] as const;

export const metadata: Metadata = pageMetadata({
  title: "VOGE Motorcycle Philippines 2026 | Price List & Models",
  description: "VOGE motorcycle Philippines price list with current official prices for SR150GT, 300 AC, 525R, CU525, 525RR, DS900X and more.",
  path: "/motorcycles/voge"
});

export default function VogePage() {
  const priced=models.map(([,price])=>price);
  const schema={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:"VOGE motorcycle price list Philippines",
    numberOfItems:models.length,
    itemListElement:models.map(([model,price],index)=>({
      "@type":"ListItem",position:index+1,name:`VOGE ${model}`,url:`${SITE_URL}/motorcycles/voge#price-list`,
      item:{"@type":"Product",name:`VOGE ${model}`,offers:{"@type":"Offer",priceCurrency:"PHP",price}}
    }))
  };
  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"VOGE"}]} />
    <PageHero
      kicker="Official Philippine catalog"
      title="VOGE motorcycle price list Philippines"
      description="VOGE officially launched in the Philippines in September 2025. Compare the priced models currently published by VOGE Philippines, from the SR150GT and 300-series motorcycles to the 525 range and DS900X."
      actions={<CTAGroup><a className="button" href="#price-list">View VOGE prices</a><Link className="button secondary" href="/motorcycles">Compare all motorcycles</Link></CTAGroup>}
    />
    <StatRow items={[
      {label:"Priced official models",value:models.length,note:`Checked ${checkedAt}`},
      {label:"Lowest posted price",value:php(Math.min(...priced)),note:"VOGE Philippines"},
      {label:"Highest posted price",value:php(Math.max(...priced)),note:"VOGE Philippines"},
      {label:"Local launch",value:"Sep 2025",note:"VOGE Philippines"}
    ]} />
    <section className="section" id="price-list">
      <SectionHeader kicker="Current official catalog" title="VOGE motorcycle prices in the Philippines" description="These are the prices currently displayed by VOGE Philippines for models with published prices. Models shown by VOGE without a price are not assigned an invented price here." />
      <DataTable label="VOGE motorcycle Philippines price list">
        <div className="head" role="row" style={{gridTemplateColumns:"1.5fr 1fr 1fr"}}><span>Model</span><span>Category</span><span>Price</span></div>
        {models.map(([model,price,category])=><div role="row" style={{gridTemplateColumns:"1.5fr 1fr 1fr"}} key={model}><span role="cell"><strong>VOGE {model}</strong></span><span role="cell">{category}</span><span role="cell">{php(price)}</span></div>)}
      </DataTable>
      <CTAGroup><a className="button secondary" href="https://www.vogephilippines.com/all-products" target="_blank" rel="nofollow noopener noreferrer">VOGE Philippines catalog ↗</a><a className="button secondary" href="https://www.vogephilippines.com/dealer" target="_blank" rel="nofollow noopener noreferrer">Find a VOGE dealer ↗</a></CTAGroup>
    </section>
    <section className="section">
      <SectionHeader kicker="Popular current models" title="What stands out in the VOGE Philippines range" description="Use these as shortlisting clues, then verify the complete specification on VOGE's official model page." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>VOGE 300 AC</h3><p>₱170,000 · 29 hp · 25 Nm · official 31 km/L estimate. A lower-priced classic-style entry into the current VOGE range.</p></InfoPanel>
        <InfoPanel subtle><h3>VOGE 525RR</h3><p>₱350,000 · 494cc twin · 55 hp · 50.5 Nm · 790 mm seat · ABS and traction control.</p></InfoPanel>
        <InfoPanel subtle><h3>VOGE CU525</h3><p>₱330,000 · 494cc twin · 53.1 hp · 50.5 Nm · low 710 mm seat · ABS and traction control.</p></InfoPanel>
        <InfoPanel subtle><h3>VOGE DS900X</h3><p>₱630,000 · 985cc twin · 93.8 hp · 95 Nm · 825 mm seat · 21-inch front wheel and adventure equipment.</p></InfoPanel>
      </div>
    </section>
    <FaqSection title="VOGE Philippines FAQ" items={[
      {question:"Is VOGE available in the Philippines?",answer:"Yes. VOGE Philippines states that the brand launched locally in September 2025 and currently publishes Philippine models and dealer locations."},
      {question:"How much is a VOGE motorcycle in the Philippines?",answer:`Among models with a price currently published by VOGE Philippines, this page records a range from ${php(Math.min(...priced))} to ${php(Math.max(...priced))}. Final dealer and on-road pricing can differ.`},
      {question:"How much is the VOGE DS900X?",answer:"VOGE Philippines currently lists the DS900X at ₱630,000."},
      {question:"Where can I buy a VOGE motorcycle?",answer:"Use the current VOGE Philippines dealer locator. Its published network currently includes locations in Caloocan, Tarlac and Imus, with the official locator as the source of truth for changes."}
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

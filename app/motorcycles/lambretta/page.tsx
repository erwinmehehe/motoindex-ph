import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";

const checkedAt = "2026-10-04";
const philippineModels = [
  ["V-Special 50","V-Special"],
  ["V-Special 125","V-Special"],
  ["V-Special 200","V-Special"],
  ["X125","X"],
  ["X300","X"],
  ["G350","G"]
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Lambretta Philippines 2026 | Models & Price Checks",
  description: "Lambretta Philippines 2026 model guide for V-Special, X125, X300 and G350 scooters, with Philippine availability and price-check context.",
  path: "/motorcycles/lambretta"
});

export default function LambrettaPage() {
  const schema={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:"Lambretta scooters in the Philippines",
    numberOfItems:philippineModels.length,
    itemListElement:philippineModels.map(([model],index)=>({
      "@type":"ListItem",position:index+1,name:`Lambretta ${model}`,url:`${SITE_URL}/motorcycles/lambretta#models`
    }))
  };
  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Lambretta"}]} />
    <PageHero
      kicker="Philippine scooter research"
      title="Lambretta scooters in the Philippines"
      description="Track the Lambretta models currently surfaced for the Philippine market while keeping global product families, local availability and dealer pricing separate. Many current Philippine Lambretta listings still require a dealer quote."
      actions={<CTAGroup><a className="button" href="#models">View Lambretta models</a><Link className="button secondary" href="/motorcycles/scooters">Compare scooters</Link></CTAGroup>}
    />
    <StatRow items={[
      {label:"PH-market models tracked",value:philippineModels.length,note:`Checked ${checkedAt}`},
      {label:"Current families",value:"V · X · G",note:"Lambretta global range"},
      {label:"PH price status",value:"Quote required",note:"For much of the current lineup"},
      {label:"Latest local launch check",value:"X300 Casa",note:"₱409,900 launch reference"}
    ]} />

    <section className="section" id="models">
      <SectionHeader kicker="Current market lineup" title="Lambretta models currently listed for the Philippines" description="The Philippine comparison-market lineup currently surfaces six scooters. Lambretta's global site separately confirms the current V-Special, X and G product families." />
      <DataTable label="Lambretta Philippines current model lineup">
        <div className="head" role="row" style={{gridTemplateColumns:"1.5fr 1fr 1.4fr"}}><span>Model</span><span>Family</span><span>Price status</span></div>
        {philippineModels.map(([model,family])=><div role="row" style={{gridTemplateColumns:"1.5fr 1fr 1.4fr"}} key={model}><span role="cell"><strong>Lambretta {model}</strong></span><span role="cell">{family}</span><span role="cell">Confirm current dealer quote</span></div>)}
      </DataTable>
    </section>

    <section className="section">
      <SectionHeader kicker="Price evidence" title="Why MotoIndex is not inventing a complete Lambretta price list" description="Current Philippine comparison listings show much of the lineup as price on request, while dealer and limited-edition prices can differ by exact model and stock." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>X300 Casa Lambretta</h3><p>A November 2025 Philippine launch report priced the limited-edition X300 Casa Lambretta from ₱409,900, with only 36 units allocated to the Philippines. Treat that as a specific launch reference, not the price of every X300.</p></InfoPanel>
        <InfoPanel subtle><h3>Current dealer quote still matters</h3><p>Model year, special edition, dealer stock and financing can materially change the transaction price. MotoIndex will only split dedicated model price pages once the current Philippine evidence is strong enough.</p></InfoPanel>
        <InfoPanel subtle><h3>Official product families</h3><p>Lambretta's current global scooter catalog organizes the range around V-Special, X and G families, which is why this page keeps those family names intact.</p></InfoPanel>
      </div>
      <CTAGroup>
        <a className="button secondary" href="https://www.lambretta.com/scooters/" target="_blank" rel="nofollow noopener noreferrer">Lambretta official range ↗</a>
      </CTAGroup>
    </section>

    <FaqSection title="Lambretta Philippines FAQ" items={[
      {question:"Is Lambretta available in the Philippines?",answer:"Current Philippine market listings surface V-Special, X and G-series Lambretta scooters. Confirm the exact model and dealer stock before planning a purchase."},
      {question:"How much is a Lambretta in the Philippines?",answer:"Many current Philippine Lambretta listings require a dealer quote. A November 2025 Philippine launch reference priced the limited-edition X300 Casa Lambretta from ₱409,900, but that should not be treated as the price of every X300 or every Lambretta."},
      {question:"What Lambretta models are listed in the Philippines?",answer:"The current market lineup tracked here includes V-Special 50, V-Special 125, V-Special 200, X125, X300 and G350."},
      {question:"Is Lambretta the same as Vespa?",answer:"No. Lambretta and Vespa are separate scooter brands with different model families, specifications and dealer networks."}
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

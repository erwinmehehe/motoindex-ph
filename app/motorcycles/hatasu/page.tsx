import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";

const checkedAt="2026-10-04";
const retailerModels=[
  ["Kumi 2023",23036,28469],
  ["Nero Lite",26775,32031],
  ["Vivi",37286,44654],
  ["Aya",42643,49755],
  ["Haru",42643,52040],
  ["Hero 2",82117,93999],
  ["Buggy",105857,121362]
] as const;

export const metadata: Metadata = pageMetadata({
  title:"Hatasu E-Bike Philippines 2026 | Prices & Models",
  description:"Hatasu e-bike Philippines price guide with current retailer ranges for Kumi, Nero Lite, Vivi, Aya, Haru, Hero 2 and Buggy, plus buying checks.",
  path:"/motorcycles/hatasu"
});

export default function HatasuPage(){
  const lows=retailerModels.map(([,low])=>low), highs=retailerModels.map(([, ,high])=>high);
  const schema={
    "@context":"https://schema.org","@type":"ItemList",name:"Hatasu e-bike Philippines retailer price references",numberOfItems:retailerModels.length,
    itemListElement:retailerModels.map(([model],index)=>({"@type":"ListItem",position:index+1,name:`Hatasu ${model}`,url:`${SITE_URL}/motorcycles/hatasu#prices`}))
  };
  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Hatasu"}]} />
    <PageHero
      kicker="Philippine retailer research"
      title="Hatasu e-bike prices in the Philippines"
      description="Compare current Hatasu retailer price ranges without mixing older NERO/KUMI comparison listings with newer Nero Lite, Kumi 2023 and other retailer inventory. Verify the exact model code, battery and legal classification before buying."
      actions={<CTAGroup><a className="button" href="#prices">View Hatasu prices</a><Link className="button secondary" href="/motorcycles/electric">Verified electric motorcycles</Link></CTAGroup>}
    />
    <StatRow items={[
      {label:"Retailer models tracked",value:retailerModels.length,note:`Checked ${checkedAt}`},
      {label:"Lowest retailer range",value:php(Math.min(...lows)),note:"Current EMCOR listing"},
      {label:"Highest retailer range",value:php(Math.max(...highs)),note:"Current EMCOR listing"},
      {label:"Key search models",value:"Kumi · Nero",note:"Verify exact version"}
    ]} />

    <section className="section" id="prices">
      <SectionHeader kicker="Current retailer references" title="Hatasu e-bike price ranges" description="These are current retailer-listed ranges, not manufacturer SRPs. Location, stock, model version and financing can change the final amount." />
      <DataTable label="Hatasu e-bike Philippines retailer price ranges">
        <div className="head" role="row" style={{gridTemplateColumns:"1.5fr 1.5fr"}}><span>Model</span><span>Retailer price range</span></div>
        {retailerModels.map(([model,low,high])=><div role="row" style={{gridTemplateColumns:"1.5fr 1.5fr"}} key={model}><span role="cell"><strong>Hatasu {model}</strong></span><span role="cell">{php(low)}–{php(high)}</span></div>)}
      </DataTable>
      <CTAGroup><a className="button secondary" href="https://emcor.com.ph/brand/hatasu/" target="_blank" rel="nofollow noopener noreferrer">Current Hatasu retailer listings ↗</a></CTAGroup>
    </section>

    <section className="section">
      <SectionHeader kicker="Version check" title="NERO, Nero Lite, KUMI and Kumi 2023 should not be treated as identical listings" description="Search results can mix older model names and current retailer inventory. Confirm the unit label and battery specification on the actual bike before comparing price." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>Older comparison references</h3><p>Current comparison-market pages still surface Hatasu NERO around ₱24,990 and KUMI around ₱19,990. Those figures can refer to different versions than current retailer listings, so MotoIndex does not merge them into one fake SRP.</p></InfoPanel>
        <InfoPanel subtle><h3>Battery and range</h3><p>Ask for battery chemistry, voltage, amp-hours, charger, warranty, replacement cost and the exact test basis behind any claimed range.</p></InfoPanel>
        <InfoPanel subtle><h3>LTO classification</h3><p>Do not infer registration or licensing requirements from the words e-bike or e-moto. Verify the exact unit's current classification and documents before purchase.</p></InfoPanel>
      </div>
      <CTAGroup><Link className="button secondary" href="/guides/electric-motorcycle-registration-philippines">Electric registration guide</Link><Link className="button secondary" href="/tools/electric-motorcycle-charging-cost">Charging cost calculator</Link></CTAGroup>
    </section>

    <FaqSection title="Hatasu e-bike Philippines FAQ" items={[
      {question:"How much is a Hatasu e-bike in the Philippines?",answer:`Current retailer ranges tracked by MotoIndex run from about ${php(Math.min(...lows))} to ${php(Math.max(...highs))}, depending on model, location and stock. Older NERO and KUMI comparison references may show lower figures for different versions.`},
      {question:"How much is a Hatasu Kumi?",answer:"A current retailer listing for Kumi 2023 shows roughly ₱23,036–₱28,469. Older comparison-market references for KUMI can be lower, so verify the exact version."},
      {question:"How much is a Hatasu Nero?",answer:"A current retailer listing for Nero Lite shows roughly ₱26,775–₱32,031. Older NERO comparison references can differ, so confirm the exact model code and battery."},
      {question:"Does a Hatasu e-bike need registration?",answer:"Requirements depend on the exact vehicle classification. Verify the current LTO classification and supplied documents for the specific unit before purchase."}
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

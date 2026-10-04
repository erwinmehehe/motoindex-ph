import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, absoluteUrl } from "@/lib/site";
import { motorcycles, getModelById, isIndexableModel } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { php } from "@/lib/utils";
import { UsedValueExplorer } from "@/components/UsedValueExplorer";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const dynamic="force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Used Motorcycles Philippines 2026 | Buying & Used Value",
  description: "Research used motorcycles in the Philippines with verified listings when available, repo prices, buying checks, historical models and used-value planning.",
  path: "/used-motorcycles",
  index:true
});

const historicalModels=motorcycles
  .filter(model=>isIndexableModel(model)&&(model.marketStatus==="previous"||model.marketStatus==="discontinued"))
  .sort((a,b)=>b.searchVolume-a.searchVolume||a.make.localeCompare(b.make)||a.model.localeCompare(b.model));

const withSuccessor=historicalModels.filter(model=>Boolean(model.successorId&&getModelById(model.successorId)));

const faqs=[
  {question:"Where can I research used motorcycles in the Philippines?",answer:"Use this hub for verified used-listing references when available, repo price observations, buying-document checks, historical model research and model-specific depreciation planning. MotoIndex does not present demo listings as live market evidence."},
  {question:"How do I know if a second-hand motorcycle price is fair?",answer:"Compare the exact model year, variant, mileage, condition, service history, modifications and documents. Historical SRP and depreciation estimates are reference points, not appraisals or guaranteed market values."},
  {question:"What papers should I check before buying a used motorcycle?",answer:"Current LTO motorcycle transfer materials require formal transaction documents and PNP-HPG clearance, with inspection, insurance and identification requirements depending on the transaction. Use the buying checklist and transfer guide before paying in full."},
  {question:"Should I buy a discontinued motorcycle?",answer:"A discontinued or previous-generation motorcycle can still make sense when price, condition, documents, service history and parts support are strong. Compare the current successor when one exists and do not treat historical SRP as today's used value."},
  {question:"Are repo motorcycles automatically cheaper or safer?",answer:"No. Repo asking prices can be attractive, but condition, mileage, missing accessories, repair needs, documents and seller terms still matter. Inspect the exact unit and read the seller's warranty or as-is terms."}
];

export default async function UsedMotorcyclesPage(){
  const listings=await getVerifiedUsedListings({limit:24});
  const estimates=motorcycles.filter(isIndexableModel).map(m=>({
    id:m.id,
    make:m.make,
    model:m.model,
    href:`/motorcycles/${m.makeSlug}/${m.slug}#used`,
    oneYear:estimatedUsedValue(m,1),
    threeYear:estimatedUsedValue(m,3),
    fiveYear:estimatedUsedValue(m,5)
  }));
  const featuredHistorical=historicalModels.slice(0,18);

  const schema=[
    {
      "@context":"https://schema.org",
      "@type":"CollectionPage",
      name:"Used motorcycles in the Philippines",
      description:"Used motorcycle listings, repo research, buying checks, historical models and used-value planning in the Philippines.",
      url:absoluteUrl("/used-motorcycles"),
      mainEntity:{
        "@type":"ItemList",
        numberOfItems:featuredHistorical.length,
        itemListElement:featuredHistorical.map((model,index)=>({
          "@type":"ListItem",
          position:index+1,
          name:`${model.make} ${model.model}`,
          url:absoluteUrl(`/motorcycles/${model.makeSlug}/${model.slug}`)
        }))
      }
    },
    {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      mainEntity:faqs.map(item=>({
        "@type":"Question",
        name:item.question,
        acceptedAnswer:{"@type":"Answer",text:item.answer}
      }))
    }
  ];

  return <section className="page shell used-master-page">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Used motorcycles"}]}/>
    <PageHero
      kicker="Second-hand · Repo · Previous models"
      title="Used motorcycles in the Philippines"
      description="Research second-hand motorcycles without confusing historical SRP, seller asking price and estimated used value. Check documents and condition first, then compare model history, successor pricing and ownership costs."
      actions={<CTAGroup><Link className="button" href="/used-motorcycles/buying-checklist">Used-bike checklist</Link><Link className="button secondary" href="/used-motorcycles/repo">Repo price board</Link><Link className="button secondary" href="/ownership/transfer-of-ownership">Transfer requirements</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Verified listings",value:String(listings.length),note:"Public seller references available now"},
      {label:"Historical models",value:String(historicalModels.length),note:"Previous or discontinued records"},
      {label:"With successor",value:String(withSuccessor.length),note:"Direct old-vs-current research path"},
      {label:"Listing policy",value:"Verified only",note:"Demo listings never shown as live market evidence"}
    ]}/>

    <section className={styles.section}>
      <SectionHeader kicker="Choose your path" title="Used motorcycle research tools" description="Start with the transaction type, then move into the exact model record before deciding what the motorcycle is worth."/>
      <div className="topic-grid">
        <Link href="/used-motorcycles/buying-checklist"><span className="section-kicker">Private or dealer unit</span><h3>Used motorcycle buying checklist</h3><p>Seller identity, OR/CR, deed of sale, HPG clearance, mileage, condition and payment checks before you commit.</p><b>Open checklist →</b></Link>
        <Link href="/used-motorcycles/repo"><span className="section-kicker">Repossession market</span><h3>Repo motorcycle prices</h3><p>Compare current seller-published repo price observations without treating them as inspected or guaranteed fair-value listings.</p><b>Compare repo prices →</b></Link>
        <Link href="/ownership/transfer-of-ownership"><span className="section-kicker">Paperwork</span><h3>Transfer of ownership</h3><p>Use current LTO and PNP-HPG requirements instead of relying on an old checklist or an open deed of sale.</p><b>Check requirements →</b></Link>
      </div>
    </section>

    {listings.length>0 ? <section className={styles.section} data-used-listing-section>
      <SectionHeader
        kicker="Verified market references"
        title="Recently verified used listings"
        description="Asking prices are seller references, not appraisals. Open the original source and inspect the motorcycle before paying."
      />
      <div className={styles.decisionList} data-used-listing-list>
        {listings.map(item=>{
          const model=getModelById(item.modelExternalId);
          return <article className={styles.decisionRow} key={item.id}>
            <span className={styles.decisionLabel}>{item.modelYear} · {item.condition}</span>
            <span className={styles.decisionCopy}>
              <h3>{model?<Link href={`/motorcycles/${model.makeSlug}/${model.slug}#used`}>{item.title}</Link>:item.title}</h3>
              <p>{item.location} · {item.mileageKm.toLocaleString("en-PH")} km · {item.sellerType}</p>
            </span>
            <span className={styles.decisionMeta}>
              <strong>{php(item.askingPricePhp)}</strong>
              {item.contactAvailable&&item.sourceUrl?<Link href={item.sourceUrl}>View owner listing →</Link>:item.sourceUrl?<a href={item.sourceUrl} target="_blank" rel="nofollow noreferrer">Original listing ↗</a>:<small>{item.sourceLabel}</small>}
            </span>
          </article>;
        })}
      </div>
    </section> : <InfoPanel subtle className={styles.notice}>
      <h3>No verified public used listings are available right now</h3>
      <p>MotoIndex does not publish demo private-seller ads as market evidence. Use the model estimator and historical-model research below while verified used listings are being added.</p>
    </InfoPanel>}

    <section className={styles.section}>
      <SectionHeader
        kicker="Previous and discontinued models"
        title="High-demand used-bike research pages"
        description="These records preserve historical Philippine pricing and specifications. Historical price references are not current used-bike quotations."
      />
      <div className="comparison-wrap" role="region" aria-label="Previous and discontinued motorcycle research" tabIndex={0}>
        <table className="comparison-table">
          <thead><tr><th>Model</th><th>Status</th><th>Historical price</th><th>Current successor</th></tr></thead>
          <tbody>{featuredHistorical.map(model=>{
            const successor=model.successorId?getModelById(model.successorId):undefined;
            return <tr key={model.id}>
              <th><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}>{model.make} {model.model}</Link><small style={{display:"block",marginTop:4}}>{model.generation}</small></th>
              <td>{model.marketStatus==="discontinued"?"Discontinued":"Previous generation"}</td>
              <td>{observedMarketPriceLabel(model)}<small style={{display:"block",marginTop:4}}>Historical reference only</small></td>
              <td>{successor?<Link href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>{successor.make} {successor.model} →</Link>:<span>Compare current alternatives</span>}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </section>

    <section className={styles.section} data-used-estimator-section>
      <SectionHeader
        kicker="Planning reference"
        title="Find a model-specific used-value estimate"
        description="These figures use age-and-condition depreciation assumptions. They are not live asking prices, dealer trade-in quotes or appraisals."
      />
      <UsedValueExplorer models={estimates}/>
    </section>

    <section className={styles.section}>
      <SectionHeader kicker="How value is handled" title="Historical price, asking price and used value are different" description="MotoIndex keeps each number in its proper context so an old SRP is never presented as a live market price."/>
      <div className="guide-topic-grid">
        <article><h3>Historical SRP</h3><p>Previous-model pages preserve a dated launch or Philippine market reference so you can identify the generation and original price context.</p></article>
        <article><h3>Seller asking price</h3><p>A verified listing is still an asking price, not proof of the transaction value. Condition, documents, mileage, location and urgency can move the final amount.</p></article>
        <article><h3>Estimated used value</h3><p>The calculator applies a transparent age-and-condition depreciation curve. It is useful for planning, but it does not replace inspection or live comparable listings.</p></article>
        <article><h3>Successor comparison</h3><p>A used previous-generation motorcycle only looks cheap in context. Compare the current successor's price, warranty and equipment before deciding the discount is enough.</p></article>
      </div>
    </section>

    <section className={styles.section}>
      <SectionHeader kicker="Before paying" title="Documents and condition both need verification" description="A low price cannot compensate for a motorcycle that cannot be transferred cleanly or needs major deferred maintenance."/>
      <div className="guide-topic-grid">
        <article><h3>Match the motorcycle to the OR/CR</h3><p>Check the registered owner and match the plate, engine and chassis identifiers to the actual motorcycle and transaction documents.</p></article>
        <article><h3>Plan the formal transfer</h3><p>Current LTO motorcycle ownership rules and transaction checklists require formal documents and PNP-HPG clearance. Confirm the exact process for your case before paying in full.</p></article>
        <article><h3>Inspect the unit independently</h3><p>Check cold starting, warning lights, leaks, charging, brakes, tires, steering, suspension, crash evidence and service history. Higher-value bikes justify a mechanic inspection.</p></article>
        <article><h3>Add deferred maintenance to the price</h3><p>Budget tires, battery, fluids, overdue service, insurance, registration and transfer costs. A cheaper asking price can still produce the higher total cost.</p></article>
      </div>
    </section>

    <div className="source-ladder">
      <article><span>Official motorcycle ownership rule</span><h2>LTO IRR of RA 12209</h2><p>Current motorcycle ownership reporting and transfer framework, including the documentary transfer process.</p><div><a className="text-link" href="https://lto.gov.ph/wp-content/uploads/2025/07/IRR-RA-12209.pdf" target="_blank" rel="noreferrer">Open LTO rule ↗</a><small>Checked 2026-10-04</small></div></article>
      <article><span>Transaction checklist</span><h2>LTO Citizen's Charter</h2><p>Transfer-of-ownership checklist covering HPG clearance, inspection, insurance and identification requirements.</p><div><a className="text-link" href="https://www.lto.gov.ph/wp-content/uploads/2023/09/LTO-CITIZENS-CHARTER_2023_0905.pdf" target="_blank" rel="noreferrer">Open LTO checklist ↗</a><small>Checked 2026-10-04</small></div></article>
      <article><span>Clearance requirements</span><h2>PNP-HPG motor vehicle clearance</h2><p>HPG's transfer-of-ownership clearance checklist includes deed, OR/CR and physical inspection requirements.</p><div><a className="text-link" href="https://hpg.pnp.gov.ph/wp-content/uploads/2024/07/Clearance-Form-1.pdf" target="_blank" rel="noreferrer">Open HPG requirements ↗</a><small>Checked 2026-10-04</small></div></article>
    </div>

    <FaqSection title="Used motorcycle questions" items={faqs}/>
    <JsonLd data={schema}/>
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, getModelById } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { php } from "@/lib/utils";
import { UsedValueExplorer } from "@/components/UsedValueExplorer";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const dynamic="force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Used Motorcycles Philippines: Verified Listings & Value",
  description: "Browse verified used motorcycle listing references when available, or estimate used value by model. Demo and research listings are never shown as live market data.",
  path: "/used-motorcycles",
  index:false
});

export default async function UsedMotorcyclesPage(){
  const listings=await getVerifiedUsedListings({limit:24});
  const estimates=motorcycles.map(m=>({
    id:m.id,
    make:m.make,
    model:m.model,
    href:`/motorcycles/${m.makeSlug}/${m.slug}#used`,
    oneYear:estimatedUsedValue(m,1),
    threeYear:estimatedUsedValue(m,3),
    fiveYear:estimatedUsedValue(m,5)
  }));

  return <section className="page shell used-master-page">
    <PageHero
      kicker="Used motorcycles"
      title="Used motorcycles without fake marketplace data"
      description="Verified listing references appear only when they are actually available. For everything else, use model-specific depreciation estimates as planning references instead of treating demo ads as live market evidence."
      actions={<CTAGroup><Link className="button" href="/used-motorcycles/buying-checklist">Used-bike checklist</Link><Link className="button secondary" href="/used-motorcycles/repo">Repo price board</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Verified listings",value:String(listings.length),note:"Public references available now"},
      {label:"Value estimates",value:String(estimates.length),note:"Model-specific planning records"},
      {label:"Listing policy",value:"Verified only",note:"Demo ads never shown as live market data"}
    ]}/>

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
      <p>MotoIndex does not publish demo private-seller ads as market evidence. Use the model estimator below while verified used listings are being added.</p>
    </InfoPanel>}

    <section className={styles.section} data-used-estimator-section>
      <SectionHeader
        kicker="Planning reference"
        title="Find a model-specific used-value estimate"
        description="These figures use depreciation assumptions. They are not live asking prices, dealer trade-in quotes or appraisals."
      />
      <UsedValueExplorer models={estimates}/>
    </section>
  </section>;
}

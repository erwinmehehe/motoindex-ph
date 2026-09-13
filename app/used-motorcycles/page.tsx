import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, getModelById } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { php } from "@/lib/utils";
import { UsedValueExplorer } from "@/components/UsedValueExplorer";

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
    <div className="page-head"><span className="entity-kicker">Used motorcycles</span><h1>Used motorcycles without fake marketplace data.</h1><p>Verified listing references appear when they are actually available. For the rest, use a model-specific depreciation estimate as a planning reference instead of treating sample ads as live market evidence.</p></div>

    {listings.length>0 ? <section className="used-listings-section">
      <div className="section-head compact"><div><span className="section-kicker">Verified market references</span><h2>Recently verified used listings</h2><p>Asking prices are seller references, not appraisals. Open the original source and inspect the motorcycle before paying.</p></div></div>
      <div className="used-market-list">{listings.map(item=>{const model=getModelById(item.modelExternalId);return <article className="used-market-card" key={item.id}>
        <div><span>{item.modelYear} · {item.condition}</span><h2>{item.title}</h2><p>{item.location} · {item.mileageKm.toLocaleString("en-PH")} km · {item.sellerType}</p>{model&&<Link href={`/motorcycles/${model.makeSlug}/${model.slug}#used`}>More {model.model} listings →</Link>}</div>
        <div className="used-market-price"><strong>{php(item.askingPricePhp)}</strong><small>Asking price</small></div>
        <div className="used-market-source"><small>Verified {item.verifiedAt?.slice(0,10)||item.postedAt.slice(0,10)}</small>{item.sourceUrl?<a href={item.sourceUrl} target="_blank" rel="nofollow noreferrer">Original listing ↗</a>:<span>{item.sourceLabel}</span>}</div>
      </article>})}</div>
    </section> : <section className="used-empty-market">
      <div><span className="section-kicker">Live listings</span><h2>No verified public used listings are available right now.</h2><p>MotoIndex does not publish demo private-seller ads as market evidence. Use the estimator below while verified used listings are being added.</p></div>
      <div className="hero-actions"><Link className="button" href="/used-motorcycles/repo">Repo price board</Link><Link className="button secondary" href="/used-motorcycles/buying-checklist">Buying checklist</Link></div>
    </section>}

    <section className="used-estimator-section">
      <div className="section-head compact"><div><span className="section-kicker">Planning reference</span><h2>Find a model-specific used-value estimate</h2><p>These figures use depreciation assumptions. They are not live asking prices, dealer trade-in quotes or appraisals.</p></div></div>
      <UsedValueExplorer models={estimates}/>
    </section>
  </section>;
}

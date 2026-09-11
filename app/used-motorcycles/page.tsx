import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, getModelById } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Used Motorcycles Philippines: Verified Listings & Value",
  description: "Browse verified used motorcycle listing references when available, or estimate used value by model. Demo and research listings are never shown as live market data.",
  path: "/used-motorcycles",
  index:false
});

export default async function UsedMotorcyclesPage(){
  const listings=await getVerifiedUsedListings({limit:24});
  return <section className="page shell">
    <div className="page-head"><span className="entity-kicker">Used motorcycles</span><h1>Verified used motorcycles and value estimates</h1><p>Verified listing references appear first when available. If there are no verified ads, use the model-specific depreciation estimator instead of sample marketplace data.</p></div>

    {listings.length>0 ? <>
      <div className="section-head compact"><div><h2>Recently verified used listings</h2><p>Asking prices are seller references, not appraisals. Open the original source and inspect the motorcycle before paying.</p></div></div>
      <div className="used-market-list">{listings.map(item=>{const model=getModelById(item.modelExternalId);return <article className="used-market-card" key={item.id}>
        <div><span>{item.modelYear} · {item.condition}</span><h2>{item.title}</h2><p>{item.location} · {item.mileageKm.toLocaleString("en-PH")} km · {item.sellerType}</p>{model&&<Link href={`/motorcycles/${model.makeSlug}/${model.slug}#used`}>More {model.model} listings →</Link>}</div>
        <div className="used-market-price"><strong>{php(item.askingPricePhp)}</strong><small>Asking price</small></div>
        <div className="used-market-source"><small>Verified {item.verifiedAt?.slice(0,10)||item.postedAt.slice(0,10)}</small>{item.sourceUrl?<a href={item.sourceUrl} target="_blank" rel="nofollow noreferrer">Original listing ↗</a>:<span>{item.sourceLabel}</span>}</div>
      </article>})}</div>
    </> : <div className="note-box"><h2>No verified public used listings are available right now</h2><p>MotoIndex does not publish demo private-seller ads as market evidence. The estimator and repo-unit research remain available while verified used listings are being added.</p><div className="hero-actions"><Link className="button small" href="/used-motorcycles/repo">Repo price board</Link><Link className="button ghost small" href="/used-motorcycles/buying-checklist">Buying checklist</Link></div></div>}

    <div className="section-head compact"><div><h2>Model-specific used-value estimates</h2><p>These figures use depreciation assumptions and are not live asking prices.</p></div></div>
    <div className="used-value-grid">{motorcycles.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#used`}><span>{m.make}</span><h2>{m.model}</h2><div><small>1 year</small><strong>{php(estimatedUsedValue(m,1))}</strong></div><div><small>3 years</small><strong>{php(estimatedUsedValue(m,3))}</strong></div><div><small>5 years</small><strong>{php(estimatedUsedValue(m,5))}</strong></div><b>Used value & listings →</b></Link>)}</div>
  </section>;
}

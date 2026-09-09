import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getModel } from "@/lib/data";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

export const dynamic="force-dynamic";

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params;
  const model=getModel(make,slug);
  if(!model)return {};
  const listings=await getVerifiedUsedListings({modelId:model.id,limit:4});
  return pageMetadata({
    title:`Used ${model.make} ${model.model} for Sale Philippines`,
    description:`Verified used ${model.make} ${model.model} listing references in the Philippines with asking price, year, mileage, location and original source.`,
    path:`/used-motorcycles/${model.makeSlug}/${model.slug}`,
    index:listings.length>=3
  });
}

export default async function Page({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params;
  const model=getModel(make,slug);
  if(!model)return notFound();
  const listings=await getVerifiedUsedListings({modelId:model.id,limit:50});

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Used motorcycles",href:"/used-motorcycles"},{label:`${model.make} ${model.model}`}]} />
    <div className="page-head"><span className="entity-kicker">Verified used listings</span><h1>Used {model.make} {model.model} for sale in the Philippines</h1><p>Only listing records that have passed MotoIndex verification are shown here. Asking prices are not appraisals and can change or disappear after the source is checked.</p></div>

    {listings.length ? <div className="used-market-list">{listings.map(item=><article className="used-market-card" key={item.id}>
      <div><span>{item.modelYear} · {item.condition}</span><h2>{item.title}</h2><p>{item.location} · {item.mileageKm.toLocaleString("en-PH")} km · {item.sellerType}</p></div>
      <div className="used-market-price"><strong>{php(item.askingPricePhp)}</strong><small>Asking price</small></div>
      <div className="used-market-source"><small>Verified {item.verifiedAt?.slice(0,10)||item.postedAt.slice(0,10)}</small>{item.sourceUrl?<a href={item.sourceUrl} target="_blank" rel="nofollow noreferrer">Open original listing ↗</a>:<span>{item.sourceLabel}</span>}</div>
    </article>)}</div> :
      <div className="note-box"><h2>No verified {model.model} listings are available right now</h2><p>MotoIndex does not fill this page with sample or demo ads. Use the model&apos;s used-value estimator while verified listing evidence is unavailable.</p><Link className="button small" href={`/motorcycles/${model.makeSlug}/${model.slug}#used`}>Estimate used value</Link></div>}

    <div className="cta-panel"><div><span className="section-kicker">Buying used</span><h2>Check the motorcycle before paying</h2><p>Verify OR/CR details, identity, service history, condition, modifications, encumbrances and the actual unit. A listing page is not a substitute for inspection.</p></div><Link className="button" href="/used-motorcycles/buying-checklist">Used-bike checklist</Link></div>
  </section>;
}

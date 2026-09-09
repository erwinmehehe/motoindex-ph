import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getModel, motorcycles, isIndexableModel } from "@/lib/data";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { pageMetadata } from "@/lib/site";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export function generateStaticParams(){
  return motorcycles.filter(m=>m.marketStatus!=="previous"&&m.marketStatus!=="discontinued").map(m=>({make:m.makeSlug,slug:m.slug}));
}

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params; const model=getModel(make,slug); if(!model)return {};
  return pageMetadata({
    title:`${model.make} ${model.model} Dealers Philippines`,
    description:`Find verified dealers for the ${model.make} ${model.model}, compare the published price and request a current cash or installment quote.`,
    path:`/motorcycles/${model.makeSlug}/${model.slug}/dealers`,
    index:isIndexableModel(model) && (await allVerifiedDealers()).some(seller=>seller.brands.some(brand=>brand.toLowerCase()===model.make.toLowerCase()))
  });
}

export default async function ModelDealersPage({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params; const model=getModel(make,slug);
  if(!model || model.marketStatus==="previous" || model.marketStatus==="discontinued")return notFound();

  const dealers=(await allVerifiedDealers()).filter(seller=>seller.brands.some(brand=>brand.toLowerCase()===model.make.toLowerCase()));

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:model.make,href:`/motorcycles/${model.makeSlug}`},{label:model.model,href:`/motorcycles/${model.makeSlug}/${model.slug}`},{label:"Dealers"}]}/>
    <div className="page-head">
      <span className="entity-kicker">Dealer options</span>
      <h1>{model.make} {model.model} dealers in the Philippines</h1>
      <p>Published price: <strong>{observedMarketPriceLabel(model)}</strong>. Dealer cash prices, fees, financing and stock can differ, so request the exact quote before reserving a unit.</p>
      <div className="hero-actions"><Link className="button" href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer prices</Link><Link className="button ghost" href="/dealers">Browse dealer directory</Link></div>
    </div>

    {dealers.length>0 ? <div className="list-cards">{dealers.map(dealer=><Link key={dealer.slug} href={`/sellers/${dealer.slug}`}><span><strong>{dealer.name}</strong><small>{dealer.city} · {dealer.region}</small></span><b>Dealer details →</b></Link>)}</div> :
      <div className="note-box"><h2>No verified {model.make} dealer is published here yet</h2><p>You can still submit a dealer-price request. MotoIndex will save it for matching, but your details are not shared unless a verified dealer match exists.</p><Link className="button small" href={`/get-quote/${model.makeSlug}/${model.slug}`}>Request a price</Link></div>}
  </section>;
}

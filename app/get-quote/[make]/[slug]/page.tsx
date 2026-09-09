import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { getModel, motorcycles, isIndexableModel } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { publicSellersByType } from "@/lib/sellers";

export function generateStaticParams(){return motorcycles.filter(m=>m.marketStatus!=="previous"&&m.marketStatus!=="discontinued").map(m=>({make:m.makeSlug,slug:m.slug}));}

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params; const m=getModel(make,slug); if(!m)return {};
  return pageMetadata({
    title:`${m.make} ${m.model} Dealer Price & Quote Philippines`,
    description:`Request the latest ${m.make} ${m.model} cash or installment price from verified motorcycle dealers serving your area in the Philippines.`,
    path:`/get-quote/${m.makeSlug}/${m.slug}`,
    index:isIndexableModel(m) && m.marketStatus!=="previous" && m.marketStatus!=="discontinued" && publicSellersByType("dealer").some(seller=>seller.brands.some(brand=>brand.toLowerCase()===m.make.toLowerCase()))
  });
}

export default async function QuotePage({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params;
  const m=getModel(make,slug);
  if(!m || m.marketStatus==="previous" || m.marketStatus==="discontinued")return notFound();

  return <section className="page shell quote-page">
    <Breadcrumbs items={[{label:`${m.make} ${m.model}`,href:`/motorcycles/${m.makeSlug}/${m.slug}`},{label:"Dealer price request"}]} />
    <div className="quote-grid">
      <div className="quote-summary">
        <span className="entity-kicker">Dealer price request</span>
        <h1>{m.make} {m.model}</h1>
        <p>{m.summary}</p>
        <div className="quote-price"><span>Published price</span><strong>{observedMarketPriceLabel(m)}</strong></div>
        <ul className="checklist">
          <li>Ask for cash or installment pricing</li>
          <li>Choose your city or province</li>
          <li>Matched only with verified dealer records</li>
          <li>No claim that a dealer received your request unless a match exists</li>
        </ul>
        <div className="hero-actions">
          <Link className="button ghost" href={`/motorcycles/${m.makeSlug}/${m.slug}/dealers`}>Dealer options</Link>
          <Link className="button ghost" href={`/motorcycles/${m.makeSlug}/${m.slug}#price`}>Check published prices</Link>
        </div>
      </div>
      <LeadForm model={m}/>
    </div>
  </section>;
}

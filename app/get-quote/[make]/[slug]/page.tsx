import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModel, motorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { hasQuoteEligibleDealerForBrand } from "@/lib/persistentSellers";
import Link from "next/link";

export function generateStaticParams(){return motorcycles.filter(m=>m.marketStatus!=="previous"&&m.marketStatus!=="discontinued").map(m=>({make:m.makeSlug,slug:m.slug}));}

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params; const m=getModel(make,slug); if(!m)return {};
  return pageMetadata({
    title:`${m.make} ${m.model} Dealers Philippines`,
    description:`Find checked ${m.make} dealer records and verify ${m.model} stock, exact variant and complete dealer pricing before paying a reservation.`,
    path:`/get-quote/${m.makeSlug}/${m.slug}`,
    index:false
  });
}

export default async function QuotePage({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params;
  const m=getModel(make,slug);
  if(!m || m.marketStatus==="previous" || m.marketStatus==="discontinued")return notFound();

  const enabled=await hasQuoteEligibleDealerForBrand(m.make);
  if(!enabled){
    return <main className="page shell">
      <div className="page-head"><span className="entity-kicker">Dealer pricing</span><h1>{m.make} {m.model} dealer prices</h1><p>MotoIndex does not collect your contact details unless a verified dealer partner for this brand is approved to receive buyer requests.</p></div>
      <div className="note-box"><h2>No approved quote receiver is active for {m.make} yet</h2><p>Use the checked dealer directory to contact a branch directly. The request form will appear here automatically when an approved dealer partner is available.</p><div className="hero-actions"><Link className="button" href={{pathname:"/dealers",query:{brand:m.make}}}>Browse {m.make} dealers</Link><Link className="button ghost" href={`/motorcycles/${m.makeSlug}/${m.slug}`}>Back to model research</Link></div></div>
    </main>;
  }

  return <main className="page shell">
    <div className="page-head"><span className="entity-kicker">Private dealer quote request</span><h1>Get {m.make} {m.model} dealer prices</h1><p>Send one request to up to three relevant verified MotoIndex dealer partners. Your details are shared only after a location and brand match exists.</p></div>
    <LeadForm model={m}/>
  </main>;
}

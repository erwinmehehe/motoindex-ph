import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { getModel, motorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { LeadForm } from "@/components/LeadForm";
import { php } from "@/lib/utils";
export function generateStaticParams(){return motorcycles.map(m=>({make:m.makeSlug,slug:m.slug}));}
export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{const {make,slug}=await params;const m=getModel(make,slug);return m?pageMetadata({title:`${m.make} ${m.model} Dealer Requests Unavailable`,description:`Dealer requests are not enabled for the ${m.make} ${m.model}.`,path:`/get-quote/${m.makeSlug}/${m.slug}`,index:false}):{};}
export default async function QuotePage({params}:{params:Promise<{make:string;slug:string}>}){const {make,slug}=await params;const m=getModel(make,slug);if(!m || m.marketStatus==="previous")return notFound();return <section className="page shell quote-page"><Breadcrumbs items={[{label:`${m.make} ${m.model}`,href:`/motorcycles/${m.makeSlug}/${m.slug}`},{label:"Dealer options"}]} /><div className="quote-grid"><div className="quote-summary"><h1>{m.make} {m.model}</h1><p>{m.summary}</p><div className="quote-price"><span>Indicative SRP</span><strong>{php(m.srp)}</strong></div><ul className="checklist"><li>No name, phone number or email collection</li><li>No dealer routing</li><li>Use the price page for current observations and installment estimates</li></ul></div><LeadForm model={m}/></div></section>}

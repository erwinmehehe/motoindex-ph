import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { helmetProducts } from "@/lib/catalog";
import { HelmetFinder, type HelmetFinderFilters } from "@/components/HelmetFinder";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";

export const metadata:Metadata=pageMetadata({title:"Helmet Finder Philippines: Compare Type, Price & Fit",description:"Filter verified motorcycle helmets in the Philippines by budget, type, size, visor features, intercom provision and certification details.",path:"/gear/helmets/finder",index:true});
const keys:(keyof HelmetFinderFilters)[]=["budget","type","use","brand","size","intercom","feature","certification"];
export default async function HelmetFinderPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams;const initial:Partial<HelmetFinderFilters>={};for(const key of keys){const v=params[key];if(typeof v==="string")initial[key]=v;}
  const products=helmetProducts.filter(p=>p.status==="verified");
  return <section className="page shell"><Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Helmet Finder"}]}/><div className="page-head"><h1>Find a helmet for your budget and riding</h1><p>Filter the verified catalog by helmet format, budget, listed size, visor equipment and intercom provision. The ranking explains practical fit to your use case; it is not a safety ranking.</p></div><div className="note-box helmet-safety-note"><h2>Before you buy</h2><p>Check the PS or ICC conformity mark on the exact helmet delivered in the Philippines, confirm the current brand size chart, and verify the seller and variant. Marketplace availability does not prove local conformity.</p><Link href="/methodology">How MotoIndex checks product sources →</Link></div><HelmetFinder products={products} initialFilters={initial}/></section>;
}

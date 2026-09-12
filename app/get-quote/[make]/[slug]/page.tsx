import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getModel, motorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

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

  // Buyer lead submission is intentionally disabled until a verified receiving
  // workflow is active. Send the CTA to a useful live surface instead of showing
  // a form that cannot complete.
  permanentRedirect(`/dealers?brand=${encodeURIComponent(m.make)}`);
}

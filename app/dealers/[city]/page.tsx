import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { dealerCities, dealersByCity, citySlug } from "@/lib/sellers";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams(){return dealerCities().map(city=>({city:citySlug(city)}));}
export async function generateMetadata({params}:{params:Promise<{city:string}>}):Promise<Metadata>{const {city}=await params;const list=dealersByCity(city);if(!list.length)return {};const cityName=list[0].city;return pageMetadata({title:`Motorcycle Dealers in ${cityName}`,description:`Motorcycle dealer profiles and price observations in ${cityName}. Sample profiles are labeled.`,path:`/dealers/${city}`,index:false});}
export default async function DealerCityPage({params}:{params:Promise<{city:string}>}){const {city}=await params;const list=dealersByCity(city);if(!list.length)return notFound();const cityName=list[0].city;return <section className="page shell"><Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:cityName}]} /><div className="page-head"><h1>Motorcycle dealers in {cityName}</h1><p>This directory is a preview. Sample profiles are labeled, and addresses or prices should be checked with the dealer directly.</p></div><div className="section-head compact"><div><h2>Dealer profiles</h2></div></div><div className="seller-grid">{list.map(s=><Link key={s.slug} href={`/sellers/${s.slug}`}><div className="seller-icon">D</div>{s.isDemo&&<span className="catalog-status">sample</span>}<h3>{s.name}</h3><p>{s.addressLabel}</p><small>{s.brands.join(" · ")}</small><b>View profile →</b></Link>)}</div></section>}

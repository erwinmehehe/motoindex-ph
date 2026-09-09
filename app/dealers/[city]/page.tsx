import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { MIN_PUBLIC_DEALERS_PER_CITY_PER_CITY, citySlug, publicDealerCities, publicDealersByCity } from "@/lib/sellers";
import { pageMetadata } from "@/lib/site";


export function generateStaticParams(){
  return publicDealerCities()
    .filter(city => publicDealersByCity(citySlug(city)).length >= MIN_PUBLIC_DEALERS_PER_CITY)
    .map(city => ({city:citySlug(city)}));
}

export async function generateMetadata({params}:{params:Promise<{city:string}>}):Promise<Metadata>{
  const {city}=await params;
  const list=publicDealersByCity(city);
  if(list.length < MIN_PUBLIC_DEALERS_PER_CITY) return {};
  const cityName=list[0].city;
  return pageMetadata({
    title:`Motorcycle Dealers in ${cityName}`,
    description:`Compare verified motorcycle dealer profiles in ${cityName}, including location and supported motorcycle brands.`,
    path:`/dealers/${city}`,
    index:true
  });
}

export default async function DealerCityPage({params}:{params:Promise<{city:string}>}){
  const {city}=await params;
  const list=publicDealersByCity(city);
  if(list.length < MIN_PUBLIC_DEALERS_PER_CITY) return notFound();
  const cityName=list[0].city;
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:cityName}]} />
    <div className="page-head">
      <span className="entity-kicker">Verified dealer directory</span>
      <h1>Motorcycle dealers in {cityName}</h1>
      <p>Compare verified dealer records in {cityName}. Confirm current stock, final cash price, registration fees and release timing directly with the branch before paying.</p>
    </div>
    <div className="section-head compact"><div><h2>Verified dealer profiles</h2><p>{list.length} checked dealer records currently meet MotoIndex&apos;s public listing requirements.</p></div></div>
    <div className="seller-grid">{list.map(s=><Link key={s.slug} href={`/sellers/${s.slug}`}><div className="seller-icon">D</div><h3>{s.name}</h3><p>{s.addressLabel}</p><small>{s.brands.join(" · ")}</small><b>View dealer →</b></Link>)}</div>
  </section>;
}

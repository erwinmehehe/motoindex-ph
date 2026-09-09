import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug, publicDealerCities, publicDealersByCity } from "@/lib/sellers";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams(){
  return publicDealerCities()
    .filter(city => publicDealersByCity(citySlug(city)).length >= MIN_PUBLIC_DEALERS_PER_CITY)
    .map(city => ({city:citySlug(city)}));
}

export async function generateMetadata({params}:{params:Promise<{city:string}>}):Promise<Metadata>{
  const {city}=await params;
  const list=(await allVerifiedDealers()).filter(dealer=>citySlug(dealer.city)===city);
  if(list.length < MIN_PUBLIC_DEALERS_PER_CITY) return {};
  const cityName=list[0].city;
  return pageMetadata({
    title:`Motorcycle Dealers in ${cityName}: Checked Branches`,
    description:`Find checked motorcycle dealer branches in ${cityName}, with addresses, phone numbers and supported brands from official dealer sources.`,
    path:`/dealers/${city}`,
    index:true
  });
}

function phoneHref(phone:string){return `tel:${phone.replace(/[^+\d]/g,"")}`;}

export default async function DealerCityPage({params}:{params:Promise<{city:string}>}){
  const {city}=await params;
  const list=(await allVerifiedDealers()).filter(dealer=>citySlug(dealer.city)===city);
  if(list.length < MIN_PUBLIC_DEALERS_PER_CITY) return notFound();
  const cityName=list[0].city;
  const province=list[0].province;
  const brands=[...new Set(list.flatMap(s=>s.brands))].sort();

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:cityName}]} />
    <div className="page-head">
      <span className="entity-kicker">Checked dealer directory</span>
      <h1>Motorcycle dealers in {cityName}</h1>
      <p>Find checked dealer branches in {cityName}{province?`, ${province}`:""}. Confirm current stock, final cash price, registration fees and release timing directly with the branch before paying.</p>
    </div>

    <div className="dealer-city-summary">
      <div><strong>{list.length}</strong><span>checked branches</span></div>
      <div><strong>{brands.length}</strong><span>brand{brands.length===1?"":"s"} represented</span></div>
      <div><strong>{province||list[0].region}</strong><span>coverage area</span></div>
    </div>

    <div className="section-head compact"><div>
      <span className="section-kicker">Dealer profiles</span>
      <h2>Checked branches in {cityName}</h2>
      <p>Each record below has an official dealer source on file, with address and contact details checked before publication.</p>
    </div></div>

    <div className="dealer-results">
      {list.map(s=><article className="dealer-result-card" key={s.slug}>
        <div className="dealer-card-top"><span className="dealer-brand">{s.brands.join(" · ")}</span><span className="dealer-checked">Official listing checked</span></div>
        <h3>{s.name}</h3>
        <p>{s.addressLabel}</p>
        <div className="dealer-card-meta">{s.phoneLabel?<span>{s.phoneLabel}</span>:null}<span>{s.categories.join(" · ")}</span></div>
        <div className="dealer-card-actions">
          <Link href={`/sellers/${s.slug}`}>View dealer</Link>
          {s.phoneLabel?<a href={phoneHref(s.phoneLabel)}>Call branch</a>:null}
        </div>
      </article>)}
    </div>

    <div className="dealer-city-footer">
      <Link className="button secondary" href="/dealers">Search all checked dealers</Link>
      <Link className="button secondary" href="/motorcycles">Compare motorcycles first</Link>
    </div>
  </section>;
}

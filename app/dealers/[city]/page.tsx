import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug, publicDealerCities, publicDealersByCity } from "@/lib/sellers";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { featuredDealerSlugsForCity } from "@/lib/dealerPlacements";
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
  const brands=[...new Set(list.flatMap(s=>s.brands))].sort();
  const brandLead=brands.length>1?`${brands.join(", ")} motorcycle dealers`:"motorcycle dealers";
  return pageMetadata({
    title:`Motorcycle Dealers in ${cityName}: Checked Branches`,
    description:`Find checked ${brandLead} in ${cityName}, with branch addresses, phone numbers and reviewed dealer-source details.`,
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
  const featuredSlugs=featuredDealerSlugsForCity(city);
  const featured=list.filter(dealer=>featuredSlugs.has(dealer.slug));
  const standard=featured.length?list.filter(dealer=>!featuredSlugs.has(dealer.slug)):list;
  const baseQuery={city:cityName,...(province?{province}:{}),source:`/dealers/${city}`};
  const freeJoinHref={pathname:"/dealers/join",query:{...baseQuery,plan:"free"}};
  const featuredJoinHref={pathname:"/dealers/join",query:{...baseQuery,plan:"featured"}};

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

    <aside className="note-box dealer-listing-callout">
      <span className="section-kicker">For motorcycle dealers</span>
      <h2>Are you a motorcycle dealer in {cityName}?</h2>
      <p>Get your verified branch listing on MotoIndex for free. Approved dealers can appear in the {cityName} directory with their brands, address, phone number and dealer profile. Want more visibility? You can also request a clearly labeled Featured Dealer placement for this city or selected brands.</p>
      <div className="dealer-city-footer">
        <Link className="button" href={freeJoinHref}>Get listed free</Link>
        <Link className="button secondary" href={featuredJoinHref}>Featured placement</Link>
      </div>
      <small>Verification is free and never sold. Featured placement only changes visibility and is labeled as sponsored.</small>
    </aside>

    <div className="dealer-city-brands" aria-label={`Motorcycle brands represented in ${cityName}`}>
      <span>Brands in this directory</span>
      <div>{brands.map(brand=><b key={brand}>{brand}</b>)}</div>
    </div>

    {featured.length>0&&<>
      <div className="section-head compact"><div>
        <span className="section-kicker">Sponsored visibility</span>
        <h2>Featured motorcycle dealers in {cityName}</h2>
        <p>These verified dealers purchased additional visibility. Paid placement does not change MotoIndex verification standards.</p>
      </div></div>
      <div className="dealer-results">
        {featured.map(s=><article className="dealer-result-card" key={s.slug}>
          <div className="dealer-card-top"><span className="dealer-brand">{s.brands.join(" · ")}</span><span className="dealer-checked">Featured · Sponsored</span></div>
          <h3>{s.name}</h3>
          <p>{s.addressLabel}</p>
          <div className="dealer-card-meta">{s.phoneLabel?<span>{s.phoneLabel}</span>:null}<span>{s.categories.join(" · ")}</span></div>
          <div className="dealer-card-actions"><Link href={`/sellers/${s.slug}`}>View dealer</Link>{s.phoneLabel?<a href={phoneHref(s.phoneLabel)}>Call branch</a>:null}</div>
        </article>)}
      </div>
    </>}

    <div className="section-head compact"><div>
      <span className="section-kicker">Dealer profiles</span>
      <h2>{featured.length?`All other checked branches in ${cityName}`:`Checked branches in ${cityName}`}</h2>
      <p>Each record below has a reviewed dealer-verification source on file, with address and contact details checked before publication.</p>
    </div></div>

    <div className="dealer-results">
      {standard.map(s=><article className="dealer-result-card" key={s.slug}>
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

    <aside className="note-box dealer-listing-callout">
      <span className="section-kicker">Grow your local visibility</span>
      <h2>Don&apos;t see your dealership in {cityName}?</h2>
      <p>Apply for a free verified MotoIndex dealer profile. After approval, you can also ask about Featured Dealer placement for {cityName} or selected motorcycle brands.</p>
      <div className="dealer-city-footer">
        <Link className="button" href={freeJoinHref}>Add your dealership free</Link>
        <Link className="button secondary" href={featuredJoinHref}>Ask about featured placement</Link>
      </div>
    </aside>

    <div className="dealer-city-footer">
      <Link className="button secondary" href="/dealers">Search all checked dealers</Link>
      <Link className="button secondary" href="/motorcycles">Compare motorcycles first</Link>
    </div>
  </section>;
}

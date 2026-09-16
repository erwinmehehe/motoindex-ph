import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug, publicDealerCities, publicDealersByCity } from "@/lib/sellers";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { activeDealerPromotionsForCity, placementLabel, type DealerPromotion } from "@/lib/dealerPromotions";
import type { SellerProfile } from "@/lib/types";
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

function DealerCard({seller,promotion}:{seller:SellerProfile;promotion?:DealerPromotion}){
  return <article className={`dealer-result-card${promotion?" is-featured":""}`}>
    {promotion&&<span className="dealer-paid-label">{placementLabel(promotion.tier)}{promotion.brand?` · ${promotion.brand}`:""}</span>}
    <div className="dealer-card-top"><span className="dealer-brand">{seller.brands.join(" · ")}</span><span className="dealer-checked">Verified listing</span></div>
    <h3>{seller.name}</h3>
    <p>{seller.addressLabel}</p>
    <div className="dealer-card-meta">{seller.phoneLabel?<span>{seller.phoneLabel}</span>:null}<span>{seller.categories.join(" · ")}</span></div>
    <div className="dealer-card-actions">
      <Link href={`/sellers/${seller.slug}`}>View dealer</Link>
      {seller.phoneLabel?<a href={phoneHref(seller.phoneLabel)}>Call branch</a>:null}
    </div>
    {promotion&&<p className="dealer-promotion-disclosure">Paid placement. Dealer verification is reviewed separately from advertising.</p>}
  </article>;
}

export default async function DealerCityPage({params}:{params:Promise<{city:string}>}){
  const {city}=await params;
  const list=(await allVerifiedDealers()).filter(dealer=>citySlug(dealer.city)===city);
  if(list.length < MIN_PUBLIC_DEALERS_PER_CITY) return notFound();
  const cityName=list[0].city;
  const province=list[0].province;
  const brands=[...new Set(list.flatMap(s=>s.brands))].sort();
  const joinHref={pathname:"/dealers/join",query:{city:cityName,...(province?{province}: {}),plan:"free"}};
  const featuredParams=new URLSearchParams({city:cityName,plan:"featured-city"});
  if(province)featuredParams.set("province",province);
  const featuredHref=`/dealers/join?${featuredParams.toString()}#featured-options`;

  const sellerBySlug=new Map(list.map(seller=>[seller.slug,seller]));
  const featured=activeDealerPromotionsForCity(cityName).flatMap(promotion=>{
    const seller=sellerBySlug.get(promotion.sellerSlug);
    if(!seller)return [];
    if(promotion.brand&&!seller.brands.some(brand=>brand.toLowerCase()===promotion.brand?.toLowerCase()))return [];
    return [{seller,promotion}];
  });
  const featuredSlugs=new Set(featured.map(item=>item.seller.slug));
  const standard=list.filter(seller=>!featuredSlugs.has(seller.slug));

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
      <p>Get your verified branch listed on MotoIndex for free so riders can find your dealership while they compare motorcycles, prices and nearby branches. Featured placements are optional.</p>
      <div className="dealer-city-footer">
        <Link className="button" href={joinHref}>Get listed free</Link>
        <Link className="button secondary" href={featuredHref}>See featured options</Link>
      </div>
    </aside>

    <div className="dealer-city-brands" aria-label={`Motorcycle brands represented in ${cityName}`}>
      <span>Brands in this directory</span>
      <div>{brands.map(brand=><b key={brand}>{brand}</b>)}</div>
    </div>

    {featured.length>0&&<section className="dealer-featured-section">
      <div className="dealer-featured-head"><div><span className="section-kicker">Paid visibility</span><h2>Featured motorcycle dealers in {cityName}</h2></div><p>Featured placement is advertising. Every dealer shown here must still pass the same branch-verification checks as a free listing.</p></div>
      <div className="dealer-featured-grid">{featured.map(({seller,promotion})=><DealerCard key={seller.slug} seller={seller} promotion={promotion}/>)}</div>
    </section>}

    <div className="section-head compact"><div>
      <span className="section-kicker">Dealer profiles</span>
      <h2>{featured.length>0?`All other verified branches in ${cityName}`:`Checked branches in ${cityName}`}</h2>
      <p>Each record below has a reviewed dealer-verification source on file, with address and contact details checked before publication.</p>
    </div></div>

    <div className="dealer-results">
      {standard.map(seller=><DealerCard seller={seller} key={seller.slug}/>) }
    </div>

    <aside className="note-box dealer-listing-callout">
      <span className="section-kicker">Free dealer listing</span>
      <h2>Don&apos;t see your dealership in {cityName}?</h2>
      <p>Apply for a verified MotoIndex dealer profile at no cost. After verification, you can keep the standard listing free or ask about optional featured placement for {cityName}.</p>
      <div className="dealer-city-footer"><Link className="button" href={joinHref}>Add your dealership free</Link><Link className="button secondary" href={featuredHref}>Featured dealer pricing</Link></div>
    </aside>

    <div className="dealer-city-footer">
      <Link className="button secondary" href="/dealers">Search all checked dealers</Link>
      <Link className="button secondary" href="/motorcycles">Compare motorcycles first</Link>
    </div>
  </section>;
}

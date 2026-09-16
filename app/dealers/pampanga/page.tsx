import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug } from "@/lib/sellers";
import { pageMetadata } from "@/lib/site";

const MIN_PAMPANGA_DEALERS = 5;

export async function generateMetadata():Promise<Metadata>{
  const dealers=(await allVerifiedDealers()).filter(dealer=>dealer.province==="Pampanga");
  return pageMetadata({
    title:"Motorcycle Dealers in Pampanga: Checked Branches",
    description:"Find checked motorcycle dealers in Pampanga, including Angeles City and San Fernando branches with addresses, phone numbers and supported brands.",
    path:"/dealers/pampanga",
    index:dealers.length>=MIN_PAMPANGA_DEALERS
  });
}

function phoneHref(phone:string){return `tel:${phone.replace(/[^+\d]/g,"")}`;}

export default async function PampangaDealersPage(){
  const dealers=(await allVerifiedDealers()).filter(dealer=>dealer.province==="Pampanga");
  if(dealers.length<MIN_PAMPANGA_DEALERS)return notFound();

  const cityCounts=new Map<string,number>();
  for(const dealer of dealers)cityCounts.set(dealer.city,(cityCounts.get(dealer.city)||0)+1);
  const publishedCities=[...cityCounts.entries()]
    .filter(([,count])=>count>=MIN_PUBLIC_DEALERS_PER_CITY)
    .map(([city])=>city)
    .sort();
  const brands=[...new Set(dealers.flatMap(dealer=>dealer.brands))].sort();
  const cities=[...new Set(dealers.map(dealer=>dealer.city))].sort();
  const freeJoinHref="/dealers/join?province=Pampanga&plan=free&source=%2Fdealers%2Fpampanga";
  const featuredJoinHref="/dealers/join?province=Pampanga&plan=featured-city&source=%2Fdealers%2Fpampanga#featured-options";

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Pampanga"}]} />
    <div className="page-head">
      <span className="entity-kicker">Pampanga dealer directory</span>
      <h1>Motorcycle dealers in Pampanga</h1>
      <p>Browse checked motorcycle dealer branches across Pampanga. Current coverage includes Angeles City and San Fernando, with dealer relationships and business details checked before publication.</p>
    </div>

    <div className="dealer-city-summary">
      <div><strong>{dealers.length}</strong><span>checked branches</span></div>
      <div><strong>{brands.length}</strong><span>brands represented</span></div>
      <div><strong>{cities.length}</strong><span>cities covered</span></div>
    </div>

    <aside className="note-box dealer-listing-callout">
      <span className="section-kicker">For Pampanga motorcycle dealers</span>
      <h2>Get your dealership listed on MotoIndex for free.</h2>
      <p>Approved Pampanga dealers can receive a verified public profile and appear in relevant city and brand searches. Optional Featured Dealer, Brand + City, and City Sponsor placements are available for dealers that want additional visibility.</p>
      <div className="dealer-city-footer">
        <Link className="button" href={freeJoinHref}>Get listed free</Link>
        <Link className="button secondary" href={featuredJoinHref}>See featured options</Link>
      </div>
      <small>Verification stays free and independent from advertising. Paid visibility is always labeled.</small>
    </aside>

    {publishedCities.length?<section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">City coverage</span>
        <h2>Browse Pampanga dealers by city</h2>
        <p>Open a city directory when it has at least {MIN_PUBLIC_DEALERS_PER_CITY} checked branches.</p>
      </div></div>
      <div className="dealer-city-links">
        {publishedCities.map(city=><Link href={`/dealers/${citySlug(city)}`} key={city}>
          <strong>Motorcycle dealers in {city}</strong>
          <span>{cityCounts.get(city) || 0} checked branches</span>
        </Link>)}
      </div>
    </section>:null}

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Checked dealer profiles</span>
        <h2>Motorcycle dealer branches in Pampanga</h2>
        <p>Call the branch before visiting to confirm the exact motorcycle, color, stock status, cash price and release timing.</p>
      </div></div>
      <div className="dealer-results">
        {dealers.map(dealer=><article className="dealer-result-card" key={dealer.slug}>
          <div className="dealer-card-top"><span className="dealer-brand">{dealer.brands.join(" · ")}</span><span className="dealer-checked">Listing checked</span></div>
          <h3>{dealer.name}</h3>
          <p>{dealer.addressLabel}</p>
          <div className="dealer-card-meta"><span>{dealer.city}, Pampanga</span>{dealer.phoneLabel?<span>{dealer.phoneLabel}</span>:null}</div>
          <div className="dealer-card-actions">
            <Link href={`/sellers/${dealer.slug}`}>View dealer</Link>
            {dealer.phoneLabel?<a href={phoneHref(dealer.phoneLabel)}>Call branch</a>:null}
          </div>
        </article>)}
      </div>
    </section>

    <aside className="note-box dealer-listing-callout">
      <span className="section-kicker">Dealer visibility in Pampanga</span>
      <h2>Don&apos;t see your dealership here?</h2>
      <p>Submit your branch for free verification. After approval, you can keep the standard listing free or ask about paid visibility for Angeles City, San Fernando, a motorcycle brand, or a broader Pampanga campaign.</p>
      <div className="dealer-city-footer">
        <Link className="button" href={freeJoinHref}>Add your dealership free</Link>
        <Link className="button secondary" href={featuredJoinHref}>Featured dealer pricing</Link>
      </div>
    </aside>

    <section className="motorcycle-entity-section">
      <div className="dealer-verification-note">
        <strong>Before paying a deposit</strong>
        <p>Confirm the final cash price, registration or processing charges, financing terms if applicable, warranty coverage and the expected release date directly with the branch.</p>
      </div>
    </section>
  </section>;
}

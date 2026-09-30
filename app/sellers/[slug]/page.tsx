import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { offersForSeller } from "@/lib/sellers";
import { staticPublicSellers } from "@/lib/staticDealerData";
import { getVerifiedSellerProfile } from "@/lib/persistentSellers";
import { getVerifiedOffers } from "@/lib/persistentOffers";
import { entityHref, entityLabel } from "@/lib/entities";
import { php, phpRange } from "@/lib/utils";
import { dealerNetworkPriceReferences } from "@/lib/dealerNetworkPricing";
import { pageMetadata } from "@/lib/site";
import { sellerBusinessSchema } from "@/lib/structuredData";

export function generateStaticParams(){return staticPublicSellers().map(s=>({slug:s.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const s=await getVerifiedSellerProfile(slug);
  return s?pageMetadata({
    title:`${s.name}: Dealer Details & Contact`,
    description:`${s.name} in ${s.city}: checked address, phone, supported motorcycle brands and official dealer-source details.`,
    path:`/sellers/${s.slug}`,
    index:true
  }):{};
}

function phoneHref(phone:string){return `tel:${phone.replace(/[^+\d]/g,"")}`;}

export default async function SellerPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getVerifiedSellerProfile(slug);
  if(!s)return notFound();
  const legacyOffers=offersForSeller(slug).filter(o=>o.status==="verified");
  const persistentOffers=(await getVerifiedOffers()).filter(o=>o.sellerSlug===slug);
  const offers=[...new Map([...legacyOffers,...persistentOffers].map(offer=>[offer.id,offer])).values()];
  const networkPriceReferences=dealerNetworkPriceReferences(s);
  const parent = s.type === "dealer" ? {label:"Dealers",href:"/dealers"} : {label:"Sellers"};

  const localBusinessSchema=sellerBusinessSchema(s);


  return <section className="page shell">
    <JsonLd data={localBusinessSchema} />
    <Breadcrumbs items={[parent,{label:s.name}]} />
    <div className="seller-hero">
      <div>
        <span className="entity-kicker">Dealer details checked</span>
        <h1>{s.name}</h1>
        <p>{s.description}</p>
        <div className="seller-tags">{s.categories.map(x=><span key={x}>{x}</span>)}{s.brands.map(x=><span key={x}>{x}</span>)}</div>
      </div>
      <div className="seller-location">
        <span>Location</span>
        <strong>{s.city}</strong>
        <p>{s.addressLabel}</p>
        <small>{s.province||s.region}</small>
        {s.phoneLabel?<a className="seller-phone" href={phoneHref(s.phoneLabel)}>{s.phoneLabel}</a>:null}
      </div>
    </div>

    <section className="dealer-profile-trust">
      <div>
        <span className="section-kicker">Listing check</span>
        <h2>Branch details have a checked verification source</h2>
        <p>{s.verificationNote||"This public profile has an official source on file for its business details."}</p>
      </div>
      {s.sourceUrl?<a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">Open verification source ↗</a>:null}
    </section>

    <div className="section-head"><div>
      <h2>Checked prices from this dealer</h2>
      <p>Dealer profile verification does not automatically verify stock or pricing. Price offers appear here only after a separate current price check.</p>
    </div></div>
    {offers.length?<div className="seller-offers">{offers.map(o=><Link key={o.id} href={entityHref(o.entityType,o.entityId)}><span><small>{o.entityType}</small><strong>{entityLabel(o.entityType,o.entityId)}</strong></span><span><strong>{o.pricePhp?php(o.pricePhp):"Ask seller"}</strong><small>{o.availability}</small></span><em className="offer-status verified">checked</em></Link>)}</div>:<div className="empty-state large">No current branch-specific checked price offers yet.</div>}

    {networkPriceReferences.length>0&&<section className="dealer-network-prices" aria-labelledby="dealer-network-prices-heading">
      <div className="section-head dealer-network-head"><div>
        <span className="section-kicker">Dealer-network reference</span>
        <h2 id="dealer-network-prices-heading">Current prices published by this dealer network</h2>
        <p>These prices were checked on the dealer network&apos;s public listings. They are useful reference points, but they are not proof of this branch&apos;s current stock, promo, financing approval or final branch quote.</p>
      </div></div>
      <div className="seller-offers dealer-network-offers">
        {networkPriceReferences.map(row=><Link key={row.modelId} href={row.href}>
          <span><small>{row.sourceName}</small><strong>{row.label}</strong></span>
          <span><strong>{phpRange(row.priceFromPhp,row.priceToPhp)}</strong><small>Checked {row.checkedAt}</small></span>
          <em className="offer-status verified">network</em>
        </Link>)}
      </div>
      <p className="dealer-network-note">Confirm the exact variant, cash price, fees and release date with this branch before paying a reservation or deposit.</p>
    </section>}
  </section>;
}

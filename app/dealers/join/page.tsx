import type { Metadata } from "next";
import Link from "next/link";
import { DealerPartnerForm } from "@/components/DealerPartnerForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";
import { dealerPlacementPlans, type DealerPlacementTier } from "@/lib/dealerPromotions";

export const metadata:Metadata=pageMetadata({
  title:"Free Motorcycle Dealer Listing | Join MotoIndex",
  description:"Get your motorcycle dealership listed on MotoIndex for free after verification, or ask about optional featured placement by city and brand.",
  path:"/dealers/join"
});

export default async function Page({searchParams}:{searchParams:Promise<{city?:string;province?:string;plan?:string}>}){
  const params=await searchParams;
  const defaultCity=(params.city||"").slice(0,80);
  const defaultProvince=(params.province||"").slice(0,80);
  const requestedPlan=typeof params.plan==="string"?params.plan:"free";
  const defaultPlan=(dealerPlacementPlans.some(plan=>plan.id===requestedPlan)?requestedPlan:"free") as DealerPlacementTier;

  return <section className="page shell quote-page">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Join MotoIndex"}]}/>
    <div className="quote-grid">
      <div className="quote-summary">
        <span className="entity-kicker">Free dealer listing</span>
        <h1>Get your motorcycle dealership listed free on MotoIndex.</h1>
        <p>Reach riders who are already researching motorcycles, comparing prices and looking for a branch near them. A verified standard dealer listing costs nothing.</p>
        <ul className="checklist">
          <li>Free verified public branch profile</li>
          <li>Brand and city visibility in dealer search</li>
          <li>Eligibility for relevant buyer quote matching</li>
          <li>Dealer contact details shown to high-intent riders</li>
        </ul>
        <div className="note-box compact-note"><h3>Verification is never for sale</h3><p>MotoIndex checks the branch evidence before publication. Paid placement only changes visibility after a dealer is verified; it does not buy approval or alter verification standards.</p></div>
        <Link className="text-link" href="#featured-options">See optional featured placements →</Link>
      </div>
      <DealerPartnerForm defaultCity={defaultCity} defaultProvince={defaultProvince} defaultPlan={defaultPlan}/>
    </div>

    <section id="featured-options" className="dealer-pricing-section dealer-plan-anchor">
      <div className="dealer-pricing-head">
        <span className="section-kicker">Dealer visibility options</span>
        <h2>Start free. Upgrade only if you want more local visibility.</h2>
        <p>Free verified listings remain in the directory. Paid plans are optional placements for dealers that want more visibility in a city or for a specific motorcycle brand.</p>
      </div>
      <div className="dealer-pricing-grid">
        {dealerPlacementPlans.map(plan=><article key={plan.id} className={`dealer-plan-card${plan.paid?"":" is-free"}`}>
          <span>{plan.paid?"Optional paid placement":"Standard listing"}</span>
          <h3>{plan.name}</h3>
          <strong className="dealer-plan-price">{plan.price}</strong>
          <p>{plan.description}</p>
          <ul>{plan.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </article>)}
      </div>
      <p className="dealer-pricing-note">Introductory placement rates are billed only after verification and a separate commercial agreement. Featured availability is limited by city and brand. Buyer leads are not guaranteed.</p>
      <div className="dealer-free-message"><strong>Free means free:</strong> a dealer does not need to purchase a featured plan to be verified, listed, searchable or considered for relevant buyer quote matching.</div>
    </section>
  </section>;
}

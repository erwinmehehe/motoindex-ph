import type { Metadata } from "next";
import Link from "next/link";
import { DealerPartnerForm } from "@/components/DealerPartnerForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { dealerPlacementPlans, normalizeDealerPlacementTier } from "@/lib/dealerPlacements";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Free Motorcycle Dealer Listing | Join MotoIndex",
  description:"Get your motorcycle dealership listed on MotoIndex for free after verification, or ask about optional featured placement by city and brand.",
  path:"/dealers/join"
});

type SearchParams={city?:string;province?:string;plan?:string;source?:string};

export default async function Page({searchParams}:{searchParams:Promise<SearchParams>}){
  const params=await searchParams;
  const defaultCity=(params.city||"").slice(0,80);
  const defaultProvince=(params.province||"").slice(0,80);
  const defaultPlan=normalizeDealerPlacementTier(params.plan);
  const sourcePath=(params.source||"").slice(0,180);

  return <section className="page shell quote-page">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Get listed"}]}/>
    <div className="quote-grid">
      <div className="quote-summary">
        <span className="entity-kicker">Free dealer listing</span>
        <h1>Get your motorcycle dealership listed free on MotoIndex.</h1>
        <p>Start with a verified public branch listing for free. Dealers that want more visibility can request an optional paid placement after verification.</p>
        <ul className="checklist">
          <li>Free verified public branch profile</li>
          <li>Brand and city visibility in dealer search</li>
          <li>Address, phone and website details</li>
          <li>Eligibility for relevant buyer quote matching after approval</li>
        </ul>
        <div className="note-box compact-note"><h3>Verification is never for sale</h3><p>Paying for visibility does not make a dealership verified. MotoIndex reviews branch evidence first, and sponsored placement is always labeled separately from verification.</p></div>
        <Link className="text-link" href="#featured-options">See optional featured placements →</Link>
      </div>
      <DealerPartnerForm defaultCity={defaultCity} defaultProvince={defaultProvince} defaultPlan={defaultPlan} sourcePath={sourcePath}/>
    </div>

    <section id="featured-options" className="dealer-pricing-section dealer-plan-anchor">
      <div className="dealer-pricing-head">
        <span className="section-kicker">Dealer visibility options</span>
        <h2>Start free. Upgrade only if you want more local visibility.</h2>
        <p>Free verified listings stay in the directory. Paid plans only add clearly labeled visibility in a city or for a motorcycle brand.</p>
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
      <p className="dealer-pricing-note">These are introductory rates. Paid placement is activated only after the branch is independently verified and separate commercial terms are agreed. Featured availability is limited by city and brand. Buyer leads are not guaranteed.</p>
      <div className="dealer-free-message"><strong>Free means free:</strong> a dealer does not need to buy a featured plan to be verified, listed, searchable or considered for relevant buyer quote matching.</div>
    </section>
  </section>;
}

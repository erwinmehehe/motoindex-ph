import type { Metadata } from "next";
import Link from "next/link";
import { DealerPartnerForm } from "@/components/DealerPartnerForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Get Your Motorcycle Dealership Listed on MotoIndex",
  description:"Apply for a free verified MotoIndex dealer listing, or register interest in paid Featured Dealer placement by city and motorcycle brand.",
  path:"/dealers/join"
});

type SearchParams={city?:string;province?:string;plan?:string;source?:string};

export default async function Page({searchParams}:{searchParams:Promise<SearchParams>}){
  const query=await searchParams;
  const plan=query.plan==="featured"?"featured":"free";
  const city=(query.city||"").slice(0,100);
  const province=(query.province||"").slice(0,100);
  const source=(query.source||"").slice(0,180);

  return <section className="page shell quote-page">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Get listed"}]}/>
    <div className="quote-grid">
      <div className="quote-summary">
        <span className="entity-kicker">Dealer listings</span>
        <h1>Get your motorcycle dealership listed on MotoIndex.</h1>
        <p>Start with a verified public branch listing for free. Dealers that want more visibility can request a clearly labeled Featured Dealer placement for selected cities or motorcycle brands.</p>

        <div className="note-box compact-note">
          <span className="section-kicker">Free Verified Listing · ₱0</span>
          <h3>Build your public dealer profile at no cost.</h3>
          <ul className="checklist">
            <li>Verified public branch profile</li>
            <li>Brand and city directory visibility</li>
            <li>Address, phone and dealership details</li>
            <li>Eligibility for relevant buyer quote matching after approval</li>
          </ul>
        </div>

        <div className="note-box compact-note">
          <span className="section-kicker">Featured Dealer · Paid visibility</span>
          <h3>Get priority placement where local buyers are already searching.</h3>
          <ul className="checklist">
            <li>Featured placement in selected city directories</li>
            <li>Optional brand + city sponsorship opportunities</li>
            <li>Clearly labeled Featured / Sponsored placement</li>
            <li>Same verification standard as every free listing</li>
          </ul>
          <p><strong>Pilot pricing:</strong> city placement from ₱1,500/month; brand + city placement from ₱3,000/month. Availability is limited by location.</p>
        </div>

        <div className="note-box compact-note"><h3>Verification is never for sale</h3><p>Paying for visibility does not make a dealership verified. MotoIndex checks branch evidence first, and sponsored placement is always labeled separately from verification.</p></div>
        <Link className="text-link" href="/dealers">See the public dealer directory →</Link>
      </div>
      <DealerPartnerForm initialCity={city} initialProvince={province} initialPlan={plan} sourcePath={source}/>
    </div>
  </section>;
}

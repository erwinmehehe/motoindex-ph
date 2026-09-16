import type { Metadata } from "next";
import Link from "next/link";
import { DealerPartnerForm } from "@/components/DealerPartnerForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Join MotoIndex as a Motorcycle Dealer Partner",
  description:"Apply to add a verified motorcycle dealership to MotoIndex, publish checked branch details and become eligible for model-specific buyer quote matching.",
  path:"/dealers/join"
});

export default async function Page({searchParams}:{searchParams:Promise<{city?:string;province?:string}>}){
  const params=await searchParams;
  const defaultCity=(params.city||"").slice(0,80);
  const defaultProvince=(params.province||"").slice(0,80);
  return <section className="page shell quote-page">
    <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Join MotoIndex"}]}/>
    <div className="quote-grid">
      <div className="quote-summary">
        <span className="entity-kicker">Dealer partners</span>
        <h1>Get your motorcycle dealership listed on MotoIndex.</h1>
        <p>Reach riders who are already researching motorcycles, comparing prices and looking for a branch near them. Approved dealers can receive a verified public profile and become eligible for relevant buyer quote matching.</p>
        <ul className="checklist">
          <li>Verified public branch profile on MotoIndex</li>
          <li>Brand and city visibility in dealer search</li>
          <li>Eligibility for relevant buyer quote matches</li>
          <li>Dealer contact details shown to high-intent riders</li>
        </ul>
        <div className="note-box compact-note"><h3>Verification comes first</h3><p>A submitted application is not treated as a verified dealer. MotoIndex checks the branch evidence before the profile or lead-routing status can go live.</p></div>
        <Link className="text-link" href="/dealers">See the public dealer directory →</Link>
      </div>
      <DealerPartnerForm defaultCity={defaultCity} defaultProvince={defaultProvince}/>
    </div>
  </section>;
}

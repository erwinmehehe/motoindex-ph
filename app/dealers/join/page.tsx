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

export default function Page(){return <section className="page shell quote-page">
  <Breadcrumbs items={[{label:"Dealers",href:"/dealers"},{label:"Join MotoIndex"}]}/>
  <div className="quote-grid">
    <div className="quote-summary">
      <span className="entity-kicker">Dealer partners</span>
      <h1>Reach motorcycle buyers already comparing a model.</h1>
      <p>MotoIndex connects model research, published prices and dealer discovery. Verified branches can become eligible for buyer quote matching when the motorcycle brand and location fit the request.</p>
      <ul className="checklist">
        <li>Public branch profile after verification</li>
        <li>Brand and city visibility in dealer search</li>
        <li>Eligibility for relevant buyer quote matches</li>
        <li>Separate review for any dealer price or financing offers</li>
      </ul>
      <div className="note-box compact-note"><h3>Verification comes first</h3><p>A submitted application is not treated as a verified dealer. MotoIndex checks the branch evidence before the profile or lead-routing status can go live.</p></div>
      <Link className="text-link" href="/dealers">See the public dealer directory →</Link>
    </div>
    <DealerPartnerForm/>
  </div>
</section>;}

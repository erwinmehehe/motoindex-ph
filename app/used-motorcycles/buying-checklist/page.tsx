import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Buying a Second-Hand Motorcycle Philippines — Checklist",
  description:"Used motorcycle checklist for seller identity, OR/CR, deed of sale, HPG clearance, inspection, mileage, condition and payment checks in the Philippines.",
  path:"/used-motorcycles/buying-checklist",
  index:true
});

const sections=[
  ["Match the seller and motorcycle to the papers","Compare the seller’s identity with the registration and transaction documents. Check the plate, engine and chassis details against the OR/CR and the actual motorcycle. Do not accept a mismatch just because the price is attractive."],
  ["Confirm the transfer documents before paying in full","The 2025 LTO motorcycle ownership rules list a duly notarized deed of conveyance or sale, OR/CR, valid HPG clearance and a valid government-issued ID among the general transfer requirements. Corporate ownership adds a secretary certificate."],
  ["Inspect condition independently","Cold-start the engine if possible, check warning lights, leaks, steering, brakes, tires, suspension, charging/electrical functions and signs of crash or flood damage. For an expensive unit, an independent mechanic inspection is usually cheaper than discovering a hidden fault after purchase."],
  ["Treat mileage as one clue, not proof of condition","Compare odometer reading with service records and visible wear on grips, controls, brake parts, tires, seat and drivetrain. Very low mileage is not automatically better if the motorcycle has been stored poorly or has incomplete history."],
  ["Price the whole transaction","Include immediate repairs, registration/transfer costs, HPG/inspection steps, tires, battery, fluids and insurance—not just the asking price. A cheaper motorcycle with deferred maintenance can cost more than a cleaner higher-priced unit."],
  ["Use a traceable payment trail","Do not send a large deposit merely to reserve a unit you have not verified. Keep seller identity, signed transaction documents, receipts and payment records. For repo/dealer units, transact through the seller’s official channels rather than an individual claiming to be an agent."],
  ["Complete the ownership transfer","Do not leave the motorcycle indefinitely under the prior owner’s registration. Follow the current LTO transfer process and retain the completed transaction records."],
] as const;

const faqs=[
  {question:"What papers should I check when buying a second-hand motorcycle?",answer:"At minimum, verify the motorcycle’s OR/CR and the transaction documents. Current LTO motorcycle transfer rules list a duly notarized deed of conveyance or sale, OR/CR, valid HPG clearance and valid identification among the general requirements."},
  {question:"Is an open deed of sale enough?",answer:"Do not treat an incomplete or open-ended document as a substitute for a properly completed transfer. The current LTO rule calls for a duly notarized deed of conveyance or agreement and a formal ownership-transfer process."},
  {question:"Should I buy a used motorcycle without HPG clearance?",answer:"Valid HPG clearance is listed by LTO among the general ownership-transfer requirements. Confirm the current clearance and transfer process before completing the purchase."},
  {question:"Are repo motorcycles automatically safer than private used listings?",answer:"No. A repo unit may come through an established finance/dealer channel, but condition and terms still matter. SB Finance, for example, states that repo units are sold without the manufacturer warranty and under an as-is, where-is clause."}
];

const ltoRule="https://lto.gov.ph/wp-content/uploads/2025/07/IRR-RA-12209.pdf";
const ltoCitizen="https://lto.gov.ph/wp-content/uploads/2025/11/MV-CC-2025.pdf";
const sbfFaq="https://www.sbfinance.com.ph/faqs/";

export default function BuyingChecklistPage(){
  const schema={"@context":"https://schema.org","@type":"HowTo",name:"Buying a second-hand motorcycle in the Philippines",description:"Document and inspection checklist for a used motorcycle purchase in the Philippines.",step:sections.map(([name,text])=>({"@type":"HowToStep",name,text}))};
  return <section className="page shell trust-page"><Breadcrumbs items={[{label:"Used motorcycles"},{label:"Buying checklist"}]}/><div className="page-head"><h1>Buying a second-hand motorcycle: Philippines checklist</h1><p>Use this before paying for a private, dealer or repo unit. It combines transaction checks with the current LTO motorcycle ownership-transfer requirements.</p><small className="source-date">Official-rule check: 2026-08-26</small></div>
    <div className="method-steps ownership-guide-sections">{sections.map(([heading,body],i)=><article key={heading}><b>{String(i+1).padStart(2,"0")}</b><h2>{heading}</h2><p>{body}</p></article>)}</div>
    <div className="note-box"><h2>Do not confuse asking price with fair value</h2><p>A used motorcycle needs condition, mileage, service history, model year, variant and document context. Compare current seller-published repo prices on the <Link href="/used-motorcycles/repo">repo price board</Link>, then treat age-based estimates as planning references rather than appraisals.</p></div>
    <div className="source-ladder"><article><span>Official rule</span><h2>LTO IRR of RA 12209</h2><p>Current motorcycle ownership reporting and transfer requirements, including the general transfer-document list.</p><div><a className="text-link" href={ltoRule} target="_blank" rel="noreferrer">Open LTO rule ↗</a><small>Checked 2026-08-26</small></div></article><article><span>Transaction checklist</span><h2>LTO 2025 Citizen’s Charter</h2><p>Current LTO service requirements including deed-of-sale and HPG-clearance references for ownership transfer.</p><div><a className="text-link" href={ltoCitizen} target="_blank" rel="noreferrer">Open LTO checklist ↗</a><small>Checked 2026-08-26</small></div></article><article><span>Repo condition terms</span><h2>SB Finance repo FAQ</h2><p>Seller-specific repo notes including warranty, as-is/where-is treatment and registration/insurance responsibilities.</p><div><a className="text-link" href={sbfFaq} target="_blank" rel="noreferrer">Open seller FAQ ↗</a><small>Checked 2026-08-26</small></div></article></div>
    <FaqSection title="Second-hand motorcycle buying questions" items={faqs}/><JsonLd data={schema}/>
  </section>;
}

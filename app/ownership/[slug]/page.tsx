import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getOwnershipGuide, ownershipGuides } from "@/lib/ownershipGuides";
import { pageMetadata } from "@/lib/site";
import { LtoRegistrationCalculator } from "@/components/LtoRegistrationCalculator";
import { MotorcycleInsuranceCalculator } from "@/components/MotorcycleInsuranceCalculator";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { AuthorBox } from "@/components/AuthorBox";
import { articleSchema } from "@/lib/articleSchema";


const guideFaqs: Record<string, FaqItem[]> = {
  "registration-renewal": [
    { question: "How early can I renew motorcycle registration?", answer: "LTO guidance says vehicle registration may be renewed up to two months before expiry. Check the current LTO process and your registration record before transacting." },
    { question: "Can motorcycle registration renewal be done through LTMS?", answer: "LTO has implemented online plain renewal through LTMS for eligible transactions. Eligibility, inspection and supporting requirements can vary, so check LTMS and current LTO issuances." },
    { question: "What are the basic motorcycle registration renewal requirements?", answer: "Start with the current registration record or official receipt, active compulsory motor-vehicle insurance and the applicable inspection or emissions requirement. Confirm the latest LTO checklist for the actual transaction." },
    { question: "How much is motorcycle registration renewal?", answer: "There is no single evergreen amount that is safe to hard-code. LTO fees, system charges and penalties can depend on the vehicle and transaction status. Use the current LTO assessment; MotoIndex's calculator is a planning estimate only." },
    { question: "Can I check or renew motorcycle registration through the LTO portal?", answer: "LTO has implemented online plain renewal through LTMS for eligible transactions. Check the current LTMS eligibility and supporting requirements before relying on the online path." }
  ],
  "transfer-of-ownership": [
    { question: "What does LTO currently require for motorcycle ownership transfer?", answer: "The 2025 motorcycle ownership rules list a duly notarized deed of conveyance or sale, OR/CR, valid HPG clearance and one valid government-issued ID among the general requirements. Additional requirements can apply to the transaction." },
    { question: "Can an unregistered motorcycle still be transferred?", answer: "The 2025 rules say transfer can be processed even when the motorcycle is not registered for the current year, but the Certificate of Registration is withheld until registration is renewed." },
    { question: "Can motorcycle ownership transfer be submitted online?", answer: "The 2025 rules contemplate in-person or online submission. Scanned copies may be used online subject to originals being produced when required, and an affidavit of authenticity is required for online submissions." }
  ],
  "deed-of-sale-motorcycle-philippines": [
    { question: "Does a motorcycle deed of sale need to be notarized for LTO transfer?", answer: "The 2025 LTO motorcycle ownership rules list a duly notarized deed of conveyance or agreement, including a deed of sale, among the general transfer requirements." },
    { question: "Is a deed of sale enough to transfer motorcycle ownership?", answer: "No. The deed is one requirement. The same LTO rule also lists OR/CR, valid HPG clearance and valid government-issued identification among the general requirements." },
    { question: "Should I buy a motorcycle using an open deed of sale?", answer: "An incomplete or open document can create identity and transfer problems. The safer path is a completed, notarized transaction document followed by formal LTO ownership transfer; unusual cases should be reviewed by a qualified professional." }
  ],
  "motorcycle-insurance": [
    { question: "Is CTPL required for motorcycle registration?", answer: "Yes. Insurance Commission guidance identifies compulsory third-party liability cover as the mandatory motor-vehicle insurance used for registration or renewal." },
    { question: "Does CTPL cover damage to my own motorcycle?", answer: "CTPL is focused on liability for third-party death or bodily injury subject to the policy. Own-damage and theft protection are typically part of comprehensive coverage, depending on the policy." },
    { question: "What is the compulsory motorcycle liability limit?", answer: "Insurance Memorandum Circular 2024-01 increased the compulsory motor-vehicle third-party liability limit to ₱200,000 for all motor-vehicle types. Verify the current policy schedule when buying." }
  ],
  "dl-code-b-motorcycle-philippines": [
    { question: "Can I drive a motorcycle if my license has DL Code B?", answer: "Not with Code B alone. Current LTO tables assign Code B to passenger vehicles and Code A to motorcycles. Your license needs the appropriate motorcycle authorization." },
    { question: "What driver’s license code is for motorcycles in the Philippines?", answer: "LTO identifies DL Code A for motorcycles and A1 for tricycles. Check the exact codes and transmission authorization printed on your license." },
    { question: "Does an automatic motorcycle require a different DL code?", answer: "The vehicle code is still A for motorcycles, but the transmission or clutch authorization matters. LTO notes that manual authorization can cover automatic, while automatic authorization does not authorize manual transmission." },
    { question: "How do I add motorcycle authorization to my license?", answer: "Use the current LTO licensing process for adding the appropriate DL code. Requirements can change, so check the latest LTO transaction guidance before applying." }
  ]
};

export function generateStaticParams() {
  return ownershipGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getOwnershipGuide(slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/ownership/${guide.slug}`,
    index: true
  });
}

export default async function OwnershipGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getOwnershipGuide(slug);
  if (!guide) return notFound();

  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/ownership/${guide.slug}`,
    about: guide.kicker,
    keywords: [guide.title, "motorcycle ownership Philippines"],
    checkedDates: [guide.lastChecked]
  });

  return <section className="page shell trust-page">
    <Breadcrumbs items={[{ label: "Ownership", href: "/ownership" }, { label: guide.title }]} />
    <div className="page-head">
      
      <h1>{guide.title}</h1>
      <p>{guide.description}</p>
      <small className="source-date">Sources checked {guide.lastChecked}</small>
    </div>

    {guide.slug === "registration-renewal" && <div className="ownership-guide-tool"><LtoRegistrationCalculator /></div>}
    {guide.slug === "motorcycle-insurance" && <div className="ownership-guide-tool"><MotorcycleInsuranceCalculator /></div>}
    {guide.slug === "dl-code-b-motorcycle-philippines" && <div className="note-box"><h2>Short answer: DL Code B alone is not a motorcycle code</h2><p>LTO assigns <strong>DL Code A</strong> to motorcycles and <strong>DL Code B</strong> to passenger vehicles. If the license only shows B, the rider should not treat that as authority to operate a motorcycle.</p><div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>DL code</th><th>LTO description</th><th>Motorcycle?</th></tr></thead><tbody><tr><td><strong>A</strong></td><td>Motorcycle</td><td>Yes</td></tr><tr><td><strong>A1</strong></td><td>Tricycle</td><td>Three-wheel / tricycle category</td></tr><tr><td><strong>B</strong></td><td>Passenger vehicle</td><td>No, not by itself</td></tr></tbody></table></div></div>}

    <div className="method-steps ownership-guide-sections">
      {guide.sections.map((section, index) => <article key={section.heading}>
        <b>{String(index + 1).padStart(2, "0")}</b>
        <h2>{section.heading}</h2>
        <p>{section.body}</p>
        {section.bullets && <ul className="checklist">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
      </article>)}
    </div>

    <div className="section-head compact"><div><h2>Check the current rule before transacting</h2><p>Government processes can change. These links are the sources used for this guide, not a substitute for the latest instruction from the agency handling your transaction.</p></div></div>
    <div className="source-ladder">
      {guide.sources.map((source) => <article key={source.url}>
        <span>{source.publisher}</span>
        <h2>{source.label}</h2>
        <div><a className="text-link" href={source.url} target="_blank" rel="noreferrer">Open official source ↗</a><small>Checked {source.checkedAt}</small></div>
      </article>)}
    </div>
    {guideFaqs[guide.slug]&&<FaqSection title={`${guide.kicker} questions`} items={guideFaqs[guide.slug]}/>}
    <JsonLd data={schema} />
    <AuthorBox />
  </section>;
}

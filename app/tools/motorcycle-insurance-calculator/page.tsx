import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MotorcycleInsuranceCalculator } from "@/components/MotorcycleInsuranceCalculator";
import { FaqSection } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Insurance Calculator Philippines",
  description: "Estimate a Philippine motorcycle insurance budget with an editable insured value, own-damage/theft rate and current CTPL quote.",
  path: "/tools/motorcycle-insurance-calculator"
});

function validValue(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed >= 10000 && parsed <= 10000000 ? parsed : 100000;
}

const exampleValue = 150000;
const exampleRate = 1.4;
const exampleOwnDamage = exampleValue * exampleRate / 100;

export default async function MotorcycleInsuranceCalculatorPage({ searchParams }: { searchParams: Promise<{ value?: string | string[]; model?: string | string[]; rate?: string | string[]; ctpl?: string | string[] }> }) {
  const query = await searchParams;
  const model = Array.isArray(query.model) ? query.model[0] : query.model;
  const one = (v?: string | string[]) => Array.isArray(v) ? v[0] : v;
  const rate = Number(one(query.rate));
  const ctpl = Number(one(query.ctpl));

  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Insurance calculator" }]} />
    <div className="page-head">
      <h1>Motorcycle insurance calculator Philippines</h1>
      <p>Estimate an annual insurance budget while keeping CTPL and comprehensive protection separate. The calculator is deliberately editable because insurer premiums, taxes, deductibles and covered risks vary.</p>
    </div>

    <MotorcycleInsuranceCalculator initialValue={validValue(query.value)} modelLabel={model?.slice(0, 80)} initialRate={Number.isFinite(rate) && rate >= 0 && rate <= 20 ? rate : 1.4} initialCtpl={Number.isFinite(ctpl) && ctpl >= 0 && ctpl <= 100000 ? ctpl : 0} />

    <section className="split section" aria-labelledby="insurance-method">
      <div>
        <span className="section-kicker">Method</span>
        <h2 id="insurance-method">How the insurance estimate works</h2>
        <p>The calculator keeps compulsory third-party liability and the planning estimate for own-damage or theft cover separate. The comprehensive component starts from the insured motorcycle value multiplied by an editable reference rate.</p>
        <p>Actual comprehensive premiums can include taxes, deductibles, different rating factors, optional cover and insurer underwriting. CTPL pricing also comes from the policy you actually buy, so its field is editable instead of being presented as one universal motorcycle premium.</p>
      </div>
      <div className="info-card">
        <h3>Use a current quote for</h3>
        <ul className="checklist">
          <li>The motorcycle value the insurer will actually use</li>
          <li>Your current CTPL premium</li>
          <li>The own-damage and theft rate or quoted premium</li>
          <li>Deductibles, participation fees and exclusions</li>
          <li>Optional cover such as acts of nature if offered</li>
        </ul>
      </div>
    </section>

    <section className="split section" aria-labelledby="insurance-example">
      <div>
        <span className="section-kicker">Worked example</span>
        <h2 id="insurance-example">Example: {php(exampleValue)} insured value</h2>
        <p>Using the calculator&apos;s 1.40% starting reference rate, {php(exampleValue)} multiplied by 1.40% produces a <strong>{php(exampleOwnDamage)}</strong> planning amount for the own-damage/theft component before other policy charges.</p>
        <p>That figure does not include CTPL, taxes, deductibles, optional cover or insurer-specific adjustments. Add the current CTPL quote separately and replace the 1.40% input whenever an insurer gives you a different rate or premium.</p>
      </div>
      <div className="info-card">
        <h3>Do not compare premiums alone</h3>
        <ul className="checklist">
          <li>Compare insured value and covered risks.</li>
          <li>Read theft, own-damage and acts-of-nature terms.</li>
          <li>Check deductibles and participation fees.</li>
          <li>Confirm claim requirements and repair arrangements.</li>
          <li>Keep CTPL and comprehensive protection distinct.</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="insurance-limitations">
      <div className="section-head compact"><div><h2 id="insurance-limitations">Assumptions and limitations</h2><p>This is a budgeting tool, not an insurer quote. It does not determine eligibility, policy wording, claims coverage or the premium an insurer will approve. Current insurer documents control whenever they differ from the calculator.</p></div></div>
      <div className="tool-crosslinks">
        <Link href="/ownership/motorcycle-insurance"><b>CTPL vs comprehensive guide</b><small>Understand what each policy type is for.</small></Link>
        <Link href="/tools/lto-registration-fee-calculator"><b>LTO registration calculator</b><small>Carry your CTPL quote into the registration budget.</small></Link>
        <Link href="/ownership/cost-calculator"><b>Full ownership cost</b><small>Combine insurance with financing, fuel, maintenance and resale.</small></Link>
      </div>
    </section>

    <section className="section" aria-labelledby="insurance-related-models">
      <div className="section-head compact"><div><h2 id="insurance-related-models">Related motorcycles to budget</h2><p>Use a current canonical model price as the starting insured-value reference, then replace it with the value shown in your actual insurer quote.</p></div></div>
      <div className="guide-strip">
        <Link href="/motorcycles/honda/pcx-160"><strong>Honda PCX160</strong><small>Check current variant pricing before setting the insured value.</small></Link>
        <Link href="/motorcycles/yamaha/nmax-v3"><strong>Yamaha NMAX V3</strong><small>Compare Standard and Tech Max price differences.</small></Link>
        <Link href="/motorcycles/cfmoto/450sr"><strong>CFMOTO 450SR</strong><small>Include sport-bike insurance in the total ownership decision.</small></Link>
      </div>
    </section>

    <div className="source-panel">
      <h2>CTPL and comprehensive insurance are different</h2>
      <p>Compulsory motor-vehicle liability insurance is required for registration and focuses on third-party bodily injury or death subject to policy terms. Insurance Memorandum Circular 2024-01 raised the compulsory liability benefit limit to ₱200,000. Comprehensive cover can add own-damage, theft and other protections depending on the insurer and policy.</p>
      <p>The 1.40% starting rate shown above comes from the Insurance Commission&apos;s published motor tariff for motorcycle own damage and theft. It is a reference input, not a promise that a current insurer will quote that rate.</p>
      <div className="source-links"><a href="https://www.insurance.gov.ph/wp-content/uploads/2022/04/Notice_Rates_MV001.pdf" target="_blank" rel="noreferrer">Insurance Commission motor tariff ↗</a><a href="https://www.insurance.gov.ph/wp-content/uploads/2024/02/IMC-2024-01_Increase-in-the-Benefits-for-Compulsory-Motor-Vehicle-Insurance-Coverage-Repost.pdf" target="_blank" rel="noreferrer">Insurance Memorandum Circular 2024-01 ↗</a></div>
    </div>

    <FaqSection title="Motorcycle insurance questions" items={[
      { question: "Is CTPL the same as comprehensive motorcycle insurance?", answer: "No. CTPL is the compulsory liability cover used for registration and focuses on third-party bodily injury or death subject to the policy. Comprehensive cover can add own-damage, theft and other protections depending on the insurer and policy." },
      { question: "What insured value should I enter?", answer: "Use the value basis shown in a current insurer quote or a realistic current motorcycle value. The prefilled model price is only a planning starting point and should be replaced when you have a formal quote." },
      { question: "Is the calculator an insurance quote?", answer: "No. It is a budgeting tool. The actual premium depends on the insurer, policy wording, deductible, taxes, optional cover and underwriting." }
    ]} />
  </section>;
}

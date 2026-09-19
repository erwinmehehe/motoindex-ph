import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LtoRegistrationCalculator } from "@/components/LtoRegistrationCalculator";
import { FaqSection } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "LTO Motorcycle Registration Fee Calculator Philippines",
  description: "Estimate a Philippine motorcycle registration budget using the current LTO motorcycle MVUC plus editable inspection, CTPL and other assessed fees.",
  path: "/tools/lto-registration-fee-calculator"
});

const exampleMvuc = 240;
const exampleInspection = 500;

export default async function LtoRegistrationFeeCalculatorPage({ searchParams }: { searchParams: Promise<{ model?: string | string[]; sidecar?: string | string[]; inspection?: string | string[]; ctpl?: string | string[]; other?: string | string[] }> }) {
  const query = await searchParams;
  const model = Array.isArray(query.model) ? query.model[0] : query.model;
  const one = (v?: string | string[]) => Array.isArray(v) ? v[0] : v;
  const money = (v?: string | string[], fallback = 0) => { const n = Number(one(v)); return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : fallback; };
  const inspectionRaw = one(query.inspection);

  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "LTO registration calculator" }]} />
    <div className="page-head">
      <h1>LTO motorcycle registration fee calculator</h1>
      <p>Build a realistic renewal budget without pretending every rider pays one fixed total. The official LTO fee schedule lists the motorcycle Motor Vehicle User&apos;s Charge at ₱240 without a sidecar and ₱300 with a sidecar; inspection, CTPL and transaction-specific charges can change the final amount.</p>
    </div>

    <LtoRegistrationCalculator modelLabel={model?.slice(0, 80)} initialSidecar={one(query.sidecar) === "1"} initialIncludeInspection={inspectionRaw !== "off"} initialInspection={inspectionRaw === "off" ? 500 : money(query.inspection, 500)} initialCtpl={money(query.ctpl)} initialOther={money(query.other)} />

    <section className="split section" aria-labelledby="registration-method">
      <div>
        <span className="section-kicker">Method</span>
        <h2 id="registration-method">How the registration estimate is built</h2>
        <p>The calculator starts with the published motorcycle MVUC and then keeps inspection, CTPL and other assessed charges as separate editable inputs. That matters because those additional costs can depend on the transaction, inspection facility, insurer and current LTO assessment.</p>
        <p>Use the output as a budget before renewal or purchase. For the amount you actually owe, follow the assessment and official receipt for your transaction rather than a generic web estimate.</p>
      </div>
      <div className="info-card">
        <h3>Bring these figures into the estimate</h3>
        <ul className="checklist">
          <li>Whether the motorcycle has a sidecar</li>
          <li>The inspection amount applicable to the transaction</li>
          <li>Your current CTPL quote</li>
          <li>Any transaction-specific fee shown in the assessment</li>
          <li>The exact registration or renewal transaction you are completing</li>
        </ul>
      </div>
    </section>

    <section className="split section" aria-labelledby="registration-example">
      <div>
        <span className="section-kicker">Worked example</span>
        <h2 id="registration-example">Example budget before CTPL and other fees</h2>
        <p>For a motorcycle without a sidecar, the published MVUC used here is {php(exampleMvuc)}. If you also use the calculator&apos;s {php(exampleInspection)} inspection planning input, those two lines total <strong>{php(exampleMvuc + exampleInspection)}</strong> before CTPL and any other assessed charge.</p>
        <p>The {php(exampleInspection)} inspection figure is an editable planning input based on the LTO material referenced below. It is not a promise that every motorcycle transaction will be charged that amount.</p>
      </div>
      <div className="info-card">
        <h3>Why the total stays editable</h3>
        <ul className="checklist">
          <li>CTPL is purchased from an insurer, not embedded in the MVUC.</li>
          <li>Inspection treatment can depend on the transaction and facility.</li>
          <li>Late, transfer or other transaction charges can change the assessment.</li>
          <li>Official LTO documents and the actual assessment control.</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="registration-limitations">
      <div className="section-head compact"><div><h2 id="registration-limitations">Assumptions and limitations</h2><p>This tool estimates a budget from published fee references plus your inputs. It does not calculate penalties, every special transaction, dealer registration packages or future fee changes. Recheck the linked LTO material and your actual transaction before paying.</p></div></div>
      <div className="tool-crosslinks">
        <Link href="/ownership/registration-renewal"><b>Registration renewal guide</b><small>Documents, timing and LTMS notes.</small></Link>
        <Link href="/tools/motorcycle-insurance-calculator"><b>Insurance calculator</b><small>Budget CTPL and comprehensive cover separately.</small></Link>
        <Link href="/ownership/cost-calculator"><b>Full ownership cost</b><small>Combine registration with financing, fuel and maintenance.</small></Link>
      </div>
    </section>

    <section className="section" aria-labelledby="registration-related-models">
      <div className="section-head compact"><div><h2 id="registration-related-models">Related motorcycles and ownership research</h2><p>Registration is only one ownership line. Start from the motorcycle&apos;s main research page, then compare the full cost rather than choosing from SRP alone.</p></div></div>
      <div className="guide-strip">
        <Link href="/motorcycles/honda/click-160"><strong>Honda Click160</strong><small>Review price, ownership and maintenance context.</small></Link>
        <Link href="/motorcycles/suzuki/raider-r150"><strong>Suzuki Raider R150 FI</strong><small>Compare purchase and ongoing ownership costs.</small></Link>
        <Link href="/motorcycles/yamaha/sniper-155"><strong>Yamaha Sniper 155</strong><small>Move from model research into financing and registration planning.</small></Link>
      </div>
    </section>

    <div className="source-panel">
      <h2>What the calculator does and does not assume</h2>
      <p>The published LTO fee materials we verified retain the ₱240/₱300 motorcycle MVUC figures. The LTO MVUC memorandum also shows a ₱500 PMVIC line for motorcycles, but actual inspection and transaction charges can depend on the transaction and facility. That is why inspection and CTPL remain editable instead of being buried in a fake universal total.</p>
      <div className="source-links"><a href="https://lto.gov.ph/wp-content/uploads/2024/05/LTO_CC_05-30-2024.pdf" target="_blank" rel="noreferrer">LTO Citizen&apos;s Charter fee schedule ↗</a><a href="https://lto.gov.ph/wp-content/uploads/2024/02/Memo_19022024mvuc.pdf" target="_blank" rel="noreferrer">LTO MVUC / inspection memo ↗</a></div>
    </div>

    <FaqSection title="LTO motorcycle registration questions" items={[
      { question: "How much is the motorcycle MVUC?", answer: "The LTO fee materials checked for this calculator list the motorcycle Motor Vehicle User's Charge at ₱240 without a sidecar and ₱300 with a sidecar. Other transaction, inspection and insurance charges are separate." },
      { question: "Does the calculator show the exact amount I will pay at LTO?", answer: "No. It is a planning estimate. Inspection, CTPL and transaction-specific assessed fees can vary, so those inputs remain editable and the amount assessed for your actual transaction controls." },
      { question: "Is CTPL included in motorcycle registration costs?", answer: "CTPL is required for registration, but its premium is an insurance cost rather than the MVUC itself. Enter your current CTPL quote separately in the calculator." }
    ]} />
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LtoRegistrationCalculator } from "@/components/LtoRegistrationCalculator";
import { pageMetadata } from "@/lib/site";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = pageMetadata({ title: "LTO Motorcycle Registration Fee Calculator Philippines", description: "Estimate a Philippine motorcycle registration budget using the current LTO motorcycle MVUC plus editable inspection, CTPL and other assessed fees.", path: "/tools/lto-registration-fee-calculator" });

export default async function LtoRegistrationFeeCalculatorPage({ searchParams }: { searchParams: Promise<{ model?: string | string[]; sidecar?: string | string[]; inspection?: string | string[]; ctpl?: string | string[]; other?: string | string[] }> }) {
  const query = await searchParams;
  const model = Array.isArray(query.model) ? query.model[0] : query.model;
  const one=(v?:string|string[])=>Array.isArray(v)?v[0]:v;
  const money=(v?:string|string[],fallback=0)=>{const n=Number(one(v));return Number.isFinite(n)&&n>=0&&n<=100000?n:fallback};
  const inspectionRaw=one(query.inspection);
  return <section className="page shell"><Breadcrumbs items={[{label:"Tools",href:"/tools"},{label:"LTO registration calculator"}]}/><div className="page-head"><h1>LTO motorcycle registration fee calculator</h1><p>Build a realistic renewal budget without pretending every rider pays one fixed total. The official LTO fee schedule lists the motorcycle Motor Vehicle User&apos;s Charge at ₱240 without a sidecar and ₱300 with a sidecar; inspection, CTPL and transaction-specific charges can change the final amount.</p></div><LtoRegistrationCalculator modelLabel={model?.slice(0,80)} initialSidecar={one(query.sidecar)==="1"} initialIncludeInspection={inspectionRaw!=="off"} initialInspection={inspectionRaw==="off"?500:money(query.inspection,500)} initialCtpl={money(query.ctpl)} initialOther={money(query.other)}/><div className="source-panel"><h2>What the calculator does — and does not — assume</h2><p>The published LTO fee materials we verified retain the ₱240/₱300 motorcycle MVUC figures. The LTO MVUC memorandum also shows a ₱500 PMVIC line for motorcycles, but actual inspection and transaction charges can depend on the transaction and facility. That is why inspection and CTPL remain editable instead of being buried in a fake universal total.</p><div className="source-links"><a href="https://lto.gov.ph/wp-content/uploads/2024/05/LTO_CC_05-30-2024.pdf" target="_blank" rel="noreferrer">LTO Citizen’s Charter fee schedule ↗</a><a href="https://lto.gov.ph/wp-content/uploads/2024/02/Memo_19022024mvuc.pdf" target="_blank" rel="noreferrer">LTO MVUC / inspection memo ↗</a></div><div className="tool-crosslinks"><Link href="/ownership/registration-renewal"><b>Registration renewal guide</b><small>Documents, timing and LTMS notes.</small></Link><Link href="/tools/motorcycle-insurance-calculator"><b>Insurance calculator</b><small>Budget CTPL and comprehensive cover separately.</small></Link><Link href="/tools/motorcycle-loan-calculator"><b>Loan calculator</b><small>Combine registration with financing planning.</small></Link></div></div><FaqSection title="LTO motorcycle registration questions" items={[
    {question:"How much is the motorcycle MVUC?",answer:"The LTO fee materials checked for this calculator list the motorcycle Motor Vehicle User’s Charge at ₱240 without a sidecar and ₱300 with a sidecar. Other transaction, inspection and insurance charges are separate."},
    {question:"Does the calculator show the exact amount I will pay at LTO?",answer:"No. It is a planning estimate. Inspection, CTPL and transaction-specific assessed fees can vary, so those inputs remain editable and the amount assessed for your actual transaction controls."},
    {question:"Is CTPL included in motorcycle registration costs?",answer:"CTPL is required for registration, but its premium is an insurance cost rather than the MVUC itself. Enter your current CTPL quote separately in the calculator."}
  ]}/></section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MotorcycleInsuranceCalculator } from "@/components/MotorcycleInsuranceCalculator";
import { pageMetadata } from "@/lib/site";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = pageMetadata({ title: "Motorcycle Insurance Calculator Philippines", description: "Estimate a Philippine motorcycle insurance budget with an editable insured value, own-damage/theft rate and current CTPL quote.", path: "/tools/motorcycle-insurance-calculator" });

function validValue(value?: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(parsed) && parsed >= 10000 && parsed <= 10000000 ? parsed : 100000;
}

export default async function MotorcycleInsuranceCalculatorPage({ searchParams }: { searchParams: Promise<{ value?: string | string[]; model?: string | string[]; rate?: string | string[]; ctpl?: string | string[] }> }) {
  const query = await searchParams;
  const model = Array.isArray(query.model) ? query.model[0] : query.model;
  const one=(v?:string|string[])=>Array.isArray(v)?v[0]:v;
  const rate=Number(one(query.rate)); const ctpl=Number(one(query.ctpl));
  return <section className="page shell"><Breadcrumbs items={[{label:"Tools",href:"/tools"},{label:"Insurance calculator"}]}/><div className="page-head"><h1>Motorcycle insurance calculator Philippines</h1><p>Estimate an annual insurance budget while keeping CTPL and comprehensive protection separate. The calculator is deliberately editable because insurer premiums, taxes, deductibles and covered risks vary.</p></div><MotorcycleInsuranceCalculator initialValue={validValue(query.value)} modelLabel={model?.slice(0,80)} initialRate={Number.isFinite(rate)&&rate>=0&&rate<=20?rate:1.4} initialCtpl={Number.isFinite(ctpl)&&ctpl>=0&&ctpl<=100000?ctpl:0}/><div className="source-panel"><h2>CTPL and comprehensive insurance are different</h2><p>Compulsory motor-vehicle liability insurance is required for registration and focuses on third-party bodily injury/death subject to policy terms. Insurance Memorandum Circular 2024-01 raised the compulsory liability benefit limit to ₱200,000. Comprehensive cover can add own-damage, theft and other protections depending on the insurer and policy.</p><p>The 1.40% starting rate shown above comes from the Insurance Commission&apos;s published motor tariff for motorcycle own damage and theft. It is a reference input, not a promise that a current insurer will quote that rate.</p><div className="source-links"><a href="https://www.insurance.gov.ph/wp-content/uploads/2022/04/Notice_Rates_MV001.pdf" target="_blank" rel="noreferrer">Insurance Commission motor tariff ↗</a><a href="https://www.insurance.gov.ph/wp-content/uploads/2024/02/IMC-2024-01_Increase-in-the-Benefits-for-Compulsory-Motor-Vehicle-Insurance-Coverage-Repost.pdf" target="_blank" rel="noreferrer">Insurance Memorandum Circular 2024-01 ↗</a></div><div className="tool-crosslinks"><Link href="/ownership/motorcycle-insurance"><b>CTPL vs comprehensive guide</b><small>Understand what each policy type is for.</small></Link><Link href="/tools/lto-registration-fee-calculator"><b>LTO registration calculator</b><small>Use your CTPL quote in the registration budget.</small></Link><Link href="/tools/motorcycle-loan-calculator"><b>Loan calculator</b><small>Plan financing before adding insurance and fees.</small></Link></div></div><FaqSection title="Motorcycle insurance questions" items={[
    {question:"Is CTPL the same as comprehensive motorcycle insurance?",answer:"No. CTPL is the compulsory liability cover used for registration and focuses on third-party bodily injury or death subject to the policy. Comprehensive cover can add own-damage, theft and other protections depending on the insurer and policy."},
    {question:"What insured value should I enter?",answer:"Use the value basis shown in a current insurer quote or a realistic current motorcycle value. The prefilled model price is only a planning starting point and should be replaced when you have a formal quote."},
    {question:"Is the calculator an insurance quote?",answer:"No. It is a budgeting tool. The actual premium depends on the insurer, policy wording, deductible, taxes, optional cover and underwriting."}
  ]}/></section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Motorcycle Calculators Philippines", description: "Free Philippine motorcycle calculators for loan payments, LTO registration budgeting, insurance and ownership costs.", path: "/tools" });

export default function ToolsPage() {
  return <section className="page shell"><Breadcrumbs items={[{label:"Tools"}]}/><div className="page-head"><h1>Motorcycle tools for the Philippines</h1><p>Plan financing, registration, insurance and ownership costs with editable assumptions and current guidance.</p></div><div className="section-head compact"><div><h2>Choose a calculator or ownership tool</h2></div></div><div className="commute-tool-grid"><Link href="/tools/electric-motorcycle-charging-cost"><span>Electric</span><h3>Electric charging-cost calculator</h3><p>Estimate a full charge, cost per 100 km and monthly electricity use.</p></Link><Link href="/tools/motorcycle-loan-calculator"><span>Financing</span><h3>Motorcycle loan calculator</h3><p>Monthly payment, financed amount, estimated interest and total cash paid.</p></Link><Link href="/tools/lto-registration-fee-calculator"><span>Registration</span><h3>LTO registration fee calculator</h3><p>Start from the motorcycle MVUC and add inspection, CTPL and transaction-specific charges.</p></Link><Link href="/tools/motorcycle-insurance-calculator"><span>Insurance</span><h3>Motorcycle insurance calculator</h3><p>Compare an editable own-damage/theft estimate with your current CTPL quote.</p></Link><Link href="/ownership/cost-calculator"><span>Ownership</span><h3>Total cost to own</h3><p>Combine purchase, financing, fuel, maintenance, registration, insurance, tires and resale.</p></Link></div></section>;
}

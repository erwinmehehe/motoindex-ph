import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publicMotorcycles } from "@/lib/data";
import { OwnershipCostCalculator } from "@/components/OwnershipCostCalculator";
export const metadata: Metadata = pageMetadata({ title: 'Motorcycle Total Cost of Ownership Calculator Philippines', description: 'Estimate 1-year and 3-year motorcycle purchase, financing, fuel, maintenance, insurance, registration, tire and resale costs.', path: '/ownership/cost-calculator', index: true });
export default function CostCalculatorPage(){const model=publicMotorcycles[0];return <section className="page shell"><Breadcrumbs items={[{label:"Ownership",href:"/ownership"},{label:"Cost calculator"}]} /><div className="page-head"><h1>Estimate what a motorcycle really costs over three years</h1><p>Start with a current model, then replace purchase, finance, fuel, maintenance, insurance, registration and tire assumptions with your own numbers.</p></div>{model&&<OwnershipCostCalculator model={model}/>}<div className="note-box"><h2>Before you use the estimate</h2><p>This is an estimate, not a dealer quote, insurance quote or official government-fee calculator. Finance APR, resale, maintenance and operating assumptions are editable and should be replaced with your real figures.</p></div></section>}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { CommuteCostCalculator } from "@/components/CommuteCostCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { forClient } from "@/lib/competitors";

export const metadata:Metadata=pageMetadata({title:"Motorcycle Commute Cost Calculator Philippines",description:"Estimate monthly motorcycle fuel, maintenance reserve, parking and cost per workday for commuting in the Philippines.",path:"/commute/cost-calculator",index:true});
export default function Page(){return <section className="page shell"><Breadcrumbs items={[{label:"Commuting",href:"/commute"},{label:"Cost calculator"}]}/><div className="page-head"><h1>What will your daily motorcycle commute cost?</h1><p>Use your real round-trip distance, workdays, gasoline price and parking. The model-specific fuel-economy basis is source-listed where available and otherwise clearly treated as an estimate.</p></div><CommuteCostCalculator models={forClient(publicMotorcycles)}/><div className="source-panel"><h2>Fuel-price source</h2><p>Use the Department of Energy&apos;s current regional/pump-price monitors to replace the default gasoline assumption with a number that matches where you actually buy fuel.</p><a className="text-link" href="https://new.doe.gov.ph/prices" target="_blank" rel="noreferrer">Open DOE Energy Prices →</a></div></section>}

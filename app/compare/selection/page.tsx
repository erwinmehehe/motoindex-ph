import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { SelectedCompareClient } from "@/components/SelectedCompareClient";

export const dynamic="force-static";
export const metadata:Metadata=pageMetadata({
  title:"Custom Motorcycle Comparison Philippines",
  description:"Compare two or three current Philippine motorcycles side by side for price, engine, rider fit, fuel, tires and braking.",
  path:"/compare/selection",
  index:false
});

export default function SelectedComparePage(){
  return <section className="page shell selected-compare-page">
    <div className="page-head selected-compare-head">
      <span className="entity-kicker">Side-by-side research</span>
      <h1>Compare your motorcycles.</h1>
      <p>Keep the selected bikes visible while you scan the price, fit and specification differences that matter.</p>
    </div>
    <SelectedCompareClient models={forClient(publicMotorcycles)}/>
  </section>;
}

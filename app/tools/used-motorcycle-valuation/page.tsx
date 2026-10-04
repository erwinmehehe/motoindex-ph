import type { Metadata } from "next";
import { UsedValuationTool } from "@/components/UsedValuationTool";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Used Motorcycle Value Philippines",
  description:"Estimate a used motorcycle's private-sale and dealer-trade planning range from verified active MotoIndex comparables, mileage, year, condition and location.",
  path:"/tools/used-motorcycle-valuation"
});

export default function UsedMotorcycleValuationPage(){
  const models=publicMotorcycles
    .filter(model=>model.marketStatus!=="discontinued")
    .map(model=>({id:model.id,make:model.make,model:model.model,makeSlug:model.makeSlug,slug:model.slug,srp:model.srp}))
    .sort((a,b)=>a.make.localeCompare(b.make)||a.model.localeCompare(b.model));

  return <main className="page shell">
    <PageHero
      kicker="Used motorcycle valuation"
      title="What is this motorcycle worth today?"
      description="Start with verified active asking prices for the same model, then adjust for model year, mileage, condition and—when enough local data exists—region. MotoIndex shows the comps and assumptions behind the estimate."
    />
    <UsedValuationTool models={models}/>
  </main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { UsedValueExplorer } from "@/components/UsedValueExplorer";

export const dynamic="force-static";
export const metadata: Metadata = pageMetadata({title:"Used Motorcycle Value Philippines",description:"Estimate one-, three- and five-year used motorcycle values by model for planning. MotoIndex does not publish unverified sample ads as live market listings.",path:"/used-motorcycles",index:false});

export default function UsedMotorcyclesPage(){
  const estimates=publicMotorcycles.map(m=>({id:m.id,make:m.make,model:m.model,href:`/motorcycles/${m.makeSlug}/${m.slug}#used`,oneYear:estimatedUsedValue(m,1),threeYear:estimatedUsedValue(m,3),fiveYear:estimatedUsedValue(m,5)}));
  return <section className="page shell used-master-page"><div className="page-head"><span className="entity-kicker">Used motorcycle planning</span><h1>Estimate used value without fake marketplace data.</h1><p>Use model-specific depreciation estimates as a planning reference. MotoIndex does not expose demo ads or pretend sample listings are live market evidence.</p></div>
    <section className="used-empty-market"><div><span className="section-kicker">Live listings</span><h2>Verified public used listings are not enabled yet.</h2><p>Until the verified-listing backend is enabled, the estimator below remains available without hitting the production database.</p></div><div className="hero-actions"><Link className="button" href="/used-motorcycles/repo">Repo price board</Link><Link className="button secondary" href="/used-motorcycles/buying-checklist">Buying checklist</Link></div></section>
    <section className="used-estimator-section"><div className="section-head compact"><div><span className="section-kicker">Planning reference</span><h2>Find a model-specific used-value estimate</h2><p>These figures use depreciation assumptions. They are not live asking prices, dealer trade-in quotes or appraisals.</p></div></div><UsedValueExplorer models={estimates}/></section>
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ElectricRangeCalculator } from "@/components/ElectricRangeCalculator";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Electric Motorcycle Range Calculator Philippines",
  description:"Estimate practical electric motorcycle range from Philippine model claims, battery setup, your daily distance and a conservative planning factor.",
  path:"/tools/electric-motorcycle-range-calculator"
});

export default function Page(){return <section className="page shell">
  <Breadcrumbs items={[{label:"Tools",href:"/tools"},{label:"Electric range calculator"}]}/>
  <div className="page-head"><span className="entity-kicker">Electric motorcycle tool</span><h1>Electric motorcycle range calculator</h1><p>Start from the published one-battery or two-battery range, then reduce it to a planning figure that fits your riding conditions.</p></div>
  <ElectricRangeCalculator/>
  <div className="note-box"><h2>Use range and charging cost together</h2><p>A range estimate tells you how often you may need to charge. The charging-cost calculator estimates what that charging can cost at your electricity rate.</p><div className="hero-actions"><Link className="button small" href="/tools/electric-motorcycle-charging-cost">Charging-cost calculator</Link><Link className="button ghost small" href="/motorcycles/electric/range-comparison">Compare published ranges</Link></div></div>
</section>;}

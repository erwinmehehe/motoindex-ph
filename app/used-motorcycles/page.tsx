import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles } from "@/lib/data";
import { estimatedUsedValue } from "@/lib/ownership";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Used Motorcycle Value Estimates Philippines",
  description: "Estimate used motorcycle value from current model records and editable depreciation assumptions. MotoIndex does not present sample listings as market data.",
  path: "/used-motorcycles",
  index:false
});

export default function UsedMotorcyclesPage(){
  return <section className="page shell">
    <div className="page-head"><h1>Estimate a motorcycle's used value.</h1><p>MotoIndex does not currently publish a live used-listing marketplace. These planning estimates use each motorcycle's recorded price and an age-based depreciation model; they are not appraisals or live asking-price observations.</p></div>
    <div className="note-box"><h2>Looking for current used-market evidence?</h2><p>MotoIndex still does not publish private-seller demo listings. Instead, use the repo price board based on current seller pages for real advertised repo-unit snapshots, then run the buying checklist before transacting.</p><div className="hero-actions"><Link className="button small" href="/used-motorcycles/repo">Repo price board</Link><Link className="button ghost small" href="/used-motorcycles/buying-checklist">Buying checklist</Link></div></div>
    <div className="section-head compact"><div><h2>Model-specific estimates</h2></div></div>
    <div className="used-value-grid">{motorcycles.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#used`}><span>{m.make}</span><h2>{m.model}</h2><div><small>1 year</small><strong>{php(estimatedUsedValue(m,1))}</strong></div><div><small>3 years</small><strong>{php(estimatedUsedValue(m,3))}</strong></div><div><small>5 years</small><strong>{php(estimatedUsedValue(m,5))}</strong></div><b>Open estimator →</b></Link>)}</div>
  </section>;
}

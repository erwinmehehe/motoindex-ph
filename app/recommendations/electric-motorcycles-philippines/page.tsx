import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Electric Motorcycles Philippines to Compare in 2026",
  description:"Compare verified Philippine electric motorcycles by price, battery options, claimed range, top speed, charging time and registration category.",
  path:"/recommendations/electric-motorcycles-philippines"
});

export default function Page(){
  const byPrice=[...electricMotorcycles].sort((a,b)=>a.priceFromPhp-b.priceFromPhp);
  const byRange=[...electricMotorcycles].sort((a,b)=>b.rangeTwoKm-a.rangeTwoKm);
  const bySpeed=[...electricMotorcycles].sort((a,b)=>b.topSpeedKph-a.topSpeedKph);
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Buying guides",href:"/recommendations"},{label:"Electric motorcycles"}]}/>
    <div className="page-head"><span className="entity-kicker">Electric buying guide</span><h1>Electric motorcycles to compare in the Philippines</h1><p>These are the locally verified electric motorcycles currently supported by MotoIndex data. Compare the battery plan, claimed range and charging time before focusing on the lowest advertised price.</p></div>
    <div className="guide-quick-picks"><div className="section-head compact"><div><h2>Quick picks</h2><p>Simple distinctions from the current verified models.</p></div></div><div className="guide-pick-grid">
      <Link href={"/motorcycles/electric/"+byPrice[0].slug}><span>Lowest starting price</span><strong>{byPrice[0].make} {byPrice[0].model}</strong><small>{php(byPrice[0].priceFromPhp)}</small></Link>
      <Link href={"/motorcycles/electric/"+byRange[0].slug}><span>Longest two-battery claim</span><strong>{byRange[0].make} {byRange[0].model}</strong><small>{byRange[0].rangeTwoKm} km</small></Link>
      <Link href={"/motorcycles/electric/"+bySpeed[0].slug}><span>Highest listed top speed</span><strong>{bySpeed[0].make} {bySpeed[0].model}</strong><small>{bySpeed[0].topSpeedKph} km/h</small></Link>
    </div></div>
    <div className="section-head compact"><div><h2>Verified electric motorcycle comparison</h2></div></div>
    <div className="guide-table-wrap"><table className="guide-comparison-table"><thead><tr><th>Model</th><th>Starting price</th><th>One battery</th><th>Two batteries</th><th>Charge time</th><th>Top speed</th></tr></thead><tbody>{electricMotorcycles.map(m=><tr key={m.slug}><th><Link href={"/motorcycles/electric/"+m.slug}>{m.make} {m.model}</Link></th><td>{php(m.priceFromPhp)}</td><td>{m.rangeOneKm} km</td><td>{m.rangeTwoKm} km</td><td>{m.chargeTwoHours} h</td><td>{m.topSpeedKph} km/h</td></tr>)}</tbody></table></div>
    <div className="note-box"><h2>Why the list is still small</h2><p>MotoIndex only adds an electric model when Philippine price, battery, range, charging and registration evidence is strong enough to support the page. Models are not added simply because they are sold in another country.</p><div className="hero-actions"><Link className="button small" href="/motorcycles/electric">Electric model hub</Link><Link className="button ghost small" href="/tools/electric-motorcycle-range-calculator">Range calculator</Link></div></div>
  </section>;
}

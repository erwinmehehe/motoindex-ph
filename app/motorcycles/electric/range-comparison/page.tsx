import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Electric Motorcycle Range Comparison Philippines",
  description:"Compare verified Philippine electric motorcycles by one-battery and two-battery range, capacity, charging time, maximum speed and price.",
  path:"/motorcycles/electric/range-comparison"
});

export default function ElectricRangeComparisonPage(){
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Electric",href:"/motorcycles/electric"},{label:"Range comparison"}]}/>
    <div className="page-head"><span className="entity-kicker">Battery and range</span><h1>Electric motorcycle range comparison</h1><p>Compare the current manufacturer claims for Philippine-market electric motorcycles using the same battery configuration.</p></div>
    <div className="comparison-table-wrap" role="region" aria-label="Electric motorcycle range comparison" tabIndex={0}>
      <table className="comparison-table"><thead><tr><th>Model</th><th>Starting price</th><th>One battery</th><th>Two batteries</th><th>One-battery range</th><th>Two-battery range</th><th>Charge time</th><th>Maximum speed</th></tr></thead>
      <tbody>{electricMotorcycles.map(model=><tr key={model.slug}><th><Link href={`/motorcycles/electric/${model.slug}`}>{model.make} {model.model}</Link></th><td>{php(model.priceFromPhp)}</td><td>{model.batteryKwh} kWh</td><td>{model.twoBatteryKwh} kWh</td><td>{model.rangeOneKm} km</td><td>{model.rangeTwoKm} km</td><td>{model.chargeOneHours}/{model.chargeTwoHours} hours</td><td>{model.topSpeedKph} km/h</td></tr>)}</tbody></table>
    </div>
    <div className="source-panel"><h2>How to read the range figures</h2><p>These are manufacturer claims, not guaranteed commuting distances. Speed, stop-and-go traffic, rider and cargo weight, hills, tire pressure, temperature and battery condition can reduce range. Compare one-battery figures with one-battery figures and two-battery figures with two-battery figures.</p></div>
  </section>;
}

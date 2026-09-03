import type { Motorcycle } from "@/lib/types";
import { observedMarketRange } from "@/lib/marketChecks";
import { php } from "@/lib/utils";

type Metric={label:string;value:(m:Motorcycle)=>number;lower?:boolean;format:(v:number)=>string};
const metrics:Metric[]=[
  {label:"Lowest starting price",value:m=>observedMarketRange(m).from,lower:true,format:php},
  {label:"Most power",value:m=>m.powerHp,format:v=>`${v} hp`},
  {label:"Lightest curb weight",value:m=>m.curbWeightKg,lower:true,format:v=>`${v} kg`},
  {label:"Lowest seat",value:m=>m.seatHeightMm,lower:true,format:v=>`${v} mm`},
  {label:"Largest fuel tank",value:m=>m.fuelTankL,format:v=>`${v} L`},
];
export function ThreeWayHighlights({models}:{models:Motorcycle[]}){return <section className="comparison-highlights"><div className="section-head compact"><div><h2>Where each model leads on the numbers</h2></div></div><div className="comparison-highlight-grid">{metrics.map(metric=>{const ordered=[...models].sort((a,b)=>metric.lower?metric.value(a)-metric.value(b):metric.value(b)-metric.value(a));const first=ordered[0];const tied=ordered.filter(m=>metric.value(m)===metric.value(first));return <article key={metric.label}><span>{metric.label}</span><strong>{tied.length>1?"Tie":first.model}</strong><small>{metric.format(metric.value(first))}</small></article>})}</div><p className="muted-copy">A leading number does not make a motorcycle better for every rider. Check fit, exact trim and intended use before deciding.</p></section>}

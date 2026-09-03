import { Fragment } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel, priceChecksForModel } from "@/lib/marketChecks";
import { getVerifiedVariantsForModel } from "@/lib/variants";

const dash="—";
const number=(value:number|undefined,suffix:string)=>typeof value==="number"?`${value.toLocaleString("en-PH")} ${suffix}`:dash;
const range=(m:Motorcycle)=>m.fuelConsumptionKmL?`${Math.round(m.fuelConsumptionKmL*m.fuelTankL).toLocaleString("en-PH")} km theoretical`:dash;
const powerToWeight=(m:Motorcycle)=>m.curbWeightKg?`${(m.powerHp/m.curbWeightKg*100).toFixed(1)} hp / 100 kg`:dash;
const variantLabel=(m:Motorcycle)=>{const variants=getVerifiedVariantsForModel(m.id);return variants.length?variants.map(v=>v.name).join(" · "):"No verified trim matrix yet";};
const checkedSources=(m:Motorcycle)=>{const checks=priceChecksForModel(m.id);return checks.length?`${checks.length} checked price source${checks.length===1?"":"s"}`:"Model source only";};

type Row={label:string;get:(m:Motorcycle)=>string;note?:string};
type Section={title:string;rows:Row[]};

const sections:Section[]=[
  {title:"Price & market",rows:[
    {label:"Observed market price",get:observedMarketPriceLabel,note:"Observed range from checked sources; not an average."},
    {label:"Checked price sources",get:checkedSources},
    {label:"Verified variants",get:variantLabel},
    {label:"Generation",get:m=>m.generation||dash},
    {label:"Market status",get:m=>m.marketStatus==="previous"?"Previous generation":m.marketStatus==="discontinued"?"Discontinued":m.marketStatus==="uncertain"?"Needs market check":"Current"},
  ]},
  {title:"Engine & performance",rows:[
    {label:"Engine displacement",get:m=>number(m.engineCc,"cc")},
    {label:"Power",get:m=>number(m.powerHp,"hp")},
    {label:"Torque",get:m=>number(m.torqueNm,"Nm")},
    {label:"Power-to-weight",get:powerToWeight,note:"Derived from published power and curb weight."},
    {label:"Transmission",get:m=>m.transmission||dash},
  ]},
  {title:"Size & everyday fit",rows:[
    {label:"Curb weight",get:m=>number(m.curbWeightKg,"kg")},
    {label:"Seat height",get:m=>number(m.seatHeightMm,"mm")},
    {label:"Ground clearance",get:m=>number(m.groundClearanceMm,"mm")},
    {label:"Category",get:m=>m.category||dash},
  ]},
  {title:"Fuel & range",rows:[
    {label:"Fuel tank",get:m=>number(m.fuelTankL,"L")},
    {label:"Published fuel economy",get:m=>m.fuelConsumptionKmL?`${m.fuelConsumptionKmL} km/L`:dash,note:"Published figures may use different test conditions."},
    {label:"Theoretical tank range",get:range,note:"Fuel economy × tank capacity; not a real-world range promise."},
  ]},
  {title:"Tires & braking",rows:[
    {label:"Front tire",get:m=>m.frontTire||dash},
    {label:"Rear tire",get:m=>m.rearTire||dash},
    {label:"Brakes / ABS",get:m=>m.abs||dash},
  ]},
  {title:"Colors & verification",rows:[
    {label:"Colors listed",get:m=>m.colors?.length?m.colors.join(" · "):dash},
    {label:"Primary source",get:m=>m.sourceLabel||dash},
    {label:"Specification checked",get:m=>m.verifiedAt||dash},
    {label:"Market price checked",get:m=>m.marketPriceCheckedAt||"See checked price sources"},
  ]},
];

export function ComparisonProductCards({models}:{models:Motorcycle[]}){
  return <div className={`compare-product-grid compare-cols-${models.length}`} aria-label="Selected motorcycles">
    {models.map(model=>{const href=`/motorcycles/${model.makeSlug}/${model.slug}`;return <article className="compare-product-card" key={model.id}>
      <EntityMedia entityType="motorcycle" entityId={model.id} className="compare-product-media" linkHref={href} showCredit={false} fallback={<Link href={href} className="media-unavailable"><span>Image unavailable</span></Link>}/>
      <div className="compare-product-copy"><span>{model.make}</span><h2>{model.model}</h2><strong>{observedMarketPriceLabel(model)}</strong><small>{model.engineCc} cc · {model.curbWeightKg} kg · {model.seatHeightMm} mm seat</small><Link href={href}>View full specs →</Link></div>
    </article>})}
  </div>;
}

export function DetailedMotorcycleCompare({models,showProducts=true}:{models:Motorcycle[];showProducts?:boolean}){
  return <div className={`detailed-compare compare-cols-${models.length}`}>
    {showProducts&&<ComparisonProductCards models={models}/>}
    <div className="compare-difference-key"><span className="difference-swatch" aria-hidden="true"/> <strong>Different values are highlighted</strong><span>to make trade-offs easier to scan.</span></div>
    <div className="compare-wrap detailed-compare-wrap" tabIndex={0} aria-label={`Scrollable comparison table for ${models.map(m=>`${m.make} ${m.model}`).join(" and ")}`}>
      <table className="compare-table detailed-compare-table">
        <thead><tr><th scope="col">Specification</th>{models.map(m=><th scope="col" key={m.id}>{m.make}<strong>{m.model}</strong></th>)}</tr></thead>
        <tbody>{sections.map(section=><Fragment key={section.title}>
          <tr className="compare-section-row" key={`${section.title}-heading`}><th colSpan={models.length+1}>{section.title}</th></tr>
          {section.rows.map(row=>{const values=models.map(row.get);const differs=new Set(values.map(v=>v.trim().toLowerCase())).size>1;return <tr key={`${section.title}-${row.label}`} className={differs?"has-difference":""}><th scope="row"><span>{row.label}</span>{row.note&&<small>{row.note}</small>}</th>{models.map((model,index)=><td key={model.id} className={differs?"compare-diff":""}>{values[index]}</td>)}</tr>})}
        </Fragment>)}</tbody>
      </table>
    </div>
    <p className="compare-source-note">Use the individual model pages for the underlying source links and dated checks. A highlighted difference is not automatically a winner; the better value depends on your use case.</p>
  </div>;
}

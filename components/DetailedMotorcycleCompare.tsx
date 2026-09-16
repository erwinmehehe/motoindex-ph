import { Fragment, type CSSProperties } from "react";
import type { Motorcycle } from "@/lib/types";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { observedMarketPriceLabel, priceChecksForModel } from "@/lib/marketChecks";
import { getVerifiedVariantsForModel } from "@/lib/variants";
import styles from "./DetailedMotorcycleCompare.module.css";

const dash="—";
const number=(value:number|undefined,suffix:string)=>typeof value==="number"?`${value.toLocaleString("en-PH")} ${suffix}`:dash;
const range=(m:Motorcycle)=>m.fuelConsumptionKmL?`${Math.round(m.fuelConsumptionKmL*m.fuelTankL).toLocaleString("en-PH")} km theoretical`:dash;
const powerToWeight=(m:Motorcycle)=>m.curbWeightKg?`${(m.powerHp/m.curbWeightKg*100).toFixed(1)} hp / 100 kg`:dash;

type Row={label:string;get:(m:Motorcycle)=>string;note?:string};
type Section={title:string;rows:Row[]};

const sections:Section[]=[
  {title:"Price & market",rows:[
    {label:"Observed market price",get:observedMarketPriceLabel,note:"Checked market range where available; not an average."},
    {label:"Generation",get:m=>m.generation||dash},
    {label:"Market status",get:m=>m.marketStatus==="previous"?"Previous generation":m.marketStatus==="discontinued"?"Discontinued":m.marketStatus==="uncertain"?"Availability needs checking":"Current"},
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
  {title:"Colors",rows:[
    {label:"Listed colors",get:m=>m.colors?.length?m.colors.join(" · "):dash},
  ]},
];

function compareStyle(count:number):CSSProperties{
  return {"--compare-count":String(count)} as CSSProperties;
}

export function ComparisonProductCards({models}:{models:Motorcycle[]}){
  return <div className={`${styles.productGrid} compare-product-grid compare-cols-${models.length}`} style={compareStyle(models.length)} aria-label="Selected motorcycles">
    {models.map(model=><MotorcycleCard key={model.id} model={model} variant="compare"/>)}
  </div>;
}

function VerificationDetails({models}:{models:Motorcycle[]}){
  return <details className={styles.verification}>
    <summary>Source and verification details</summary>
    <div className={styles.verificationGrid} style={compareStyle(models.length)}>
      {models.map(model=>{
        const checks=priceChecksForModel(model.id);
        const variants=getVerifiedVariantsForModel(model.id);
        return <article className={styles.verificationCard} key={model.id}>
          <span>{model.make}</span>
          <strong>{model.model}</strong>
          <dl>
            <div><dt>Primary source</dt><dd>{model.sourceLabel||"Model reference"}</dd></div>
            <div><dt>Spec check</dt><dd>{model.verifiedAt||"Not dated"}</dd></div>
            <div><dt>Price checks</dt><dd>{checks.length?`${checks.length} checked source${checks.length===1?"":"s"}`:"No separate market check yet"}</dd></div>
            <div><dt>Variants</dt><dd>{variants.length?variants.map(v=>v.name).join(" · "):"No separate variants verified"}</dd></div>
          </dl>
        </article>;
      })}
    </div>
  </details>;
}

export function DetailedMotorcycleCompare({models,showProducts=true}:{models:Motorcycle[];showProducts?:boolean}){
  return <div className={`${styles.compare} detailed-compare compare-cols-${models.length}`}>
    {showProducts&&<ComparisonProductCards models={models}/>}
    <div className={`${styles.key} compare-difference-key`}><span className={styles.keyDot} aria-hidden="true"/><strong>Differences are highlighted</strong><span>so the trade-offs are easier to scan.</span></div>
    <div className={`${styles.tableShell} compare-wrap detailed-compare-wrap`} tabIndex={0} aria-label={`Scrollable comparison table for ${models.map(m=>`${m.make} ${m.model}`).join(" and ")}`}>
      <table className={`${styles.table} compare-table detailed-compare-table`}>
        <thead><tr><th scope="col">Specification</th>{models.map(m=><th scope="col" key={m.id}>{m.make}<strong>{m.model}</strong></th>)}</tr></thead>
        <tbody>{sections.map(section=><Fragment key={section.title}>
          <tr className={`${styles.sectionRow} compare-section-row`}><th colSpan={models.length+1}>{section.title}</th></tr>
          {section.rows.map(row=>{const values=models.map(row.get);const differs=new Set(values.map(v=>v.trim().toLowerCase())).size>1;return <tr key={`${section.title}-${row.label}`} className={differs?"has-difference":""}><th scope="row"><span>{row.label}</span>{row.note&&<small>{row.note}</small>}</th>{models.map((model,index)=><td key={model.id} className={differs?`${styles.diff} compare-diff`:undefined}>{values[index]}</td>)}</tr>})}
        </Fragment>)}</tbody>
      </table>
    </div>
    <VerificationDetails models={models}/>
    <p className={`${styles.sourceNote} compare-source-note`}>Open an individual model page for the underlying links and dated source checks. A highlighted difference is not automatically better; the useful choice depends on how you ride.</p>
  </div>;
}

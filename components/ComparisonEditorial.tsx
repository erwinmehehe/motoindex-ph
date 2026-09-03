import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import type { ComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { observedMarketRange, observedMarketPriceLabel } from "@/lib/marketChecks";
import { getVerifiedVariantsForModel } from "@/lib/variants";
import { php } from "@/lib/utils";

const dash = "Not yet normalized";
const signed=(n:number,unit:string)=>`${Math.abs(n).toLocaleString("en-PH",{maximumFractionDigits:1})} ${unit}`;
const absListed=(m:Motorcycle)=>/\bABS\b/i.test(m.abs)&&!/^No ABS/i.test(m.abs);
const ptw=(m:Motorcycle)=>m.curbWeightKg ? m.powerHp/m.curbWeightKg*100 : 0;

function comparisonSentence(label:string,a:Motorcycle,b:Motorcycle,aValue:number|undefined,bValue:number|undefined,unit:string,lowerWins=false){
  if(typeof aValue!=="number"||typeof bValue!=="number") return `${label}: the current model records do not contain a comparable value for both motorcycles.`;
  if(aValue===bValue) return `${label}: both records list ${aValue.toLocaleString("en-PH")} ${unit}.`;
  const aLeads=lowerWins?aValue<bValue:aValue>bValue;
  const lead=aLeads?a:b;
  const other=aLeads?b:a;
  return `${label}: ${lead.model} ${lowerWins?"is":"has"} ${signed(aValue-bValue,unit)} ${lowerWins?"lower":"more"} than ${other.model}.`;
}

function keyDifferences(a:Motorcycle,b:Motorcycle){
  const aPrice=observedMarketRange(a).from,bPrice=observedMarketRange(b).from;
  const rows=[
    aPrice!==bPrice?`${aPrice<bPrice?a.model:b.model} starts ${php(Math.abs(aPrice-bPrice))} lower in the current observed-price records.`:`Both currently start at ${php(aPrice)} in the checked price records.`,
    a.curbWeightKg!==b.curbWeightKg?`${a.curbWeightKg<b.curbWeightKg?a.model:b.model} is ${Math.abs(a.curbWeightKg-b.curbWeightKg)} kg lighter by published curb weight.`:`Both list ${a.curbWeightKg} kg curb weight.`,
    a.seatHeightMm!==b.seatHeightMm?`${a.seatHeightMm<b.seatHeightMm?a.model:b.model} has a ${Math.abs(a.seatHeightMm-b.seatHeightMm)} mm lower published seat.`:`Both list a ${a.seatHeightMm} mm seat height.`,
    a.powerHp!==b.powerHp?`${a.powerHp>b.powerHp?a.model:b.model} lists ${Math.abs(a.powerHp-b.powerHp).toFixed(1)} hp more.`:`Both list ${a.powerHp} hp.`,
    a.fuelTankL!==b.fuelTankL?`${a.fuelTankL>b.fuelTankL?a.model:b.model} carries ${Math.abs(a.fuelTankL-b.fuelTankL).toFixed(1)} L more fuel capacity.`:`Both list a ${a.fuelTankL} L tank.`,
  ];
  if(typeof a.groundClearanceMm==="number"&&typeof b.groundClearanceMm==="number"&&a.groundClearanceMm!==b.groundClearanceMm) rows.push(`${a.groundClearanceMm>b.groundClearanceMm?a.model:b.model} has ${Math.abs(a.groundClearanceMm-b.groundClearanceMm)} mm more published ground clearance.`);
  if(typeof a.fuelConsumptionKmL==="number"&&typeof b.fuelConsumptionKmL==="number"&&a.fuelConsumptionKmL!==b.fuelConsumptionKmL) rows.push(`${a.fuelConsumptionKmL>b.fuelConsumptionKmL?a.model:b.model} has the higher published fuel-economy figure by ${Math.abs(a.fuelConsumptionKmL-b.fuelConsumptionKmL).toFixed(1)} km/L; test conditions may differ.`);
  return rows.slice(0,6);
}

function advantages(model:Motorcycle,other:Motorcycle){
  const items:string[]=[];
  const price=observedMarketRange(model).from,otherPrice=observedMarketRange(other).from;
  if(price<otherPrice)items.push(`${php(otherPrice-price)} lower observed starting price`);
  if(model.powerHp>other.powerHp)items.push(`${(model.powerHp-other.powerHp).toFixed(1)} hp more published power`);
  if(model.torqueNm>other.torqueNm)items.push(`${(model.torqueNm-other.torqueNm).toFixed(1)} Nm more published torque`);
  if(model.curbWeightKg<other.curbWeightKg)items.push(`${other.curbWeightKg-model.curbWeightKg} kg lower curb weight`);
  if(model.seatHeightMm<other.seatHeightMm)items.push(`${other.seatHeightMm-model.seatHeightMm} mm lower published seat`);
  if((model.groundClearanceMm??-1)>(other.groundClearanceMm??-1)&&typeof other.groundClearanceMm==="number")items.push(`${(model.groundClearanceMm??0)-(other.groundClearanceMm??0)} mm more ground clearance`);
  if(model.fuelTankL>other.fuelTankL)items.push(`${(model.fuelTankL-other.fuelTankL).toFixed(1)} L larger fuel tank`);
  if((model.fuelConsumptionKmL??-1)>(other.fuelConsumptionKmL??-1)&&typeof other.fuelConsumptionKmL==="number")items.push(`${((model.fuelConsumptionKmL??0)-(other.fuelConsumptionKmL??0)).toFixed(1)} km/L higher published fuel-economy figure`);
  if(ptw(model)>ptw(other))items.push(`${(ptw(model)-ptw(other)).toFixed(1)} hp/100 kg higher derived power-to-weight figure`);
  return items.slice(0,4);
}

function sectionCopy(title:string,a:Motorcycle,b:Motorcycle){
  const t=title.toLowerCase();
  if(t.includes("price")) return `${a.model} is currently ${observedMarketPriceLabel(a)}; ${b.model} is ${observedMarketPriceLabel(b)}. These are dated observed records, not a promise of dealer inventory or final transaction price.`;
  if(t.includes("power-to-weight")) return `${a.model}: ${ptw(a).toFixed(1)} hp/100 kg. ${b.model}: ${ptw(b).toFixed(1)} hp/100 kg. This is derived from published power and curb weight and should not be treated as an acceleration or top-speed result.`;
  if(t.includes("engine")||t.includes("horsepower")||t.includes("power and torque")||t.includes("performance")) return `${a.model} lists ${a.engineCc} cc, ${a.powerHp} hp and ${a.torqueNm} Nm; ${b.model} lists ${b.engineCc} cc, ${b.powerHp} hp and ${b.torqueNm} Nm. Output figures are compared on paper only; gearing and test methods are not normalized here.`;
  if(t.includes("weight")||t.includes("lighter")) return comparisonSentence("Curb weight",a,b,a.curbWeightKg,b.curbWeightKg,"kg",true)+" Lower published weight can be relevant at parking and low speeds, but does not by itself prove easier handling.";
  if(t.includes("seat")) return comparisonSentence("Seat height",a,b,a.seatHeightMm,b.seatHeightMm,"mm",true)+" Seat width, suspension sag, rider proportions and footwear also affect actual ground reach.";
  if(t.includes("ground clearance")||t.includes("clearance")) return comparisonSentence("Ground clearance",a,b,a.groundClearanceMm,b.groundClearanceMm,"mm",false);
  if(t.includes("fuel")||t.includes("tank")||t.includes("consumption")||t.includes("economy")) {
    const tank=`${a.model} lists a ${a.fuelTankL} L tank; ${b.model} lists ${b.fuelTankL} L.`;
    const economy=typeof a.fuelConsumptionKmL==="number"&&typeof b.fuelConsumptionKmL==="number"?` Published fuel-economy figures are ${a.fuelConsumptionKmL} and ${b.fuelConsumptionKmL} km/L respectively, but source test conditions can differ.`:" MotoIndex does not yet have directly comparable published fuel-economy figures for both records.";
    return tank+economy;
  }
  if(t.includes("brake")||t.includes("abs")||t.includes("traction")) return `${a.model}: ${a.abs}. ${b.model}: ${b.abs}. Variant-specific equipment can differ, so check the exact variant and the linked model sources before buying.`;
  if(t.includes("tire")||t.includes("wheel")) return `${a.model} lists ${a.frontTire} front / ${a.rearTire} rear. ${b.model} lists ${b.frontTire} front / ${b.rearTire} rear. Wheel and tire sizes are specifications, not a standalone handling score.`;
  if(t.includes("transmission")) return `${a.model}: ${a.transmission??dash}. ${b.model}: ${b.transmission??dash}.`;
  if(t.includes("storage")) return `MotoIndex does not yet list a directly comparable storage-capacity figure for both motorcycles. The comparison therefore does not invent a liters figure; check the individual model pages and linked manufacturer information.`;
  if(t.includes("dimension")||t.includes("overall size")) return `MotoIndex currently normalizes curb weight, seat height${typeof a.groundClearanceMm==="number"||typeof b.groundClearanceMm==="number"?", ground clearance":""} and tire sizes for this pair. Full length/width/wheelbase data is not yet normalized for both records, so this section avoids fabricated dimensional claims.`;
  if(t.includes("suspension")) return `Suspension travel and component specifications are not yet normalized for both current records. MotoIndex keeps this section explicit rather than converting styling or category labels into an unsupported suspension-quality claim.`;
  if(t.includes("technology")||t.includes("features")) {
    const av=getVerifiedVariantsForModel(a.id).flatMap(v=>v.differentiators).slice(0,5),bv=getVerifiedVariantsForModel(b.id).flatMap(v=>v.differentiators).slice(0,5);
    return `${a.model}: ${av.length?av.join("; "):"no normalized multi-variant feature matrix yet"}. ${b.model}: ${bv.length?bv.join("; "):"no normalized multi-variant feature matrix yet"}.`;
  }
  if(t.includes("city")||t.includes("traffic")||t.includes("tight budget")||t.includes("urban")) return `For city-use planning, the recorded differences are price, curb weight, seat height, tank size and braking equipment. ${a.curbWeightKg<b.curbWeightKg?a.model:b.model} is lighter on paper, while ${observedMarketRange(a).from<observedMarketRange(b).from?a.model:b.model} has the lower observed starting price. Those facts can inform a choice without claiming one motorcycle is universally easier in traffic.`;
  if(t.includes("longer")||t.includes("longer-distance")||t.includes("longer trips")) return `${a.fuelTankL>b.fuelTankL?a.model:b.model} has the larger published fuel tank. Tank size, published economy and ground clearance can help trip planning, but MotoIndex does not infer long-distance comfort from specifications alone.`;
  if(t.includes("shorter riders")||t.includes("lower-seat shopper")) return `${a.seatHeightMm<b.seatHeightMm?a.model:b.model} has the lower published seat by ${Math.abs(a.seatHeightMm-b.seatHeightMm)} mm. That is useful context, not a guarantee of rider fit.`;
  if(t.includes("more affordable")||t.includes("costs less")||t.includes("cheaper")) return `${observedMarketRange(a).from<observedMarketRange(b).from?a.model:b.model} has the lower observed starting price in the current checked records.`;
  return `The current MotoIndex records compare ${a.model} and ${b.model} using dated prices and published specifications. Where the requested field is not normalized for both motorcycles, the page says so rather than filling the gap with an unsupported claim.`;
}

function faqAnswer(question:string,a:Motorcycle,b:Motorcycle){
  const q=question.toLowerCase(),ap=observedMarketRange(a).from,bp=observedMarketRange(b).from;
  if(q.includes("cheaper")||q.includes("costs less")) return ap===bp?`Both currently start at ${php(ap)} in the checked records.`:`${ap<bp?a.model:b.model} has the lower observed starting price: ${php(Math.min(ap,bp))} versus ${php(Math.max(ap,bp))}.`;
  if(q.includes("faster")||q.includes("more power")||q.includes("horsepower")) return a.powerHp===b.powerHp?`Both list ${a.powerHp} hp.`:`${a.powerHp>b.powerHp?a.model:b.model} lists more power on paper: ${Math.max(a.powerHp,b.powerHp)} hp versus ${Math.min(a.powerHp,b.powerHp)} hp. This does not prove real-world acceleration or top speed.`;
  if(q.includes("lighter")) return a.curbWeightKg===b.curbWeightKg?`Both list ${a.curbWeightKg} kg curb weight.`:`${a.curbWeightKg<b.curbWeightKg?a.model:b.model} is lighter by ${Math.abs(a.curbWeightKg-b.curbWeightKg)} kg.`;
  if(q.includes("lower seat")||q.includes("seat shopper")) return a.seatHeightMm===b.seatHeightMm?`Both list a ${a.seatHeightMm} mm seat.`:`${a.seatHeightMm<b.seatHeightMm?a.model:b.model} has the lower published seat by ${Math.abs(a.seatHeightMm-b.seatHeightMm)} mm.`;
  if(q.includes("ground clearance")||q.includes("more clearance")) return typeof a.groundClearanceMm==="number"&&typeof b.groundClearanceMm==="number"?`${a.groundClearanceMm>b.groundClearanceMm?a.model:b.model} lists more ground clearance: ${Math.max(a.groundClearanceMm,b.groundClearanceMm)} mm versus ${Math.min(a.groundClearanceMm,b.groundClearanceMm)} mm.`:"Ground clearance is not yet normalized for both current records.";
  if(q.includes("larger fuel tank")||q.includes("larger tank")) return a.fuelTankL===b.fuelTankL?`Both list a ${a.fuelTankL} L tank.`:`${a.fuelTankL>b.fuelTankL?a.model:b.model} has the larger tank: ${Math.max(a.fuelTankL,b.fuelTankL)} L versus ${Math.min(a.fuelTankL,b.fuelTankL)} L.`;
  if(q.includes("fuel economy")) return typeof a.fuelConsumptionKmL==="number"&&typeof b.fuelConsumptionKmL==="number"?`${a.fuelConsumptionKmL>b.fuelConsumptionKmL?a.model:b.model} has the higher published figure: ${Math.max(a.fuelConsumptionKmL,b.fuelConsumptionKmL)} km/L versus ${Math.min(a.fuelConsumptionKmL,b.fuelConsumptionKmL)} km/L. Test conditions may differ.`:"MotoIndex does not yet have directly comparable published fuel-economy figures for both current records.";
  if(q.includes("storage")) return "MotoIndex does not yet have a normalized storage-capacity field for both records, so this comparison does not manufacture a liters figure. Use the individual model pages and their source links for manufacturer storage information.";
  if(q.includes("abs")||q.includes("braking")) return `${a.model}: ${a.abs}. ${b.model}: ${b.abs}. Exact trim equipment can differ.`;
  if(q.includes("torque")) return a.torqueNm===b.torqueNm?`Both list ${a.torqueNm} Nm.`:`${a.torqueNm>b.torqueNm?a.model:b.model} lists more torque on paper: ${Math.max(a.torqueNm,b.torqueNm)} Nm versus ${Math.min(a.torqueNm,b.torqueNm)} Nm.`;
  if(q.includes("variants")) return `${a.model}: ${getVerifiedVariantsForModel(a.id).map(v=>`${v.name} ${php(v.srpPhp)}`).join(", ")||"no multi-variant matrix"}. ${b.model}: ${getVerifiedVariantsForModel(b.id).map(v=>`${v.name} ${php(v.srpPhp)}`).join(", ")||"no multi-variant matrix"}.`;
  if(q.includes("wheel")) return `${a.model}: ${a.frontTire} front / ${a.rearTire} rear. ${b.model}: ${b.frontTire} front / ${b.rearTire} rear.`;
  return `See the quick comparison and full specification table above. MotoIndex uses the current checked price and specification records and labels fields that are not yet normalized.`;
}

function VariantPanel({model}:{model:Motorcycle}){
  const variants=getVerifiedVariantsForModel(model.id);
  return <article><h3>{model.make} {model.model}</h3>{variants.length?<div className="comparison-variant-list">{variants.map(v=><div key={v.id}><span>{v.name}</span><strong>{php(v.srpPhp)}</strong><small>{v.braking||v.differentiators.slice(0,2).join(" · ")}</small></div>)}</div>:<p><strong>{observedMarketPriceLabel(model)}</strong><br/><small>No verified multi-variant matrix is stored yet; the model-level observed price is shown instead.</small></p>}</article>;
}

export function ComparisonEditorial({a,b,brief,phase="all"}:{a:Motorcycle;b:Motorcycle;brief:ComparisonEditorialBrief;phase?:"all"|"pre"|"post"}){
  const diffs=keyDifferences(a,b),aAdvantages=advantages(a,b),bAdvantages=advantages(b,a);
  const pre=<>
    {brief.note&&<div className="note-box comparison-intent-note"><h2>Comparison scope</h2><p>{brief.note}</p>{brief.related?.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</div>}
    <section className="comparison-quick" aria-labelledby="quick-comparison-heading">
      <div className="section-head compact"><div><span>At a glance</span><h2 id="quick-comparison-heading">Quick comparison</h2></div></div>
      <div className="compare-wrap"><table className="compare-table comparison-quick-table"><thead><tr><th>Specification</th><th>{a.model}</th><th>{b.model}</th></tr></thead><tbody>
        <tr><th>Starting price</th><td>{php(observedMarketRange(a).from)}</td><td>{php(observedMarketRange(b).from)}</td></tr>
        <tr><th>Engine</th><td>{a.engineCc} cc</td><td>{b.engineCc} cc</td></tr>
        <tr><th>Power</th><td>{a.powerHp} hp</td><td>{b.powerHp} hp</td></tr>
        <tr><th>Weight</th><td>{a.curbWeightKg} kg</td><td>{b.curbWeightKg} kg</td></tr>
        <tr><th>Seat</th><td>{a.seatHeightMm} mm</td><td>{b.seatHeightMm} mm</td></tr>
        <tr><th>Tank</th><td>{a.fuelTankL} L</td><td>{b.fuelTankL} L</td></tr>
        <tr><th>ABS / brakes</th><td>{a.abs}</td><td>{b.abs}</td></tr>
      </tbody></table></div>
    </section>
    <section className="comparison-key-differences"><div className="section-head compact"><div><span>Calculated from current records</span><h2>Key differences</h2></div></div><div className="comparison-difference-list">{diffs.map(d=><div key={d}>{d}</div>)}</div></section>
    <section className="comparison-variants"><div className="section-head compact"><div><span>Where verified</span><h2>Current variants and prices</h2></div></div><div className="comparison-variant-grid"><VariantPanel model={a}/><VariantPanel model={b}/></div></section>
  </>;
  const post=<>
    <section className="comparison-editorial-sections"><div className="section-head"><div><span>Buyer questions</span><h2>What the differences mean</h2></div></div>{brief.sections.map(title=><article key={title}><h3>{title}</h3><p>{sectionCopy(title,a,b)}</p></article>)}</section>
    <section className="comparison-decision"><div className="section-head compact"><div><span>No generic score</span><h2>Which one should you choose?</h2></div></div><div className="comparison-decision-grid"><article><h3>Choose {a.model} if</h3><ul>{(aAdvantages.length?aAdvantages:[`you prefer the exact ${a.abs} package recorded for this model`]).map(x=><li key={x}>{x}</li>)}</ul></article><article><h3>Choose {b.model} if</h3><ul>{(bAdvantages.length?bAdvantages:[`you prefer the exact ${b.abs} package recorded for this model`]).map(x=><li key={x}>{x}</li>)}</ul></article></div><p className="muted-copy">These are factual advantages from the current model records, not an overall score or universal winner.</p></section>
    <section className="comparison-methodology note-box"><h2>How MotoIndex compares these motorcycles</h2><p>MotoIndex compares current Philippine-market motorcycle records using observed prices and published specifications. Differences shown on this page are calculated from the current records. Variant-specific equipment may differ. A numerical lead is not automatically a better motorcycle for every rider.</p><p><strong>Last specification checks:</strong> {a.model} {a.verifiedAt}; {b.model} {b.verifiedAt}. <strong>Price checks:</strong> {a.marketPriceCheckedAt||a.verifiedAt}; {b.marketPriceCheckedAt||b.verifiedAt}.</p></section>
    <section className="comparison-faqs"><div className="section-head compact"><div><h2>FAQs</h2></div></div>{brief.faqs.map(q=><details key={q}><summary>{q}</summary><p>{faqAnswer(q,a,b)}</p></details>)}</section>
    {brief.related?.length&&!brief.note?<div className="comparison-related-inline">{brief.related.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</div>:null}
  </>;
  if(phase==="pre")return pre;
  if(phase==="post")return post;
  return <>{pre}{post}</>;
}

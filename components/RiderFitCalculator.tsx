"use client";
import { useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";

function absAvailable(m:Motorcycle){return /\bABS\b/i.test(m.abs)&&!/^No ABS/i.test(m.abs)}
export function RiderFitCalculator({model}:{model:Motorcycle}){
  const [inseam,setInseam]=useState(30);
  const [passenger,setPassenger]=useState(false);
  const [traffic,setTraffic]=useState("heavy");
  const [highway,setHighway]=useState(false);
  const [luggage,setLuggage]=useState(false);
  const result=useMemo(()=>{const notes:string[]=[];const inseamMm=inseam*25.4;const delta=model.seatHeightMm-inseamMm;if(delta<=25){notes.push("published seat height is close to the selected inseam") }else if(delta<=60){notes.push("published seat height sits moderately above the selected inseam") }else{notes.push("published seat height is well above the selected inseam")}
    if(traffic==="heavy"){if(model.curbWeightKg<=120)notes.push(`${model.curbWeightKg} kg curb weight may be easier to manage at low speed`);if(model.transmission==="Automatic")notes.push("automatic transmission removes clutch work in stop-go traffic")}
    if(passenger){if(/premium|maxi|adventure|touring/i.test(model.category))notes.push("this category is commonly used for longer or two-up riding");else notes.push("passenger comfort needs an in-person check on this layout")}
    if(highway){if(model.engineCc>=150)notes.push(`${model.engineCc} cc engine class`);else notes.push("smaller engine class may feel more limited on faster roads");if(absAvailable(model))notes.push("ABS is listed")}
    if(luggage&&/business|adventure|premium|maxi|scooter/i.test(model.category))notes.push("common luggage options exist for this type of motorcycle")
    return {notes:[...new Set(notes)].slice(0,6),delta:Math.round(delta)}},[model,inseam,passenger,traffic,highway,luggage]);
  const deltaLabel=result.delta===0?"0 mm":`${result.delta>0?"+":""}${result.delta} mm`;
  return <div className="rider-fit-tool"><div className="rider-fit-score"><span>Seat-height gap</span><strong>{deltaLabel}</strong><small>Published seat height minus your selected inseam. Seat width, suspension sag, footwear and technique affect actual reach.</small></div><div className="rider-fit-fields"><label>Inseam <b>{inseam} in</b><input type="range" min="26" max="38" value={inseam} onChange={e=>setInseam(Number(e.target.value))}/></label><label>Traffic <select value={traffic} onChange={e=>setTraffic(e.target.value)}><option value="heavy">Heavy stop-go</option><option value="mixed">Mixed</option><option value="light">Mostly open roads</option></select></label><label className="check-control"><input type="checkbox" checked={passenger} onChange={e=>setPassenger(e.target.checked)}/> Frequent passenger</label><label className="check-control"><input type="checkbox" checked={highway} onChange={e=>setHighway(e.target.checked)}/> Faster-road / highway use</label><label className="check-control"><input type="checkbox" checked={luggage} onChange={e=>setLuggage(e.target.checked)}/> Regular luggage</label></div><div className="rider-fit-notes"><p>These notes use published dimensions and the preferences above. Sit on the exact motorcycle before buying.</p>{result.notes.map(note=><span key={note}>{note}</span>)}</div></div>;
}

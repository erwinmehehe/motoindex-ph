"use client";

import { useEffect, useMemo, useState } from "react";

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}
function safeMoney(value: number) { return Number.isFinite(value) ? Math.max(0, Math.min(100000, value)) : 0; }

type Props={modelLabel?:string;initialSidecar?:boolean;initialInspection?:number;initialCtpl?:number;initialOther?:number;initialIncludeInspection?:boolean};
export function LtoRegistrationCalculator({ modelLabel, initialSidecar=false, initialInspection=500, initialCtpl=0, initialOther=0, initialIncludeInspection=true }: Props) {
  const [sidecar, setSidecar] = useState(initialSidecar);
  const [includeInspection, setIncludeInspection] = useState(initialIncludeInspection);
  const [inspection, setInspection] = useState(safeMoney(initialInspection));
  const [ctpl, setCtpl] = useState(safeMoney(initialCtpl));
  const [other, setOther] = useState(safeMoney(initialOther));
  const [copied,setCopied]=useState(false);

  const result = useMemo(() => {
    const mvuc = sidecar ? 300 : 240;
    const inspectionAmount = includeInspection ? safeMoney(inspection) : 0;
    const insuranceAmount = safeMoney(ctpl);
    const otherAmount = safeMoney(other);
    return { mvuc, inspectionAmount, insuranceAmount, otherAmount, total: mvuc + inspectionAmount + insuranceAmount + otherAmount };
  }, [sidecar, includeInspection, inspection, ctpl, other]);

  useEffect(()=>{const p=new URLSearchParams();if(modelLabel)p.set("model",modelLabel);if(sidecar)p.set("sidecar","1");if(!includeInspection)p.set("inspection","off");else if(result.inspectionAmount!==500)p.set("inspection",String(result.inspectionAmount));if(result.insuranceAmount)p.set("ctpl",String(result.insuranceAmount));if(result.otherAmount)p.set("other",String(result.otherAmount));window.history.replaceState(null,"",`${window.location.pathname}${p.size?`?${p.toString()}`:""}`)},[modelLabel,sidecar,includeInspection,result.inspectionAmount,result.insuranceAmount,result.otherAmount]);
  function reset(){setSidecar(initialSidecar);setIncludeInspection(initialIncludeInspection);setInspection(safeMoney(initialInspection));setCtpl(safeMoney(initialCtpl));setOther(safeMoney(initialOther));}
  async function copy(){const text=`${modelLabel?`${modelLabel}: `:""}LTO registration planning total ${peso(result.total)} — MVUC ${peso(result.mvuc)}, inspection ${peso(result.inspectionAmount)}, CTPL ${peso(result.insuranceAmount)}, other ${peso(result.otherAmount)}. ${window.location.href}`;await navigator.clipboard?.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}

  return <section className="fee-tool">
    <div className="fee-copy"><h2>{modelLabel ? `${modelLabel} registration budget` : "Estimate a motorcycle registration budget"}</h2><p>The calculator anchors the estimate on the current LTO MVUC schedule for motorcycles, then lets you add the inspection, CTPL and transaction-specific amounts that apply to your renewal.</p><div className="fee-primary" aria-live="polite"><span>Planning total</span><strong>{peso(result.total)}</strong><small>Core MVUC is {peso(result.mvuc)} before variable charges.</small></div></div>
    <div className="fee-fields">
      <label className="check-control"><input type="checkbox" checked={sidecar} onChange={(event)=>setSidecar(event.target.checked)}/> Motorcycle has a sidecar</label>
      <label className="check-control"><input type="checkbox" checked={includeInspection} onChange={(event)=>setIncludeInspection(event.target.checked)}/> Include inspection estimate</label>
      <label>Inspection / PMVIC amount <b>{peso(safeMoney(inspection))}</b><input type="number" min="0" max="100000" step="50" disabled={!includeInspection} value={inspection} onChange={(event)=>setInspection(Number(event.target.value))}/></label>
      <div className="calc-presets" aria-label="Inspection presets"><button type="button" onClick={()=>{setIncludeInspection(true);setInspection(500)}}>₱500 inspection</button><button type="button" onClick={()=>setIncludeInspection(false)}>No inspection</button></div>
      <label>CTPL premium from your insurer <b>{peso(safeMoney(ctpl))}</b><input type="number" min="0" max="100000" step="50" value={ctpl} onChange={(event)=>setCtpl(Number(event.target.value))}/></label>
      <label>Other assessed fees <b>{peso(safeMoney(other))}</b><input type="number" min="0" max="100000" step="10" value={other} onChange={(event)=>setOther(Number(event.target.value))}/></label>
      <div className="calc-actions"><button type="button" className="button ghost small" onClick={reset}>Reset</button><button type="button" className="button small" onClick={copy}>{copied?"Copied ✓":"Copy calculation"}</button></div>
    </div>
    <div className="fee-breakdown"><span><small>Motor Vehicle User's Charge</small><b>{peso(result.mvuc)}</b></span><span><small>Inspection</small><b>{peso(result.inspectionAmount)}</b></span><span><small>CTPL input</small><b>{peso(result.insuranceAmount)}</b></span><span><small>Other assessed fees</small><b>{peso(result.otherAmount)}</b></span></div>
  </section>;
}

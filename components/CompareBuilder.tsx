"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { trackEvent } from "@/lib/track";

export function CompareBuilder({ models }: { models: Motorcycle[] }) {
  const router=useRouter();const options=useMemo(()=>[...models].sort((a,b)=>`${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)),[models]);
  const [aSlug,setASlug]=useState(options[0]?.slug||""),[bSlug,setBSlug]=useState(options.find(m=>m.slug!==options[0]?.slug)?.slug||""),[cSlug,setCSlug]=useState("");
  const a=options.find(m=>m.slug===aSlug),b=options.find(m=>m.slug===bSlug),c=options.find(m=>m.slug===cSlug);const ready=Boolean(a&&b&&a.slug!==b.slug);const ready3=Boolean(ready&&c&&c.slug!==a?.slug&&c.slug!==b?.slug);
  const picker=(label:string,value:string,set:(v:string)=>void,optional=false)=><label><span>{label}</span><select value={value} onChange={e=>set(e.target.value)}>{optional&&<option value="">None / two-way only</option>}{options.map(m=><option key={m.id} value={m.slug}>{m.make} {m.model}</option>)}</select>{value&&(()=>{const m=options.find(x=>x.slug===value);return m?<small>{observedMarketPriceLabel(m)} · {m.engineCc} cc · {m.seatHeightMm} mm seat</small>:null})()}</label>;
  function goTwo(){if(!ready||!a||!b)return;trackEvent("compare_build",{count:2,a:a.id,b:b.id});router.push(`/compare/${a.slug}-vs-${b.slug}`)}
  function goThree(){if(!ready3||!a||!b||!c)return;trackEvent("compare_build",{count:3,a:a.id,b:b.id,c:c.id});router.push(`/compare/three?bikes=${a.slug},${b.slug},${c.slug}`)}
  return <div className="compare-builder"><div className="compare-builder-head"><div><h2>Compare two or three motorcycles</h2><p>Price, engine, dimensions, tires and braking data come from the same records used on the motorcycle pages.</p></div><span className="compare-count">{options.length} models</span></div><div className="compare-picker-grid three-picker">{picker("Motorcycle A",aSlug,setASlug)}<div className="compare-vs">VS</div>{picker("Motorcycle B",bSlug,setBSlug)}{picker("Motorcycle C (optional)",cSlug,setCSlug,true)}</div><div className="compare-actions"><button className="button" disabled={!ready} onClick={goTwo}>Compare two →</button><button className="button ghost on-dark" disabled={!ready3} onClick={goThree}>Compare three →</button></div></div>;
}

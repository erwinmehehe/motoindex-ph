"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { trackEvent } from "@/lib/track";
import styles from "./CompareBuilder.module.css";

export function CompareBuilder({ models }: { models: Motorcycle[] }) {
  const router=useRouter();
  const options=useMemo(()=>[...models].sort((a,b)=>`${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)),[models]);
  const [aSlug,setASlug]=useState(""),[bSlug,setBSlug]=useState(""),[cSlug,setCSlug]=useState("");
  const a=options.find(m=>m.slug===aSlug),b=options.find(m=>m.slug===bSlug),c=options.find(m=>m.slug===cSlug);
  const ready=Boolean(a&&b&&a.slug!==b.slug);
  const ready3=Boolean(ready&&c&&c.slug!==a?.slug&&c.slug!==b?.slug);

  const picker=(label:string,value:string,set:(v:string)=>void,blocked:string[]=[],optional=false)=><label className={`${styles.picker}${optional?` ${styles.optional}`:""}`}>
    <span>{label}</span>
    <select value={value} onChange={e=>set(e.target.value)} aria-label={label}>
      <option value="">{optional?"None / compare two":"Choose a motorcycle"}</option>
      {options.map(m=><option key={m.id} value={m.slug} disabled={m.slug!==value&&blocked.includes(m.slug)}>{m.make} {m.model}</option>)}
    </select>
    {value&&(()=>{const m=options.find(x=>x.slug===value);return m?<small>{observedMarketPriceLabel(m)} · {m.engineCc} cc · {m.seatHeightMm} mm seat</small>:null})()}
  </label>;

  function openSelection(selected:Motorcycle[]){
    const bikes=encodeURIComponent(selected.map(model=>model.slug).join(","));
    router.push(`/compare/selection?bikes=${bikes}`);
  }
  function goTwo(){if(!ready||!a||!b)return;trackEvent("compare_build",{count:2,a:a.id,b:b.id});openSelection([a,b])}
  function goThree(){if(!ready3||!a||!b||!c)return;trackEvent("compare_build",{count:3,a:a.id,b:b.id,c:c.id});openSelection([a,b,c])}

  return <div className={styles.builder} data-compare-builder>
    <div className={styles.head}><div><h2>Choose motorcycles to compare</h2><p>Pick two current Philippine-market motorcycles. Add a third only when you need a three-way view.</p></div><span className={styles.count}>{options.length} current models</span></div>
    <div className={styles.pickerGrid}>
      {picker("Motorcycle A",aSlug,setASlug,[bSlug,cSlug])}
      <div className={styles.vs}>VS</div>
      {picker("Motorcycle B",bSlug,setBSlug,[aSlug,cSlug])}
      {picker("Motorcycle C (optional)",cSlug,setCSlug,[aSlug,bSlug],true)}
    </div>
    <div className={styles.actions}>
      <button className={`button ${styles.action}`} disabled={!ready} onClick={goTwo}>Compare two →</button>
      <button className={`button ${styles.action} ${styles.secondary}`} disabled={!ready3} onClick={goThree}>Compare three →</button>
    </div>
  </div>;
}

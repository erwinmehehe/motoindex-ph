"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ComparisonHighlights } from "@/components/ComparisonHighlights";
import { ComparisonDecisionWorkbench } from "@/components/ComparisonDecisionWorkbench";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";
import styles from "./SelectedCompareClient.module.css";

export function SelectedCompareClient({ models, initialSlugs = [] }: { models: Motorcycle[]; initialSlugs?: string[] }) {
  const [slugs,setSlugs]=useState<string[]>(initialSlugs);\n  const [shareStatus,setShareStatus]=useState("");

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("bikes")||"";
    const fromUrl=[...new Set(value.split(",").map(slug=>slug.trim()).filter(Boolean))].slice(0,3);
    if(fromUrl.length && fromUrl.join(",")!==initialSlugs.join(",")) setSlugs(fromUrl);
  },[initialSlugs]);

  const selected=useMemo(
    ()=>slugs.map(slug=>models.find(model=>model.slug===slug)).filter((model):model is Motorcycle=>Boolean(model)),
    [models,slugs]
  );

  async function shareComparison(){
    const url=window.location.href;
    try{
      if(navigator.share){
        await navigator.share({title:"MotoIndex PH motorcycle comparison",url});
        setShareStatus("Shared");
      }else{
        await navigator.clipboard.writeText(url);
        setShareStatus("Link copied");
      }
    }catch{
      setShareStatus("");
    }
  }

  if(selected.length<2){
    return <div className={`${styles.empty} note-box`}><h2>Choose at least two motorcycles</h2><p>Your comparison link is missing valid motorcycle selections.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;
  }

  return <div className={styles.workspace}>
    <div className={styles.summary} aria-label={`${selected.length} motorcycles selected`}>
      <span>{selected.length}-bike comparison</span>
      <div>{selected.map(model=><b key={model.id}>{model.make} {model.model}</b>)}</div>
      <div className={styles.summaryActions}>
        <Link href="/compare">Clear / change</Link>
        <button type="button" onClick={shareComparison}>Share</button>
        {shareStatus&&<small aria-live="polite">{shareStatus}</small>}
      </div>
    </div>
    {selected.length===2&&<ComparisonDecisionWorkbench a={selected[0]} b={selected[1]}/>} 
    {selected.length===3?<ThreeWayHighlights models={selected}/>:<ComparisonHighlights a={selected[0]} b={selected[1]}/>} 
    <DetailedMotorcycleCompare models={selected}/>
  </div>;
}

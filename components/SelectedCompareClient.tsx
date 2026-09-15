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
  const [slugs,setSlugs]=useState<string[]>(initialSlugs);

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("bikes")||"";
    const fromUrl=[...new Set(value.split(",").map(slug=>slug.trim()).filter(Boolean))].slice(0,3);
    if(fromUrl.length && fromUrl.join(",")!==initialSlugs.join(",")) setSlugs(fromUrl);
  },[initialSlugs]);

  const selected=useMemo(
    ()=>slugs.map(slug=>models.find(model=>model.slug===slug)).filter((model):model is Motorcycle=>Boolean(model)),
    [models,slugs]
  );

  if(selected.length<2){
    return <div className={`${styles.empty} note-box`}><h2>Choose at least two motorcycles</h2><p>Your comparison link is missing valid motorcycle selections.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;
  }

  return <div className={styles.workspace}>
    <div className={styles.summary} aria-label={`${selected.length} motorcycles selected`}>
      <span>{selected.length}-bike comparison</span>
      <div>{selected.map(model=><b key={model.id}>{model.make} {model.model}</b>)}</div>
      <Link href="/compare">Change motorcycles</Link>
    </div>
    {selected.length===2&&<ComparisonDecisionWorkbench a={selected[0]} b={selected[1]}/>} 
    {selected.length===3?<ThreeWayHighlights models={selected}/>:<ComparisonHighlights a={selected[0]} b={selected[1]}/>} 
    <DetailedMotorcycleCompare models={selected}/>
  </div>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Motorcycle } from "@/lib/types";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ComparisonHighlights } from "@/components/ComparisonHighlights";
import { ComparisonDecisionWorkbench } from "@/components/ComparisonDecisionWorkbench";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";
import styles from "./SelectedCompareClient.module.css";

export function SelectedCompareClient({ models, initialSlugs = [] }: { models: Motorcycle[]; initialSlugs?: string[] }) {
  const router=useRouter();
  const [slugs,setSlugs]=useState<string[]>(initialSlugs);
  const [shareLabel,setShareLabel]=useState("Share comparison");

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("bikes")||"";
    const fromUrl=[...new Set(value.split(",").map(slug=>slug.trim()).filter(Boolean))].slice(0,3);
    if(fromUrl.length && fromUrl.join(",")!==initialSlugs.join(",")) setSlugs(fromUrl);
  },[initialSlugs]);

  const selected=useMemo(
    ()=>slugs.map(slug=>models.find(model=>model.slug===slug)).filter((model):model is Motorcycle=>Boolean(model)),
    [models,slugs]
  );

  function remove(slug:string){
    const next=slugs.filter(item=>item!==slug);
    if(next.length<2){ router.push("/compare"); return; }
    setSlugs(next);
    router.replace(`/compare/selection?bikes=${encodeURIComponent(next.join(","))}`,{scroll:false});
  }

  async function share(){
    const url=window.location.href;
    try{
      if(navigator.share){await navigator.share({title:"MotoIndex PH motorcycle comparison",url});}
      else{await navigator.clipboard.writeText(url);}
      setShareLabel("Link copied");
      window.setTimeout(()=>setShareLabel("Share comparison"),1800);
    }catch{
      setShareLabel("Copy the page URL");
      window.setTimeout(()=>setShareLabel("Share comparison"),1800);
    }
  }

  if(selected.length<2){
    return <div className={`${styles.empty} note-box`}><h2>Choose at least two motorcycles</h2><p>Your comparison link is missing valid motorcycle selections.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;
  }

  return <div className={styles.workspace}>
    <div className={styles.summary} aria-label={`${selected.length} motorcycles selected`}>
      <span>{selected.length}-bike comparison</span>
      <div>{selected.map(model=><button type="button" key={model.id} onClick={()=>remove(model.slug)} aria-label={`Remove ${model.make} ${model.model}`}><b>{model.make} {model.model}</b><span aria-hidden="true">×</span></button>)}</div>
      <Link href="/compare">Change motorcycles</Link>
    </div>
    {selected.length===2&&<ComparisonDecisionWorkbench a={selected[0]} b={selected[1]}/>} 
    {selected.length===3?<ThreeWayHighlights models={selected}/>:<ComparisonHighlights a={selected[0]} b={selected[1]}/>} 
    <DetailedMotorcycleCompare models={selected}/>
    <div className={styles.bottomActions}>
      <button type="button" onClick={()=>router.push("/compare")}>Clear all</button>
      <button type="button" className={styles.share} onClick={share}>{shareLabel} →</button>
    </div>
  </div>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ComparisonHighlights } from "@/components/ComparisonHighlights";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";

export function SelectedCompareClient({ models }: { models: Motorcycle[] }) {
  const [slugs,setSlugs]=useState<string[]>([]);

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("bikes")||"";
    setSlugs([...new Set(value.split(",").map(slug=>slug.trim()).filter(Boolean))].slice(0,3));
  },[]);

  const selected=useMemo(
    ()=>slugs.map(slug=>models.find(model=>model.slug===slug)).filter((model):model is Motorcycle=>Boolean(model)),
    [models,slugs]
  );

  if(selected.length<2){
    return <div className="note-box selected-compare-empty"><h2>Choose at least two motorcycles</h2><p>Your comparison link is missing valid motorcycle selections.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;
  }

  return <div className="selected-compare-workspace">
    <div className="selected-compare-summary" aria-label={`${selected.length} motorcycles selected`}>
      <span>{selected.length}-bike comparison</span>
      <div>{selected.map(model=><b key={model.id}>{model.make} {model.model}</b>)}</div>
      <Link href="/compare">Change motorcycles</Link>
    </div>
    {selected.length===3?<ThreeWayHighlights models={selected}/>:<ComparisonHighlights a={selected[0]} b={selected[1]}/>} 
    <DetailedMotorcycleCompare models={selected}/>
  </div>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";

export function ThreeCompareClient({models}:{models:Motorcycle[]}){
  const [selected,setSelected]=useState<Motorcycle[]>([]);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    const slugs=[...new Set((new URLSearchParams(window.location.search).get("bikes")||"").split(",").map(value=>value.trim()).filter(Boolean))].slice(0,3);
    setSelected(slugs.map(slug=>models.find(model=>model.slug===slug)).filter((model):model is Motorcycle=>Boolean(model)));
    setReady(true);
  },[models]);

  if(!ready)return <div className="note-box"><p>Loading comparison…</p></div>;

  if(selected.length!==3)return <div className="note-box"><h2>Choose three current motorcycles</h2><p>Use the comparison builder or your shortlist to create this page.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;

  return <><ThreeWayHighlights models={selected}/><DetailedMotorcycleCompare models={selected}/></>;
}

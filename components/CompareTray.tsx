"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { COMPARE_KEY } from "@/components/CompareButton";

type TrayModel={id:string;make:string;model:string;slug:string};
function read(){try{return JSON.parse(localStorage.getItem(COMPARE_KEY)||"[]") as string[]}catch{return []}}
export function CompareTray({models}:{models:TrayModel[]}){
  const [ids,setIds]=useState<string[]>([]);
  const [expanded,setExpanded]=useState(false);
  useEffect(()=>{const sync=()=>setIds(read());sync();window.addEventListener("storage",sync);window.addEventListener("motoindex-compare",sync as EventListener);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-compare",sync as EventListener)}},[]);
  const selected=useMemo(()=>ids.map(id=>models.find(m=>m.id===id)).filter((m):m is TrayModel=>Boolean(m)).slice(0,3),[ids,models]);
  if(!selected.length)return null;
  const href=selected.length===2?`/compare/${selected[0].slug}-vs-${selected[1].slug}`:selected.length===3?`/compare/three?bikes=${selected.map(m=>m.slug).join(",")}`:"";
  function remove(id:string){const next=read().filter(x=>x!==id);localStorage.setItem(COMPARE_KEY,JSON.stringify(next));setIds(next);window.dispatchEvent(new CustomEvent("motoindex-compare"));}
  function clear(){localStorage.removeItem(COMPARE_KEY);setIds([]);window.dispatchEvent(new CustomEvent("motoindex-compare"));}
  return <aside className={`compare-tray ${expanded?"expanded":""}`} aria-label="Motorcycles selected for comparison"><div className="compare-tray-inner shell">
    <button className="compare-tray-mobile-toggle" type="button" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>Compare {selected.length}<span aria-hidden="true">{expanded?"−":"+"}</span></button>
    <div className="compare-tray-models"><span className="compare-tray-label">Compare</span>{selected.map(m=><button type="button" key={m.id} onClick={()=>remove(m.id)} aria-label={`Remove ${m.make} ${m.model} from comparison`}><b>{m.model}</b><span>×</span></button>)}</div>
    <div className="compare-tray-actions"><button type="button" className="compare-tray-clear" onClick={clear}>Clear</button>{href?<Link className="button small" href={href}>Compare {selected.length} →</Link>:<span className="compare-tray-hint">Add one more motorcycle</span>}</div>
  </div></aside>;
}

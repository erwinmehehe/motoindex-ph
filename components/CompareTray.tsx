"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPARE_KEY } from "@/components/CompareButton";

type TrayModel={id:string;make:string;model:string;slug:string};
function read(){try{return JSON.parse(localStorage.getItem(COMPARE_KEY)||"[]") as string[]}catch{return []}}
export function CompareTray({models}:{models:TrayModel[]}){
  const pathname=usePathname();
  const [ids,setIds]=useState<string[]>([]);
  const [expanded,setExpanded]=useState(false);
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{const sync=()=>setIds(read());sync();window.addEventListener("storage",sync);window.addEventListener("motoindex-compare",sync as EventListener);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-compare",sync as EventListener)}},[]);
  useEffect(()=>{const query=window.matchMedia("(max-width: 700px)");const sync=()=>setMobile(query.matches);sync();query.addEventListener("change",sync);return()=>query.removeEventListener("change",sync)},[]);
  const selected=useMemo(()=>ids.map(id=>models.find(m=>m.id===id)).filter((m):m is TrayModel=>Boolean(m)).slice(0,3),[ids,models]);
  const onComparisonResult=pathname.startsWith("/compare/");
  if(!selected.length||onComparisonResult)return null;
  const href=selected.length>=2?`/compare/selection?bikes=${encodeURIComponent(selected.map(m=>m.slug).join(","))}`:"";
  function remove(id:string){const next=read().filter(x=>x!==id);localStorage.setItem(COMPARE_KEY,JSON.stringify(next));setIds(next);window.dispatchEvent(new CustomEvent("motoindex-compare"));}
  function clear(){localStorage.removeItem(COMPARE_KEY);setIds([]);window.dispatchEvent(new CustomEvent("motoindex-compare"));}
  const mobileCollapsed=mobile&&!expanded;
  return <aside className={`compare-tray ${expanded?"expanded":""}`} aria-label="Motorcycles selected for comparison" aria-live="polite"><div className="compare-tray-inner shell" style={mobile?{flexDirection:"column",alignItems:"stretch"}:undefined}>
    <button className="compare-tray-mobile-toggle mi-btn dark" style={{display:mobile?"flex":"none",width:"100%",justifyContent:"space-between"}} type="button" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>Compare {selected.length}<span aria-hidden="true">{expanded?"−":"+"}</span></button>
    <div className="compare-tray-models" hidden={mobileCollapsed} style={mobile?{width:"100%"}:undefined}><span className="compare-tray-label">Compare</span>{selected.map(m=><button type="button" key={m.id} onClick={()=>remove(m.id)} aria-label={`Remove ${m.make} ${m.model} from comparison`} title={`Remove ${m.make} ${m.model}`}><b>{m.model}</b><span aria-hidden="true">×</span></button>)}</div>
    <div className="compare-tray-actions" hidden={mobileCollapsed} style={mobile?{width:"100%",justifyContent:"flex-end"}:undefined}><button type="button" className="compare-tray-clear" onClick={clear}>Clear</button>{href?<Link className="button small" href={href}>Compare {selected.length} →</Link>:<span className="compare-tray-hint">Add one more motorcycle</span>}</div>
  </div></aside>;
}

"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track";
export const COMPARE_KEY="motoindex-compare-v1";
function read(){try{return JSON.parse(localStorage.getItem(COMPARE_KEY)||"[]") as string[]}catch{return []}}
export function CompareButton({modelId,compact=false}:{modelId:string;compact?:boolean}){
  const [selected,setSelected]=useState(false);
  const [count,setCount]=useState(0);
  useEffect(()=>{const sync=()=>{const ids=read();setSelected(ids.includes(modelId));setCount(ids.length)};sync();window.addEventListener("storage",sync);window.addEventListener("motoindex-compare",sync as EventListener);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-compare",sync as EventListener)}},[modelId]);
  const maxed=!selected&&count>=3;
  function toggle(){
    const current=read();
    if(!current.includes(modelId)&&current.length>=3)return;
    const next=current.includes(modelId)?current.filter(id=>id!==modelId):[...current,modelId];
    localStorage.setItem(COMPARE_KEY,JSON.stringify(next));
    setSelected(next.includes(modelId));setCount(next.length);
    window.dispatchEvent(new CustomEvent("motoindex-compare"));
    trackEvent(next.includes(modelId)?"compare_add":"compare_remove",{model_id:modelId,count:next.length});
  }
  const label=selected?"Compare ✓":maxed?"Max 3":"+ Compare";
  return <button type="button" className={`compare-button ${compact?"compact":""} ${selected?"selected":""}`} onClick={toggle} aria-pressed={selected} disabled={maxed} title={maxed?"Maximum 3 motorcycles. Remove one before adding another.":undefined}>{label}</button>;
}

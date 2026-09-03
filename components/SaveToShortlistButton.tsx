"use client";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track";
const KEY="motoindex-shortlist-v1";
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"[]") as string[]}catch{return []}}
export function SaveToShortlistButton({modelId,compact=false}:{modelId:string;compact?:boolean}){
  const [saved,setSaved]=useState(false);
  useEffect(()=>setSaved(read().includes(modelId)),[modelId]);
  function toggle(){const current=read();const next=current.includes(modelId)?current.filter(id=>id!==modelId):[...current,modelId].slice(-8);localStorage.setItem(KEY,JSON.stringify(next));setSaved(next.includes(modelId));window.dispatchEvent(new CustomEvent("motoindex-shortlist"));trackEvent(next.includes(modelId)?"shortlist_save":"shortlist_remove",{model_id:modelId});}
  return <button type="button" className={`shortlist-button ${compact?"compact":""} ${saved?"saved":""}`} onClick={toggle} aria-pressed={saved}>{saved?"Saved ✓":"♡ Save"}</button>;
}
export { KEY as SHORTLIST_KEY };

"use client";
import { useState } from "react";
export function ComparisonActions({onClear}:{onClear:()=>void}){
  const [message,setMessage]=useState("");
  async function share(){try{if(navigator.share){await navigator.share({title:document.title,url:window.location.href});return;}if(navigator.clipboard){await navigator.clipboard.writeText(window.location.href);setMessage("Comparison link copied.");}else setMessage("Copy the comparison link from your address bar.");}catch{setMessage("Sharing was cancelled or unavailable. Copy the link from your address bar.");}}
  return <div className="wf-comparison-actions"><p role="status">{message}</p><button type="button" className="button secondary" onClick={onClear}>Clear all</button><button type="button" className="button" onClick={share}>Share comparison</button></div>;
}

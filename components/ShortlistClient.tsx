"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";
import { ModelCard } from "@/components/ModelCard";
import { trackEvent } from "@/lib/track";

function read(){try{return JSON.parse(localStorage.getItem(SHORTLIST_KEY)||"[]") as string[]}catch{return []}}
export function ShortlistClient({models,initialSlugs=[]}:{models:Motorcycle[];initialSlugs?:string[]}){
  const initialIds=useMemo(()=>initialSlugs.map(slug=>models.find(m=>m.slug===slug)?.id).filter((id):id is string=>Boolean(id)),[models,initialSlugs]);
  const [ids,setIds]=useState<string[]>([]);
  useEffect(()=>{const stored=read();const merged=[...new Set([...initialIds,...stored])].slice(0,8);if(merged.length) localStorage.setItem(SHORTLIST_KEY,JSON.stringify(merged));setIds(merged);const sync=()=>setIds(read());window.addEventListener("storage",sync);window.addEventListener("motoindex-shortlist",sync as EventListener);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-shortlist",sync as EventListener)}},[initialIds]);
  const saved=ids.map(id=>models.find(m=>m.id===id)).filter((m):m is Motorcycle=>Boolean(m));
  function clear(){localStorage.removeItem(SHORTLIST_KEY);setIds([]);window.dispatchEvent(new CustomEvent("motoindex-shortlist"));}
  async function share(){if(!saved.length)return;const url=`${window.location.origin}/shortlist?bikes=${saved.map(m=>m.slug).join(",")}`;await navigator.clipboard?.writeText(url);trackEvent("shortlist_share",{count:saved.length});}
  const compareHref=saved.length>=3?`/compare/three?bikes=${saved.slice(0,3).map(m=>m.slug).join(",")}`:saved.length===2?`/compare/${saved[0].slug}-vs-${saved[1].slug}`:"";
  return <div>{saved.length?<><div className="shortlist-toolbar"><div><b>{saved.length} saved motorcycles</b><small>Stored in this browser. Share creates a URL with model slugs only.</small></div><div>{compareHref&&<Link className="button small" href={compareHref}>Compare {Math.min(3,saved.length)} →</Link>}<button className="button ghost small" onClick={share}>Copy share link</button><button className="button ghost small" onClick={clear}>Clear</button></div></div><div className="card-grid">{saved.map(m=><ModelCard key={m.id} model={m}/>)}</div></>:<div className="empty-state large"><h2>No saved motorcycles yet</h2><p>Use the Save button on motorcycle cards, finder results or model pages.</p><Link className="button" href="/motorcycles">Browse motorcycles</Link></div>}</div>;
}

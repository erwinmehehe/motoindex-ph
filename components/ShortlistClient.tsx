"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { trackEvent } from "@/lib/track";
import { observedMarketRange } from "@/lib/marketChecks";
import { ownershipDefaults } from "@/lib/ownership";

const EMPTY_SLUGS:string[]=[];

function read(){
  try{return JSON.parse(localStorage.getItem(SHORTLIST_KEY)||"[]") as string[]}
  catch{return []}
}

function monthlyPayment(principal:number,annualRatePct=12,months=36){
  if(principal<=0)return 0;
  const rate=annualRatePct/100/12;
  return principal*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1);
}

function buyerSnapshot(model:Motorcycle,kmPerMonth:number){
  const market=observedMarketRange(model);
  const price=market.from||model.srp;
  const defaults=ownershipDefaults(model);
  const kmpl=Math.max(1,model.fuelConsumptionKmL||defaults.estimatedKmPerL);
  const fuelMonthly=kmPerMonth/kmpl*defaults.fuelPricePerL;
  const runningMonthly=fuelMonthly+defaults.maintenancePerMonth+
    defaults.annualInsurance/12+defaults.annualRegistration/12+defaults.tiresPerYear/12;
  return {price,monthly:runningMonthly+monthlyPayment(price*.8)};
}

export function ShortlistClient({models,initialSlugs=EMPTY_SLUGS}:{models:Motorcycle[];initialSlugs?:string[]}){
  const [ids,setIds]=useState<string[]>([]);
  const [kmPerMonth,setKmPerMonth]=useState(600);
  const [shared,setShared]=useState(false);

  useEffect(()=>{
    const querySlugs=(new URLSearchParams(window.location.search).get("bikes")||"").split(",").filter(Boolean).slice(0,8);
    const slugs=[...new Set([...initialSlugs,...querySlugs])];
    const queryIds=slugs.map(slug=>models.find(model=>model.slug===slug)?.id).filter((id):id is string=>Boolean(id));
    const merged=[...new Set([...queryIds,...read()])].slice(0,8);
    if(merged.length)localStorage.setItem(SHORTLIST_KEY,JSON.stringify(merged));
    setIds(merged);
    const sync=()=>setIds(read());
    window.addEventListener("storage",sync);
    window.addEventListener("motoindex-shortlist",sync as EventListener);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-shortlist",sync as EventListener)};
  },[initialSlugs,models]);

  const saved=ids.map(id=>models.find(model=>model.id===id)).filter((model):model is Motorcycle=>Boolean(model));
  const snapshots=useMemo(()=>saved.map(model=>({model,...buyerSnapshot(model,kmPerMonth)})),[saved,kmPerMonth]);
  const lowestMonthly=Math.min(...snapshots.map(item=>item.monthly));
  const compareHref=saved.length>=3?`/compare/three?bikes=${saved.slice(0,3).map(model=>model.slug).join(",")}`:saved.length===2?`/compare/${saved[0].slug}-vs-${saved[1].slug}`:"";

  function persist(next:string[]){
    localStorage.setItem(SHORTLIST_KEY,JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new CustomEvent("motoindex-shortlist"));
  }

  function remove(id:string){persist(ids.filter(item=>item!==id));trackEvent("shortlist_remove",{id})}
  function clear(){localStorage.removeItem(SHORTLIST_KEY);setIds([]);window.dispatchEvent(new CustomEvent("motoindex-shortlist"))}

  async function share(){
    if(!saved.length)return;
    const url=`${window.location.origin}/shortlist?bikes=${saved.map(model=>model.slug).join(",")}`;
    await navigator.clipboard?.writeText(url);
    setShared(true);
    window.setTimeout(()=>setShared(false),1800);
    trackEvent("shortlist_share",{count:saved.length});
  }

  if(!saved.length)return <div className="mi-empty">
    <p className="mi-kicker">Your shortlist</p>
    <h2>Find the one you will want to ride.</h2>
    <p>Save motorcycles as you browse, then return here to compare the details that matter.</p>
    <Link className="mi-button mi-button-primary" href="/motorcycles">Explore motorcycles</Link>
  </div>;

  return <div className="mi-shortlist">
    <div className="mi-toolbar">
      <p>{saved.length} {saved.length===1?"motorcycle":"motorcycles"}</p>
      <div>
        {compareHref&&<Link className="mi-button mi-button-primary" href={compareHref}>Compare side by side</Link>}
        <button className="mi-button mi-button-quiet" onClick={share}>{shared?"Link copied":"Share"}</button>
        <button className="mi-link-button" onClick={clear}>Clear</button>
      </div>
    </div>

    <section className="mi-comparison" aria-label="Saved motorcycles">
      {snapshots.map(({model,monthly})=><MotorcycleCard
        key={model.id}
        model={model}
        variant="compact"
        monthlyOwnershipPhp={monthly}
        highlightMonthly={monthly===lowestMonthly&&snapshots.length>1}
        leadingAction={<button className="mi-remove" type="button" onClick={()=>remove(model.id)} aria-label={`Remove ${model.make} ${model.model}`}>Remove</button>}
      />)}
    </section>

    <section className="mi-assumption" aria-labelledby="distance-label">
      <div><h2 id="distance-label">Your monthly riding</h2><p>Fine-tune the ownership estimates.</p></div>
      <label><span>{kmPerMonth.toLocaleString()} km per month</span><input aria-label="Monthly distance in kilometres" type="range" min="200" max="2000" step="100" value={kmPerMonth} onChange={event=>setKmPerMonth(Number(event.target.value))}/></label>
    </section>

    <p className="mi-disclaimer">Estimates assume 20% down, 36 months and 12% APR, plus fuel and routine ownership. Dealer quotes will vary.</p>
  </div>;
}

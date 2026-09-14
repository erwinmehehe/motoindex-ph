"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";
import { EntityMedia } from "@/components/EntityMedia";
import { trackEvent } from "@/lib/track";
import { observedMarketRange } from "@/lib/marketChecks";
import { ownershipDefaults } from "@/lib/ownership";
import { php } from "@/lib/utils";

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

  function remove(id:string){
    persist(ids.filter(item=>item!==id));
    trackEvent("shortlist_remove",{id});
  }

  function clear(){
    localStorage.removeItem(SHORTLIST_KEY);
    setIds([]);
    window.dispatchEvent(new CustomEvent("motoindex-shortlist"));
  }

  async function share(){
    if(!saved.length)return;
    const url=`${window.location.origin}/shortlist?bikes=${saved.map(model=>model.slug).join(",")}`;
    await navigator.clipboard?.writeText(url);
    setShared(true);
    window.setTimeout(()=>setShared(false),1800);
    trackEvent("shortlist_share",{count:saved.length});
  }

  if(!saved.length)return <div className="apple-empty">
    <span>Shortlist</span>
    <h2>Your next motorcycle starts here.</h2>
    <p>Save models while you browse. They will appear here for a clean side-by-side decision.</p>
    <Link className="apple-primary-action" href="/motorcycles">Explore motorcycles</Link>
  </div>;

  return <div className="apple-shortlist">
    <header className="apple-shortlist-intro">
      <div><span>{saved.length} saved</span><h2>Choose with clarity.</h2><p>Price, fit and real monthly cost in one calm view.</p></div>
      <div className="apple-shortlist-actions">
        {compareHref&&<Link className="apple-primary-action" href={compareHref}>Compare models</Link>}
        <button className="apple-secondary-action" onClick={share}>{shared?"Link copied":"Share"}</button>
        <button className="apple-text-action" onClick={clear}>Clear all</button>
      </div>
    </header>

    <section className="apple-distance-control" aria-label="Monthly distance assumption">
      <div><span>Monthly distance</span><strong>{kmPerMonth.toLocaleString()} km</strong></div>
      <input aria-label="Monthly distance in kilometres" type="range" min="200" max="2000" step="100" value={kmPerMonth} onChange={event=>setKmPerMonth(Number(event.target.value))}/>
      <small>Updates fuel and monthly ownership estimates for every model.</small>
    </section>

    <div className="apple-product-grid">
      {snapshots.map(({model,price,monthly})=>{
        const href=`/motorcycles/${model.makeSlug}/${model.slug}`;
        return <article className="apple-product" key={model.id}>
          <button className="apple-remove" type="button" onClick={()=>remove(model.id)} aria-label={`Remove ${model.make} ${model.model}`}>×</button>
          <Link className="apple-product-media" href={href} aria-label={`View ${model.make} ${model.model}`}>
            <EntityMedia entityType="motorcycle" entityId={model.id} showCredit={false} fallback={<div className="apple-product-fallback"><span>{model.make}</span><strong>{model.model}</strong></div>}/>
          </Link>
          <div className="apple-product-name"><span>{model.make}</span><h3>{model.model}</h3></div>
          <div className="apple-product-price"><strong>{php(price)}</strong><span>observed price</span></div>
          <div className="apple-monthly">
            <span>Estimated monthly</span>
            <strong>{php(monthly)}</strong>
            {monthly===lowestMonthly&&snapshots.length>1&&<small>Lowest in your shortlist</small>}
          </div>
          <dl className="apple-specs">
            <div><dt>Engine</dt><dd>{model.engineCc?model.engineCc+" cc":"Electric"}</dd></div>
            <div><dt>Seat</dt><dd>{model.seatHeightMm?model.seatHeightMm+" mm":"Not listed"}</dd></div>
            <div><dt>Weight</dt><dd>{model.curbWeightKg?model.curbWeightKg+" kg":"Not listed"}</dd></div>
            <div><dt>Gearbox</dt><dd>{model.transmission||"Not listed"}</dd></div>
          </dl>
          <div className="apple-product-links">
            <Link href={href}>View motorcycle</Link>
            <Link href={`${href}/ownership-cost`}>Adjust costs</Link>
          </div>
        </article>;
      })}
    </div>

    <p className="apple-estimate-note">Monthly figures assume 20% down, 36 months and 12% APR, plus fuel and routine ownership reserves. They are planning estimates, not dealer quotes.</p>
  </div>;
}

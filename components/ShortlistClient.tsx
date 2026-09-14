"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";
import { ModelCard } from "@/components/ModelCard";
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
  const financeMonthly=monthlyPayment(price*.8);
  return {price,monthly:runningMonthly+financeMonthly};
}

export function ShortlistClient({models,initialSlugs=EMPTY_SLUGS}:{models:Motorcycle[];initialSlugs?:string[]}){
  const [ids,setIds]=useState<string[]>([]);
  const [kmPerMonth,setKmPerMonth]=useState(600);

  useEffect(()=>{
    const querySlugs=(new URLSearchParams(window.location.search).get("bikes")||"").split(",").filter(Boolean).slice(0,8);
    const slugs=[...new Set([...initialSlugs,...querySlugs])];
    const queryIds=slugs.map(slug=>models.find(m=>m.slug===slug)?.id).filter((id):id is string=>Boolean(id));
    const stored=read();
    const merged=[...new Set([...queryIds,...stored])].slice(0,8);
    if(merged.length)localStorage.setItem(SHORTLIST_KEY,JSON.stringify(merged));
    setIds(merged);
    const sync=()=>setIds(read());
    window.addEventListener("storage",sync);
    window.addEventListener("motoindex-shortlist",sync as EventListener);
    return()=>{window.removeEventListener("storage",sync);window.removeEventListener("motoindex-shortlist",sync as EventListener)};
  },[initialSlugs,models]);

  const saved=ids.map(id=>models.find(m=>m.id===id)).filter((m):m is Motorcycle=>Boolean(m));
  const snapshots=useMemo(()=>saved.map(model=>({model,...buyerSnapshot(model,kmPerMonth)})),[saved,kmPerMonth]);
  const lowestPrice=Math.min(...snapshots.map(item=>item.price));
  const lowestMonthly=Math.min(...snapshots.map(item=>item.monthly));
  const lowestSeat=Math.min(...saved.map(model=>model.seatHeightMm||Infinity));

  function clear(){
    localStorage.removeItem(SHORTLIST_KEY);
    setIds([]);
    window.dispatchEvent(new CustomEvent("motoindex-shortlist"));
  }

  function remove(id:string){
    const next=ids.filter(item=>item!==id);
    localStorage.setItem(SHORTLIST_KEY,JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new CustomEvent("motoindex-shortlist"));
    trackEvent("shortlist_remove",{id});
  }

  async function share(){
    if(!saved.length)return;
    const url=`${window.location.origin}/shortlist?bikes=${saved.map(m=>m.slug).join(",")}`;
    await navigator.clipboard?.writeText(url);
    trackEvent("shortlist_share",{count:saved.length});
  }

  const compareHref=saved.length>=3?`/compare/three?bikes=${saved.slice(0,3).map(m=>m.slug).join(",")}`:saved.length===2?`/compare/${saved[0].slug}-vs-${saved[1].slug}`:"";

  if(!saved.length)return <div className="empty-state large">
    <h2>No saved motorcycles yet</h2>
    <p>Use the Save button on motorcycle cards, finder results or model pages.</p>
    <Link className="button" href="/motorcycles">Browse motorcycles</Link>
  </div>;

  return <div className="buyer-workspace">
    <div className="shortlist-toolbar">
      <div><b>{saved.length} saved motorcycles</b><small>Stored in this browser. Share creates a URL with model slugs only.</small></div>
      <div>{compareHref&&<Link className="button small" href={compareHref}>Compare {Math.min(3,saved.length)} →</Link>}<button className="button ghost small" onClick={share}>Copy share link</button><button className="button ghost small" onClick={clear}>Clear</button></div>
    </div>

    <section className="buyer-decision-panel" aria-labelledby="buyer-decision-heading">
      <div className="buyer-decision-head">
        <div><span className="section-kicker">Buyer decision workspace</span><h2 id="buyer-decision-heading">See the tradeoffs before opening every model</h2><p>Compare the numbers buyers usually need first. Monthly estimates assume 20% down, 36 months and 12% APR, plus fuel and routine ownership reserves.</p></div>
        <label>Distance each month <b>{kmPerMonth.toLocaleString()} km</b><input type="range" min="200" max="2000" step="100" value={kmPerMonth} onChange={event=>setKmPerMonth(Number(event.target.value))}/></label>
      </div>
      <div className="buyer-snapshot-grid">
        {snapshots.map(({model,price,monthly})=><article className="buyer-snapshot-card" key={model.id}>
          <div className="buyer-snapshot-title"><div><small>{model.make}</small><h3>{model.model}</h3></div><button type="button" onClick={()=>remove(model.id)} aria-label={`Remove ${model.make} ${model.model} from shortlist`}>Remove</button></div>
          <dl>
            <div><dt>Observed price</dt><dd>{php(price)} {price===lowestPrice&&<em>Lowest</em>}</dd></div>
            <div><dt>Est. monthly</dt><dd>{php(monthly)} {monthly===lowestMonthly&&<em>Lowest</em>}</dd></div>
            <div><dt>Seat height</dt><dd>{model.seatHeightMm?model.seatHeightMm+" mm":"Not listed"} {model.seatHeightMm===lowestSeat&&<em>Easiest reach</em>}</dd></div>
            <div><dt>Wet weight</dt><dd>{model.wetWeightKg?model.wetWeightKg+" kg":"Not listed"}</dd></div>
            <div><dt>Engine</dt><dd>{model.engineCc?model.engineCc+" cc":"Electric"}</dd></div>
            <div><dt>Transmission</dt><dd>{model.transmission}</dd></div>
          </dl>
          <div className="buyer-snapshot-actions"><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}>View model →</Link><Link href={`/motorcycles/${model.makeSlug}/${model.slug}/ownership-cost`}>Full cost estimate</Link></div>
        </article>)}
      </div>
      <p className="buyer-decision-note"><b>Planning estimate only.</b> Dealer fees, promotions, parking, tolls, repairs and accessories are not included. Open a full cost estimate to change financing and ownership assumptions.</p>
    </section>

    <div className="section-head compact"><div><span className="section-kicker">Full model cards</span><h2>Continue researching your saved motorcycles</h2></div></div>
    <div className="card-grid">{saved.map(m=><ModelCard key={m.id} model={m}/>)}</div>
  </div>;
}

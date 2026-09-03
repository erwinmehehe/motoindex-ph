"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { HelmetProduct } from "@/lib/types";
import { EntityMedia } from "@/components/EntityMedia";

export type HelmetFinderFilters = {
  budget: string;
  type: string;
  use: string;
  brand: string;
  size: string;
  intercom: string;
  feature: string;
  certification: string;
};

const defaults: HelmetFinderFilters = { budget:"any", type:"any", use:"commute", brand:"any", size:"any", intercom:"any", feature:"any", certification:"any" };

function budgetMatch(price:number|undefined,budget:string){
  if(budget==="any")return true;
  if(price===undefined)return false;
  if(budget==="under3000")return price<3000;
  if(budget==="3000to5000")return price>=3000&&price<=5000;
  if(budget==="5000to8000")return price>5000&&price<=8000;
  if(budget==="8000plus")return price>8000;
  return true;
}
function typeMatch(type:string,filter:string){
  if(filter==="any")return true;
  if(filter==="full-face")return type==="Full face";
  if(filter==="modular")return type==="Modular";
  if(filter==="open-face")return type==="Open face"||type==="Half face";
  if(filter==="hybrid")return type==="Hybrid";
  return true;
}
function hasFeature(p:HelmetProduct,feature:string){
  const visor=p.visor.toLowerCase();
  if(feature==="any")return true;
  if(feature==="pinlock")return visor.includes("pinlock");
  if(feature==="sun-visor")return visor.includes("sun visor")||visor.includes("dual visor")||visor.includes("internal sun");
  return true;
}
function certificationMatch(p:HelmetProduct,filter:string){
  const c=(p.certification||"").toLowerCase();
  if(filter==="any")return true;
  if(filter==="ece")return c.includes("ece");
  if(filter==="local")return c.includes("icc")||c.includes("ps mark")||c.includes("ps/");
  return true;
}
function useScore(p:HelmetProduct,use:string){
  let score=0; const reasons:string[]=[]; const visor=p.visor.toLowerCase();
  const sun=visor.includes("sun visor")||visor.includes("dual visor")||visor.includes("internal sun");
  const pinlock=visor.includes("pinlock");
  if(use==="sport"&&p.helmetType==="Full face"){score+=5;reasons.push("full-face sport format");}
  if(use==="touring"){
    if(p.helmetType==="Modular"||p.helmetType==="Full face"){score+=3;reasons.push("touring-friendly format");}
    if(p.intercomReady){score+=2;reasons.push("intercom provision");}
    if(sun){score+=1;reasons.push("sun visor");}
  }
  if(use==="commute"){
    if(["Modular","Open face","Half face","Hybrid"].includes(p.helmetType)){score+=3;reasons.push("city-friendly format");}
    if(sun){score+=2;reasons.push("sun visor");}
    if((p.priceFromPhp||Infinity)<=8000){score+=1;reasons.push("commuter budget");}
  }
  if(use==="delivery"){
    if(["Modular","Open face","Half face","Hybrid"].includes(p.helmetType)){score+=4;reasons.push("frequent-stop format");}
    if((p.priceFromPhp||Infinity)<=5000){score+=2;reasons.push("value-focused");}
  }
  if(pinlock){score+=1;reasons.push("Pinlock-ready/listed");}
  if((p.certification||"").toLowerCase().match(/icc|ps mark|ps\//)){score+=1;reasons.push("PS / ICC reference listed");}
  return {score,reasons:[...new Set(reasons)].slice(0,3)};
}

export function HelmetFinder({products,initialFilters}:{products:HelmetProduct[];initialFilters?:Partial<HelmetFinderFilters>}){
  const [filters,setFilters]=useState<HelmetFinderFilters>({...defaults,...initialFilters});
  const [selected,setSelected]=useState<string[]>([]);
  const brands=useMemo(()=>[...new Set(products.map(p=>p.brand))].sort(),[products]);
  const sizes=useMemo(()=>[...new Set(products.flatMap(p=>p.sizes))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})),[products]);

  function update<K extends keyof HelmetFinderFilters>(key:K,value:HelmetFinderFilters[K]){
    const next={...filters,[key]:value};setFilters(next);
    const params=new URLSearchParams();
    for(const [k,v] of Object.entries(next))if(v!==defaults[k as keyof HelmetFinderFilters])params.set(k,v);
    const query=params.toString();window.history.replaceState(null,"",query?`?${query}`:window.location.pathname);
  }
  function reset(){setFilters(defaults);setSelected([]);window.history.replaceState(null,"",window.location.pathname);}
  async function copy(){try{await navigator.clipboard.writeText(window.location.href);}catch{}}
  function toggleCompare(id:string){setSelected(cur=>cur.includes(id)?cur.filter(x=>x!==id):cur.length<3?[...cur,id]:cur);}

  const ranked=useMemo(()=>products
    .filter(p=>budgetMatch(p.priceFromPhp,filters.budget))
    .filter(p=>typeMatch(p.helmetType,filters.type))
    .filter(p=>filters.brand==="any"||p.brand===filters.brand)
    .filter(p=>filters.size==="any"||p.sizes.includes(filters.size))
    .filter(p=>filters.intercom!=="yes"||p.intercomReady)
    .filter(p=>hasFeature(p,filters.feature))
    .filter(p=>certificationMatch(p,filters.certification))
    .map(p=>({p,...useScore(p,filters.use)}))
    .sort((a,b)=>b.score-a.score||(a.p.priceFromPhp??999999)-(b.p.priceFromPhp??999999)),[products,filters]);

  const compareHref=selected.length>=2?`/gear/helmets/compare?${selected.map((id,i)=>`${["a","b","c"][i]}=${encodeURIComponent(id)}`).join("&")}`:"";
  return <>
    <div className="helmet-finder-panel">
      <div className="helmet-finder-grid">
        <label><span>Budget</span><select value={filters.budget} onChange={e=>update("budget",e.target.value)}><option value="any">Any budget</option><option value="under3000">Under ₱3,000</option><option value="3000to5000">₱3,000–₱5,000</option><option value="5000to8000">₱5,001–₱8,000</option><option value="8000plus">Over ₱8,000</option></select></label>
        <label><span>Helmet type</span><select value={filters.type} onChange={e=>update("type",e.target.value)}><option value="any">Any type</option><option value="full-face">Full face</option><option value="modular">Modular</option><option value="open-face">Open / half face</option><option value="hybrid">Hybrid</option></select></label>
        <label><span>Riding use</span><select value={filters.use} onChange={e=>update("use",e.target.value)}><option value="commute">Daily commute</option><option value="touring">Touring</option><option value="sport">Sport / spirited road</option><option value="delivery">Delivery / frequent stops</option></select></label>
        <label><span>Brand</span><select value={filters.brand} onChange={e=>update("brand",e.target.value)}><option value="any">Any brand</option>{brands.map(b=><option key={b}>{b}</option>)}</select></label>
        <label><span>Size listed</span><select value={filters.size} onChange={e=>update("size",e.target.value)}><option value="any">Any listed size</option>{sizes.map(s=><option key={s}>{s}</option>)}</select></label>
        <label><span>Intercom provision</span><select value={filters.intercom} onChange={e=>update("intercom",e.target.value)}><option value="any">Not required</option><option value="yes">Required</option></select></label>
        <label><span>Visor feature</span><select value={filters.feature} onChange={e=>update("feature",e.target.value)}><option value="any">Any visor</option><option value="pinlock">Pinlock-ready/listed</option><option value="sun-visor">Sun / dual visor</option></select></label>
        <label><span>Certification reference</span><select value={filters.certification} onChange={e=>update("certification",e.target.value)}><option value="any">Any verified source</option><option value="ece">ECE referenced</option><option value="local">PS / ICC reference listed</option></select></label>
      </div>
      <div className="finder-toolbar"><p><strong aria-live="polite">{ranked.length}</strong> verified helmets match. Ranking is based on the filters and use-case fit, not a safety score.</p><div><button className="button secondary" type="button" onClick={copy}>Copy finder link</button><button className="filter-reset" type="button" onClick={reset}>Reset</button></div></div>
    </div>

    {selected.length>0&&<div className="helmet-compare-bar"><strong>{selected.length}/3 selected</strong><span>Choose 2–3 helmets to compare specs side by side.</span>{compareHref?<Link className="button" href={compareHref}>Compare selected</Link>:<span className="compare-hint">Select one more</span>}<button type="button" className="text-button" onClick={()=>setSelected([])}>Clear</button></div>}

    <div className="helmet-finder-results">
      {ranked.map(({p,score,reasons},index)=><article className="helmet-finder-card" key={p.id}>
        <Link className="helmet-finder-media" href={`/gear/helmets/${p.brandSlug}/${p.slug}`}><EntityMedia entityType="helmet" entityId={p.id} fallback={<div className="product-art"><span>Image unavailable</span></div>} showCredit={false}/></Link>
        <div className="helmet-finder-copy"><div className="helmet-finder-rank"><span>#{index+1} match</span><b>{score>=5?"Strong use match":score>=3?"Good use match":"Matches filters"}</b></div><h2><Link href={`/gear/helmets/${p.brandSlug}/${p.slug}`}>{p.brand} {p.model}</Link></h2><strong className="helmet-finder-price">{p.priceFromPhp?`From ₱${p.priceFromPhp.toLocaleString("en-PH")}`:"Price not published"}</strong><div className="helmet-reasons">{reasons.map(r=><span key={r}>{r}</span>)}</div><p>{p.certification||"Check the exact local conformity marking."}</p><div className="helmet-card-actions"><Link className="button secondary" href={`/gear/helmets/${p.brandSlug}/${p.slug}`}>View helmet</Link><button type="button" className={`compare-button ${selected.includes(p.id)?"selected":""}`} aria-pressed={selected.includes(p.id)} disabled={!selected.includes(p.id)&&selected.length>=3} title={!selected.includes(p.id)&&selected.length>=3?"Maximum 3 helmets. Remove one before adding another.":undefined} onClick={()=>toggleCompare(p.id)}>{selected.includes(p.id)?"Selected":selected.length>=3?"Max 3":"+ Compare"}</button></div></div>
      </article>)}
    </div>
    {ranked.length===0&&<div className="empty-state"><h2>No exact match</h2><p>Broaden one filter. A missing price or size record can exclude a helmet from strict filters even when the product itself is verified.</p><button className="button" type="button" onClick={reset}>Reset finder</button></div>}
  </>;
}

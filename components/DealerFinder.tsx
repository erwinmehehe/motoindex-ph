"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SellerProfile } from "@/lib/types";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function DealerFinder({ dealers }: { dealers: SellerProfile[] }) {
  const [query,setQuery]=useState("");
  const [brand,setBrand]=useState("all");
  const [city,setCity]=useState("all");

  const brands=useMemo(()=>[...new Set(dealers.flatMap(d=>d.brands))].sort(),[dealers]);
  const cities=useMemo(()=>[...new Set(dealers.map(d=>d.city))].sort(),[dealers]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return dealers.filter(dealer=>{
      if(brand!=="all"&&!dealer.brands.includes(brand))return false;
      if(city!=="all"&&dealer.city!==city)return false;
      if(!q)return true;
      return [dealer.name,dealer.addressLabel,dealer.city,dealer.province||"",...dealer.brands]
        .some(value=>value.toLowerCase().includes(q));
    });
  },[brand,city,dealers,query]);

  const active=query||brand!=="all"||city!=="all";

  return <div className="dealer-finder">
    <div className="dealer-filter-bar">
      <label className="dealer-search">
        <span>Search dealers</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Dealer, city or street" />
      </label>
      <label>
        <span>Brand</span>
        <select value={brand} onChange={e=>setBrand(e.target.value)}>
          <option value="all">All brands</option>
          {brands.map(value=><option value={value} key={value}>{value}</option>)}
        </select>
      </label>
      <label>
        <span>City</span>
        <select value={city} onChange={e=>setCity(e.target.value)}>
          <option value="all">All cities</option>
          {cities.map(value=><option value={value} key={value}>{value}</option>)}
        </select>
      </label>
      {active?<button className="dealer-clear" type="button" onClick={()=>{setQuery("");setBrand("all");setCity("all");}}>Clear</button>:null}
    </div>

    <div className="dealer-results-head" aria-live="polite">
      <strong>{filtered.length} checked dealer{filtered.length===1?"":"s"}</strong>
      <span>Public records are shown only when a verification source, address and recent check are on file.</span>
    </div>

    {filtered.length?<div className="dealer-results">
      {filtered.map(dealer=><article className="dealer-result-card" key={dealer.slug}>
        <div className="dealer-card-top"><span className="dealer-brand">{dealer.brands.join(" · ")}</span><span className="dealer-checked">Dealer details checked</span></div>
        <h3>{dealer.name}</h3>
        <p>{dealer.addressLabel}</p>
        <div className="dealer-card-meta">
          <span>{dealer.city}{dealer.province?`, ${dealer.province}`:""}</span>
          {dealer.phoneLabel?<span>{dealer.phoneLabel}</span>:null}
        </div>
        <div className="dealer-card-actions">
          <Link href={`/sellers/${dealer.slug}`}>View dealer</Link>
          {dealer.phoneLabel?<a href={phoneHref(dealer.phoneLabel)}>Call branch</a>:null}
        </div>
      </article>)}
    </div>:<div className="dealer-no-results">
      <h3>No checked dealer matches</h3>
      <p>Try another city or brand, or use the official brand locators below for broader coverage.</p>
    </div>}
  </div>;
}

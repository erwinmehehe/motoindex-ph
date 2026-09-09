"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ProductRow={
  id:string;
  category:string;
  brand:string;
  model:string;
  slug:string;
  detail:string;
  dbLink?:{
    url:string;
    network:string;
    status:string;
    reviewNote:string;
    approvedAt?:string;
    updatedAt:string;
  };
  fallback?:{
    network:string;
  };
};

function AffiliateRow({row}:{row:ProductRow}){
  const [url,setUrl]=useState(row.dbLink?.url||"");
  const [note,setNote]=useState(row.dbLink?.reviewNote||"");
  const [status,setStatus]=useState(row.dbLink?.status||"unconfigured");
  const [network,setNetwork]=useState(row.dbLink?.network||row.fallback?.network||"");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function save(nextStatus:"active"|"disabled"){
    setSaving(true);setMessage("");
    try{
      const response=await fetch(`/api/admin/affiliate-links/${encodeURIComponent(row.id)}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({url,reviewNote:note,status:nextStatus})
      });
      const result=await response.json();
      if(!response.ok||!result.ok){setMessage(result.error||"Could not save affiliate link.");return;}
      setStatus(result.status);
      setNetwork(result.network||"");
      setMessage(nextStatus==="active"?"Affiliate CTA is active at runtime.":"Database override disabled this affiliate CTA.");
    }catch{
      setMessage("Could not save affiliate link.");
    }finally{
      setSaving(false);
    }
  }

  return <article className="affiliate-admin-row">
    <div className="affiliate-admin-product">
      <span>{row.category}</span>
      <h2>{row.brand} {row.model}</h2>
      <p>{row.detail}</p>
      <small>{row.id}</small>
      <div className="affiliate-admin-links"><Link href={row.slug} target="_blank">Open product page ↗</Link>{status==="active"&&<a href={`/go/affiliate/${encodeURIComponent(row.id)}`} target="_blank" rel="noreferrer">Test redirect ↗</a>}</div>
    </div>

    <div className="affiliate-admin-form">
      <label><span>Shopee / Involve Asia URL</span><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://shopee.ph/... or https://invl.me/..."/></label>
      <label><span>Review note</span><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Checked merchant, exact product and destination."/></label>
      <div className="affiliate-admin-actions">
        <button type="button" disabled={saving} onClick={()=>save("active")}>{saving?"Saving…":"Save & activate"}</button>
        <button type="button" disabled={saving||(!url&&!row.fallback)} onClick={()=>save("disabled")}>Save disabled</button>
      </div>
      {message&&<small className={message.includes("active")?"review-success":""}>{message}</small>}
    </div>

    <div className="affiliate-admin-state">
      <em className={`affiliate-state ${status}`}>{status}</em>
      <small>{network||"No network"}</small>
      {row.dbLink?.approvedAt&&<small>Approved {row.dbLink.approvedAt.slice(0,10)}</small>}
      {row.fallback&&<small>Legacy fallback: {row.fallback.network}</small>}
      {status==="disabled"&&row.fallback&&<small>Database disable overrides the legacy fallback.</small>}
    </div>
  </article>;
}

export function AffiliateLinkManager({rows,databaseConfigured}:{rows:ProductRow[];databaseConfigured:boolean}){
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return rows;
    return rows.filter(row=>[row.id,row.category,row.brand,row.model,row.detail].join(" ").toLowerCase().includes(q));
  },[query,rows]);
  const active=rows.filter(row=>row.dbLink?.status==="active").length;
  const disabled=rows.filter(row=>row.dbLink?.status==="disabled").length;
  const fallback=rows.filter(row=>row.fallback).length;

  return <div className="affiliate-manager">
    <div className="health-summary">
      <div><span>Catalog products</span><strong>{rows.length}</strong></div>
      <div><span>DB active</span><strong>{active}</strong></div>
      <div><span>DB disabled</span><strong>{disabled}</strong></div>
      <div><span>Legacy fallback</span><strong>{fallback}</strong></div>
    </div>

    {!databaseConfigured&&<div className="note-box"><h2>Production database is not configured</h2><p>Runtime affiliate management requires DATABASE_URL and the latest Prisma migration. Existing environment/JSON links can still work as fallback.</p></div>}

    <div className="affiliate-manager-toolbar">
      <label><span>Find product</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search helmet, tire, top box or product ID"/></label>
      <small>{filtered.length} products shown</small>
    </div>

    <div className="affiliate-admin-list">{filtered.map(row=><AffiliateRow key={row.id} row={row}/>)}</div>
  </div>;
}

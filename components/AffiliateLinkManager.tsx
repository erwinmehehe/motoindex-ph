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
    validationError?:string;
    reviewNote:string;
    approvedAt?:string;
    updatedAt:string;
  };
  fallback?:{
    network:string;
  };
  sourceListing?:{url:string;checkedAt:string;merchant?:"shopee"|"retailer";sourceName?:string};
  researchCandidate?:{sourceUrl:string;researchedAt:string;sourceKind:"shopee"|"retailer";reviewStatus:string;reviewNote:string};
  clicks7:number;
  clicks30:number;
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
      <div className="affiliate-admin-links"><Link href={row.slug} target="_blank">Open product page ↗</Link>{row.sourceListing&&<a href={row.sourceListing.url} target="_blank" rel="noopener noreferrer">{row.sourceListing.merchant==="retailer"?"Exact retailer source ↗":"Exact Shopee source ↗"}</a>}{!row.sourceListing&&row.researchCandidate&&<a href={row.researchCandidate.sourceUrl} target="_blank" rel="noopener noreferrer">Research candidate · check exact item ↗</a>}{status==="active"&&<a href={`/go/affiliate/${encodeURIComponent(row.id)}`} target="_blank" rel="noreferrer">Test redirect ↗</a>}</div>
    </div>

    {!row.sourceListing&&row.researchCandidate&&<p className="affiliate-source-note">Research candidate from {row.researchCandidate.researchedAt}. {row.researchCandidate.reviewNote} Not yet approved for public commerce or affiliate tracking.</p>}

    <div className="affiliate-admin-form">
      <label><span>Exact-product affiliate URL</span><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Specific Shopee item link or its generated tracking link"/></label>
      <small>Do not reuse a Shopee homepage, general store URL, or shared invl.me/clo1b14 and clo1b1b shortcuts. Open each tracking link first to confirm it lands on this exact product listing.</small>
      <label><span>Review note</span><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Checked merchant, exact product and destination."/></label>
      <div className="affiliate-admin-actions">
        <button type="button" disabled={saving} onClick={()=>save("active")}>{saving?"Saving…":"Save & activate"}</button>
        <button type="button" disabled={saving||(!url&&!row.fallback)} onClick={()=>save("disabled")}>Save disabled</button>
      </div>
      {row.dbLink?.validationError&&status==="needs_review"&&<small role="alert">Existing affiliate URL is blocked: {row.dbLink.validationError} Update this product with an exact-item tracking link.</small>}
      {message&&<small className={message.includes("active")?"review-success":""}>{message}</small>}
    </div>

    <div className="affiliate-admin-state">
      <em className={`affiliate-state ${status}`}>{status}</em>
      <small>{network||"No network"}</small>
      {row.dbLink?.approvedAt&&<small>Approved {row.dbLink.approvedAt.slice(0,10)}</small>}
      <small>{row.clicks7} clicks · 7 days</small>
      <small>{row.clicks30} clicks · 30 days</small>
      {row.fallback&&<small>Legacy fallback: {row.fallback.network}</small>}
      {status==="disabled"&&row.fallback&&<small>Database disable overrides the legacy fallback.</small>}
    </div>
  </article>;
}

export function AffiliateLinkManager({rows,databaseConfigured}:{rows:ProductRow[];databaseConfigured:boolean}){
  const [query,setQuery]=useState("");
  const [reviewFilter,setReviewFilter]=useState("all");
  const [bulk,setBulk]=useState("");
  const [bulkSaving,setBulkSaving]=useState(false);
  const [bulkMessage,setBulkMessage]=useState("");
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return rows.filter(row=>{
      if(q && ![row.id,row.category,row.brand,row.model,row.detail].join(" ").toLowerCase().includes(q))return false;
      if(reviewFilter==="unmatched")return !row.sourceListing&&!row.researchCandidate;
      if(reviewFilter==="candidate")return !row.sourceListing&&Boolean(row.researchCandidate);
      if(reviewFilter==="recorded")return Boolean(row.sourceListing);
      if(reviewFilter==="affiliate-active")return row.dbLink?.status==="active";
      if(reviewFilter==="no-affiliate")return row.dbLink?.status!=="active"&&!row.fallback;
      return true;
    });
  },[query,reviewFilter,rows]);
  const active=rows.filter(row=>row.dbLink?.status==="active").length;
  const disabled=rows.filter(row=>row.dbLink?.status==="disabled").length;
  const needsReview=rows.filter(row=>row.dbLink?.status==="needs_review").length;
  const fallback=rows.filter(row=>row.fallback).length;
  const shopeeSources=rows.filter(row=>row.sourceListing && row.sourceListing.merchant!=="retailer").length;
  const retailerSources=rows.filter(row=>row.sourceListing?.merchant==="retailer").length;
  const researchCandidates=rows.filter(row=>!row.sourceListing&&row.researchCandidate).length;
  const sourceResearchNeeded=rows.length-shopeeSources-retailerSources-researchCandidates;
  const clicks7=rows.reduce((sum,row)=>sum+row.clicks7,0);
  const clicks30=rows.reduce((sum,row)=>sum+row.clicks30,0);

  async function activateBulk(){
    const lines=bulk.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
    const parsed=lines.map((line,index)=>{
      const parts=line.includes("\t")?line.split("\t"):line.split("|");
      return {
        row:index+1,
        productId:(parts[0]||"").trim(),
        url:(parts[1]||"").trim(),
        reviewNote:(parts.slice(2).join(" | ")||"").trim()
      };
    });
    if(!parsed.length){setBulkMessage("Paste at least one row first.");return;}
    setBulkSaving(true);setBulkMessage("");
    try{
      const response=await fetch("/api/admin/affiliate-links/bulk",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({rows:parsed})
      });
      const result=await response.json();
      if(!response.ok||!result.ok){
        const issues=Array.isArray(result.issues)?result.issues.slice(0,6).join(" · "):"";
        setBulkMessage([result.error||"Bulk activation failed.",issues].filter(Boolean).join(" "));
        return;
      }
      setBulkMessage(`${result.activated} affiliate links activated. Refresh this page to see the updated states.`);
      setBulk("");
    }catch{
      setBulkMessage("Bulk activation failed.");
    }finally{
      setBulkSaving(false);
    }
  }

  return <div className="affiliate-manager">
    <div className="health-summary">
      <div><span>Catalog products</span><strong>{rows.length}</strong></div>
      <div><span>DB active</span><strong>{active}</strong></div>
      <div><span>DB disabled</span><strong>{disabled}</strong></div>
      <div><span>Invalid links</span><strong>{needsReview}</strong></div>
      <div><span>Legacy fallback</span><strong>{fallback}</strong></div>
      <div><span>Exact Shopee sources*</span><strong>{shopeeSources}</strong></div>
      <div><span>Retailer product sources*</span><strong>{retailerSources}</strong></div>
      <div><span>Candidates · review pending</span><strong>{researchCandidates}</strong></div>
      <div><span>Need exact-item research</span><strong>{sourceResearchNeeded}</strong></div>
      <div><span>Clicks · 7d</span><strong>{clicks7}</strong></div>
      <div><span>Clicks · 30d</span><strong>{clicks30}</strong></div>
    </div>

    <p className="affiliate-source-note">* Previously recorded editorial sources are not proof of live stock or commission tracking. Research candidates are separate, pending manual seller/model/variant verification, and are never activated as offers.</p>
    {!databaseConfigured&&<div className="note-box"><h2>Production database is not configured</h2><p>Runtime affiliate management requires DATABASE_URL and the latest Prisma migration. Existing environment/JSON links can still work as fallback.</p></div>}

    <section className="affiliate-bulk-panel">
      <div><span className="section-kicker">Bulk activation</span><h2>Paste affiliate links from Google Sheets</h2><p>Use three columns: product ID, exact-product Shopee/Involve Asia URL, review note. Generic marketplace links will be rejected. Paste tab-separated rows directly from a sheet. You can also use the <code>|</code> character as a separator.</p></div>
      <textarea value={bulk} onChange={e=>setBulk(e.target.value)} rows={6} placeholder={"kyt-d-city\thttps://invl.me/example\tChecked exact KYT D-City listing\nevo-m2\thttps://shopee.ph/example\tChecked exact EVO M2 listing"}/>
      <div className="affiliate-bulk-actions"><button type="button" disabled={bulkSaving||!databaseConfigured} onClick={activateBulk}>{bulkSaving?"Validating…":"Validate & activate all"}</button><small>{bulkMessage}</small></div>
    </section>

    <div className="affiliate-manager-toolbar">
      <label><span>Find product</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search helmet, tire, top box or product ID"/></label>
      <label><span>Review queue</span><select aria-label="Filter affiliate research status" value={reviewFilter} onChange={e=>setReviewFilter(e.target.value)}>
        <option value="all">All catalog products</option>
        <option value="unmatched">Still missing an item destination</option>
        <option value="candidate">Candidates awaiting live browser QA</option>
        <option value="recorded">Previously recorded product sources</option>
        <option value="affiliate-active">Active database affiliate links</option>
        <option value="no-affiliate">No active affiliate mapping</option>
      </select></label>
      <small>{filtered.length} products shown</small>
    </div>
    <p className="affiliate-source-note"><a href="/admin/affiliate-links/research.csv">Download outstanding research queue (CSV) ↗</a> · Includes pending candidates and unmatched products, not commission-tracked links.</p>

    <div className="affiliate-admin-list">{filtered.map(row=><AffiliateRow key={row.id} row={row}/>)}</div>
  </div>;
}

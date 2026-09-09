"use client";

import { useState } from "react";

const statuses=["new","matched","contacted","closed"] as const;

export function DealerLeadStatus({id,current}:{id:string;current:string}){
  const [status,setStatus]=useState(current);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");

  async function change(next:string){
    setSaving(true);setError("");
    try{
      const response=await fetch(`/api/admin/dealer-leads/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});
      const result=await response.json();
      if(!response.ok||!result.ok){setError(result.error||"Update failed.");return;}
      setStatus(next);
    }catch{setError("Update failed.");}
    finally{setSaving(false);}
  }

  return <div className="lead-status-control">
    <select value={status} disabled={saving} onChange={e=>change(e.target.value)}>{statuses.map(value=><option key={value} value={value}>{value}</option>)}</select>
    {error&&<small>{error}</small>}
  </div>;
}

"use client";

import { useState } from "react";

export function DealerApplicationReview({id,status,initialNote=""}:{id:string;status:string;initialNote?:string}){
  const [note,setNote]=useState(initialNote);
  const [current,setCurrent]=useState(status);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function act(action:"approve"|"reject"){
    if(note.trim().length<10){setMessage("Add a short review note explaining the verification decision.");return;}
    setSaving(true);setMessage("");
    try{
      const response=await fetch(`/api/admin/dealer-applications/${id}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action,reviewNote:note})
      });
      const result=await response.json();
      if(!response.ok||!result.ok){setMessage(result.error||"Update failed.");return;}
      setCurrent(result.status);
      setMessage(result.message||"Updated.");
    }catch{setMessage("Update failed.");}
    finally{setSaving(false);}
  }

  return <div className="dealer-application-review">
    <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="What source did you verify, and what matched?"/>
    <div className="dealer-review-actions">
      <button type="button" disabled={saving||current==="approved"} onClick={()=>act("approve")}>Approve verified dealer</button>
      <button type="button" disabled={saving||current==="rejected"} onClick={()=>act("reject")}>Reject</button>
    </div>
    <small className={current==="approved"?"review-success":""}>{message||`Current status: ${current}`}</small>
  </div>;
}

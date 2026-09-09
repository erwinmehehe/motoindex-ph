"use client";

import { useEffect, useState } from "react";

export function DealerLeadPortal({token,initialStatus}:{token:string;initialStatus:string}){
  const [status,setStatus]=useState(initialStatus);
  const [message,setMessage]=useState("");

  useEffect(()=>{
    if(initialStatus==="ready"){
      fetch(`/api/dealer-lead/${token}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"opened"})})
        .then(r=>r.json()).then(result=>{if(result.ok)setStatus(result.status)}).catch(()=>{});
    }
  },[initialStatus,token]);

  async function update(action:"contacted"|"closed"){
    setMessage("");
    const response=await fetch(`/api/dealer-lead/${token}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})});
    const result=await response.json();
    if(!response.ok||!result.ok){setMessage(result.error||"Could not update this lead.");return;}
    setStatus(result.status);
    setMessage(action==="contacted"?"Marked as contacted.":"Marked as closed.");
  }

  return <div className="dealer-lead-portal-actions">
    <span>Lead status: <strong>{status}</strong></span>
    <div className="hero-actions">
      <button className="button small" type="button" onClick={()=>update("contacted")} disabled={status==="closed"}>Mark buyer contacted</button>
      <button className="button ghost small" type="button" onClick={()=>update("closed")} disabled={status==="closed"}>Close lead</button>
    </div>
    {message&&<small>{message}</small>}
  </div>;
}

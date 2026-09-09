"use client";

import { useMemo, useState } from "react";

export function DealerLeadDeliveryControl({
  leadId,deliveryId,dealerEmail,sellerName,token,status:initialStatus,expiresAt,buyerName,modelLabel
}:{
  leadId:string;deliveryId:string;dealerEmail:string;sellerName:string;token:string;status:string;expiresAt:string;buyerName:string;modelLabel:string;
}){
  const [status,setStatus]=useState(initialStatus);
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);

  const secureUrl=typeof window!=="undefined"?`${window.location.origin}/dealer-lead/${token}`:`/dealer-lead/${token}`;
  const mailto=useMemo(()=>{
    const subject=`MotoIndex buyer request: ${modelLabel}`;
    const body=`Hi ${sellerName},\n\nA MotoIndex buyer has requested a dealer quote for ${modelLabel}.\n\nOpen the secure lead here:\n${secureUrl}\n\nBuyer: ${buyerName}\n\nThis secure link expires on ${expiresAt.slice(0,10)}. Please do not forward the buyer details outside the staff handling this request.\n\nMotoIndex PH`;
    return `mailto:${dealerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  },[buyerName,dealerEmail,expiresAt,modelLabel,secureUrl,sellerName]);

  async function prepare(){
    setSaving(true);setError("");
    try{
      const response=await fetch(`/api/admin/dealer-leads/${leadId}/deliveries/${deliveryId}`,{
        method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ready"})
      });
      const result=await response.json();
      if(!response.ok||!result.ok){setError(result.error||"Could not prepare this handoff.");return;}
      setStatus(result.status);
      window.location.href=mailto;
    }catch{setError("Could not prepare this handoff.");}
    finally{setSaving(false);}
  }

  async function copyLink(){
    if(status==="pending")await prepareStatus();
    try{await navigator.clipboard.writeText(secureUrl);}catch{setError("Could not copy the secure link.");}
  }

  async function prepareStatus(){
    const response=await fetch(`/api/admin/dealer-leads/${leadId}/deliveries/${deliveryId}`,{
      method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ready"})
    });
    const result=await response.json();
    if(!response.ok||!result.ok)throw new Error(result.error||"Could not prepare this handoff.");
    setStatus(result.status);
  }

  return <div className="lead-delivery-control">
    <div><b>{sellerName}</b><small>{dealerEmail}</small><small>Secure link expires {expiresAt.slice(0,10)}</small></div>
    <div className="lead-delivery-actions">
      <button type="button" disabled={saving||status==="cancelled"} onClick={prepare}>{saving?"Preparing…":status==="pending"?"Share by email":"Open email again"}</button>
      <button type="button" disabled={status==="cancelled"} onClick={copyLink}>Copy secure link</button>
    </div>
    <em className={`delivery-status ${status}`}>{status}</em>
    {error&&<small className="form-error">{error}</small>}
  </div>;
}

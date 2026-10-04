"use client";

import { useState } from "react";

export function DealerLeadDeliveryControl({
  leadId,deliveryId,dealerEmail,sellerName,status:initialStatus,expiresAt,buyerName,modelLabel
}:{
  leadId:string;deliveryId:string;dealerEmail:string;sellerName:string;status:string;expiresAt:string;buyerName:string;modelLabel:string;
}){
  const [status,setStatus]=useState(initialStatus);
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);

  async function issueLink(){
    const response=await fetch(`/api/admin/dealer-leads/${leadId}/deliveries/${deliveryId}`,{
      method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ready"})
    });
    const result=await response.json();
    if(!response.ok||!result.ok||!result.token)throw new Error(result.error||"Could not issue a secure handoff link.");
    setStatus(result.status);
    return `${window.location.origin}/dealer-lead/${result.token}`;
  }

  async function share(){
    setSaving(true);setError("");
    try{
      const secureUrl=await issueLink();
      const subject=`MotoIndex buyer request: ${modelLabel}`;
      const body=`Hi ${sellerName},\n\nA MotoIndex buyer has requested a dealer quote for ${modelLabel}.\n\nOpen the secure lead here:\n${secureUrl}\n\nBuyer: ${buyerName}\n\nThis secure link expires on ${expiresAt.slice(0,10)}. Please do not forward the buyer details outside the staff handling this request.\n\nMotoIndex PH`;
      window.location.href=`mailto:${dealerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }catch(error){setError(error instanceof Error?error.message:"Could not prepare this handoff.");}
    finally{setSaving(false);}
  }

  async function copyLink(){
    setSaving(true);setError("");
    try{
      const secureUrl=await issueLink();
      await navigator.clipboard.writeText(secureUrl);
    }catch(error){setError(error instanceof Error?error.message:"Could not copy the secure link.");}
    finally{setSaving(false);}
  }

  return <div className="lead-delivery-control">
    <div><b>{sellerName}</b><small>{dealerEmail}</small><small>Secure link expires {expiresAt.slice(0,10)}</small></div>
    <div className="lead-delivery-actions">
      <button type="button" disabled={saving||status==="cancelled"} onClick={share}>{saving?"Preparing…":status==="pending"?"Share by email":"Issue new email link"}</button>
      <button type="button" disabled={saving||status==="cancelled"} onClick={copyLink}>Issue + copy secure link</button>
    </div>
    <em className={`delivery-status ${status}`}>{status}</em>
    <small>Issuing a new secure link invalidates the previous handoff link.</small>
    {error&&<small className="form-error">{error}</small>}
  </div>;
}

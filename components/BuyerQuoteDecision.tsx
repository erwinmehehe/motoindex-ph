"use client";

import { useState } from "react";

export function BuyerQuoteDecision({
  token,quoteId,initialDecision
}:{token:string;quoteId:string;initialDecision?:string|null}){
  const [decision,setDecision]=useState(initialDecision||"");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function choose(next:"interested"|"declined"){
    setSaving(true);setMessage("");
    try{
      const response=await fetch(`/api/quote-status/${token}/quotes/${quoteId}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({decision:next})
      });
      const result=await response.json();
      if(!response.ok||!result.ok){setMessage(result.error||"Could not save your response.");return;}
      setDecision(next);
      setMessage(result.message||"Saved.");
    }catch{
      setMessage("Could not save your response.");
    }finally{
      setSaving(false);
    }
  }

  return <div className="buyer-quote-decision">
    <span>What do you think of this quote?</span>
    <div>
      <button type="button" className={decision==="interested"?"active":""} disabled={saving} onClick={()=>choose("interested")}>Interested</button>
      <button type="button" className={decision==="declined"?"active declined":""} disabled={saving} onClick={()=>choose("declined")}>Not for me</button>
    </div>
    {message&&<small>{message}</small>}
  </div>;
}

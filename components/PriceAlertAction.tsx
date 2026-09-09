"use client";

import { useState } from "react";

export function PriceAlertAction({
  endpoint,
  actionLabel,
  successMessage
}:{
  endpoint:string;
  actionLabel:string;
  successMessage:string;
}){
  const [state,setState]=useState<"idle"|"saving"|"success"|"error">("idle");
  const [message,setMessage]=useState("");

  async function act(){
    setState("saving");setMessage("");
    try{
      const response=await fetch(endpoint,{method:"POST"});
      const result=await response.json();
      if(!response.ok||!result.ok){
        setState("error");
        setMessage(result.error||"Could not update this price alert.");
        return;
      }
      setState("success");
      setMessage(successMessage);
    }catch{
      setState("error");
      setMessage("Could not update this price alert.");
    }
  }

  if(state==="success")return <div className="note-box price-alert-action-success"><h2>Done</h2><p>{message}</p></div>;

  return <div className="price-alert-action">
    <button className="button" type="button" onClick={act} disabled={state==="saving"}>{state==="saving"?"Saving…":actionLabel}</button>
    {state==="error"&&<p className="form-error" role="alert">{message}</p>}
  </div>;
}

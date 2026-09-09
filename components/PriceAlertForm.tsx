"use client";

import { useMemo, useState } from "react";

type AlertModel={
  id:string;
  label:string;
  currentPricePhp:number;
};

export function PriceAlertForm({models,initialModelId}:{models:AlertModel[];initialModelId?:string}){
  const defaultId=models.some(model=>model.id===initialModelId)?initialModelId||models[0]?.id:models[0]?.id||"";
  const [modelId,setModelId]=useState(defaultId);
  const selected=useMemo(()=>models.find(model=>model.id===modelId)||models[0],[modelId,models]);
  const [target,setTarget]=useState(()=>selected?Math.max(1000,Math.floor(selected.currentPricePhp*.95/100)*100):0);
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [message,setMessage]=useState("");

  function changeModel(nextId:string){
    setModelId(nextId);
    const next=models.find(model=>model.id===nextId);
    if(next)setTarget(Math.max(1000,Math.floor(next.currentPricePhp*.95/100)*100));
  }

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    setState("sending");setMessage("");
    try{
      const response=await fetch("/api/price-alerts",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          modelId,
          targetPricePhp:target,
          email:String(data.get("email")||""),
          consent:data.get("consent")==="on"
        })
      });
      const result=await response.json();
      if(!response.ok||!result.ok){
        setState("error");
        setMessage(result.error||"Could not create this price alert.");
        return;
      }
      setState("success");
      setMessage(result.message||"Check your email to confirm the alert.");
    }catch{
      setState("error");
      setMessage("Could not create this price alert.");
    }
  }

  if(!selected)return null;

  if(state==="success")return <div className="lead-form lead-form-success price-alert-success" aria-live="polite">
    <div className="lead-form-head"><span>Check your email</span><h2>Confirm the alert before it can send.</h2><p>{message}</p></div>
    <small>Confirmation links expire after 24 hours. Every threshold email includes an unsubscribe link.</small>
  </div>;

  return <form className="lead-form price-alert-form" onSubmit={submit} aria-live="polite">
    <div className="lead-form-head"><span>Threshold alert</span><h2>Email me if the published price reaches my target</h2><p>Choose a target below the current published starting-price reference. MotoIndex will only send after email confirmation.</p></div>

    <div className="lead-form-grid">
      <label className="lead-form-wide"><span>Motorcycle</span><select value={modelId} onChange={event=>changeModel(event.target.value)}>{models.map(model=><option key={model.id} value={model.id}>{model.label} · ₱{model.currentPricePhp.toLocaleString("en-PH")}</option>)}</select></label>
      <label><span>Current published starting price</span><input value={`₱${selected.currentPricePhp.toLocaleString("en-PH")}`} readOnly aria-readonly="true"/></label>
      <label><span>Alert me at or below</span><input type="number" min="1000" max={Math.max(1000,selected.currentPricePhp-1)} step="100" value={target} onChange={event=>setTarget(Number(event.target.value)||0)} required/></label>
      <label className="lead-form-wide"><span>Email</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label>
    </div>

    <label className="lead-consent"><input type="checkbox" name="consent" required/><span>I agree to receive this MotoIndex motorcycle price alert and understand that the published reference may differ from the final dealer cash price, fees, stock or promotion.</span></label>

    {state==="error"&&<p className="form-error" role="alert">{message}</p>}
    <button className="button" type="submit" disabled={state==="sending"}>{state==="sending"?"Sending confirmation…":"Create price alert"}</button>
    <small>The alert triggers only when the published starting-price reference crosses from above your target to at or below it.</small>
  </form>;
}

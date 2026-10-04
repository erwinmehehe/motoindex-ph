"use client";

import { FormEvent, useState } from "react";

export function DealerPortalSignIn(){
  const [email,setEmail]=useState("");
  const [status,setStatus]=useState("");
  const [working,setWorking]=useState(false);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setWorking(true);setStatus("");
    try{
      const response=await fetch("/api/dealer-portal/auth/request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
      });
      const data=await response.json().catch(()=>({}));
      setStatus(data.message||data.error||(response.ok?"Check your email.":"Sign-in email could not be sent."));
    }catch{
      setStatus("Sign-in email could not be sent.");
    }finally{
      setWorking(false);
    }
  }

  return <form className="lead-form" onSubmit={submit}>
    <div className="lead-form-head">
      <span>Verified dealers</span>
      <h2>Sign in to Dealer Portal</h2>
      <p>Use the email attached to an approved MotoIndex dealer account. We will send a single-use sign-in link.</p>
    </div>
    <div className="lead-form-grid">
      <label className="lead-form-wide"><span>Email</span><input type="email" required value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email"/></label>
    </div>
    <button className="button" type="submit" disabled={working}>{working?"Sending…":"Email me a sign-in link"}</button>
    {status&&<p className="muted-note" role="status">{status}</p>}
  </form>;
}

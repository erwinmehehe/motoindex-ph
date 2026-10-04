"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DealerPortalVerify({token}:{token:string}){
  const router=useRouter();
  const [working,setWorking]=useState(false);
  const [error,setError]=useState("");

  async function verify(){
    setWorking(true);setError("");
    try{
      const response=await fetch(`/api/dealer-portal/auth/verify/${encodeURIComponent(token)}`,{method:"POST"});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok){setError(data.error||"This sign-in link could not be used.");return;}
      router.replace("/dealer-portal");
      router.refresh();
    }catch{
      setError("This sign-in link could not be used.");
    }finally{
      setWorking(false);
    }
  }

  return <div className="info-card">
    <h2>Continue to Dealer Portal</h2>
    <p>This link is single-use and expires automatically.</p>
    <button className="button" type="button" onClick={verify} disabled={working}>{working?"Signing in…":"Continue"}</button>
    {error&&<p className="form-error" role="alert">{error}</p>}
  </div>;
}

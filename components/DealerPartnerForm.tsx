"use client";

import { useState } from "react";

type Result={ok:boolean;message?:string;error?:string};

const brands=["Honda","Yamaha","Suzuki","Kawasaki","KTM","CFMOTO","BMW Motorrad","Ducati","Triumph","Royal Enfield","Bristol","Zontes","Other"];

export function DealerPartnerForm(){
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [message,setMessage]=useState("");

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    setState("sending");setMessage("");
    const payload={
      businessName:String(data.get("businessName")||""),
      branchName:String(data.get("branchName")||""),
      addressLabel:String(data.get("addressLabel")||""),
      city:String(data.get("city")||""),
      province:String(data.get("province")||""),
      region:String(data.get("region")||""),
      brands:data.getAll("brands").map(String),
      website:String(data.get("website")||""),
      phone:String(data.get("phone")||""),
      contactName:String(data.get("contactName")||""),
      contactEmail:String(data.get("contactEmail")||""),
      contactMobile:String(data.get("contactMobile")||""),
      officialSourceUrl:String(data.get("officialSourceUrl")||""),
      notes:String(data.get("notes")||""),
      consent:data.get("consent")==="on",
      websiteCheck:String(data.get("websiteCheck")||"")
    };
    try{
      const response=await fetch("/api/dealer-partners",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json() as Result;
      if(!response.ok||!result.ok){setState("error");setMessage(result.error||"Application could not be saved.");return;}
      setState("success");setMessage(result.message||"Application received.");form.reset();
    }catch{setState("error");setMessage("Application could not be saved. Please try again.");}
  }

  if(state==="success")return <div className="lead-form lead-form-success" aria-live="polite"><div className="lead-form-head"><span>Application received</span><h2>We saved your dealer application.</h2><p>{message}</p></div><small>Submitting does not automatically publish a dealer profile or activate buyer-lead routing. MotoIndex reviews the branch evidence first.</small></div>;

  return <form className="lead-form dealer-partner-form" onSubmit={submit} aria-live="polite">
    <div className="lead-form-head"><span>Dealer partner application</span><h2>Apply to join the MotoIndex dealer network</h2><p>Provide the exact branch details and an official source we can use to verify the dealership.</p></div>
    <input className="form-honeypot" name="websiteCheck" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <div className="lead-form-grid">
      <label><span>Business name</span><input name="businessName" required /></label>
      <label><span>Branch name <small>optional</small></span><input name="branchName" /></label>
      <label className="lead-form-wide"><span>Branch address</span><input name="addressLabel" required /></label>
      <label><span>City</span><input name="city" required /></label>
      <label><span>Province</span><input name="province" required /></label>
      <label><span>Region <small>optional</small></span><input name="region" /></label>
      <label><span>Branch phone</span><input name="phone" required inputMode="tel" /></label>
      <label><span>Website <small>optional</small></span><input name="website" type="url" placeholder="https://..." /></label>
      <label className="lead-form-wide"><span>Official manufacturer/dealer source <small>strongly recommended</small></span><input name="officialSourceUrl" type="url" placeholder="https://..." /></label>
    </div>

    <fieldset className="dealer-brand-fieldset"><legend>Brands sold at this branch</legend><div className="dealer-brand-checks">{brands.map(brand=><label key={brand}><input type="checkbox" name="brands" value={brand}/><span>{brand}</span></label>)}</div></fieldset>

    <div className="lead-form-grid">
      <label><span>Contact person</span><input name="contactName" required autoComplete="name"/></label>
      <label><span>Contact mobile</span><input name="contactMobile" required inputMode="tel" autoComplete="tel"/></label>
      <label className="lead-form-wide"><span>Contact email</span><input name="contactEmail" type="email" required autoComplete="email"/></label>
      <label className="lead-form-wide"><span>Notes <small>optional</small></span><textarea name="notes" rows={4} placeholder="Dealer group, coverage area, financing support, or verification notes."/></label>
    </div>

    <label className="lead-consent"><input type="checkbox" name="consent" required/><span>I confirm that I am authorized to submit these branch details and agree that MotoIndex may store them, contact me about verification, and publish the business information if the branch is approved.</span></label>
    {state==="error"&&<p className="form-error" role="alert">{message}</p>}
    <button className="button" type="submit" disabled={state==="sending"}>{state==="sending"?"Saving application…":"Submit dealer application"}</button>
    <small>Applications are reviewed manually. Approval is not guaranteed, and unverified applications never receive buyer contact details.</small>
  </form>;
}

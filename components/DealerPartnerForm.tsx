"use client";

import { useState } from "react";
import { dealerPlacementLabels, dealerPlacementPlans, type DealerPlacementTier } from "@/lib/dealerPlacements";

type Result={ok:boolean;message?:string;error?:string};

const brands=["Honda","Yamaha","Suzuki","Kawasaki","KTM","CFMOTO","BMW Motorrad","Ducati","Triumph","Royal Enfield","Bristol","Zontes"];

type Props={defaultCity?:string;defaultProvince?:string;defaultPlan?:DealerPlacementTier;sourcePath?:string};

export function DealerPartnerForm({defaultCity="",defaultProvince="",defaultPlan="free",sourcePath=""}:Props){
  const [state,setState]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [message,setMessage]=useState("");
  const [submittedPlan,setSubmittedPlan]=useState<DealerPlacementTier>(defaultPlan);

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const listingPlan=String(data.get("listingPlan")||"free") as DealerPlacementTier;
    setSubmittedPlan(listingPlan);
    setState("sending");setMessage("");
    const payload={
      businessName:String(data.get("businessName")||""),
      branchName:String(data.get("branchName")||""),
      addressLabel:String(data.get("addressLabel")||""),
      city:String(data.get("city")||""),
      province:String(data.get("province")||""),
      region:String(data.get("region")||""),
      brands:data.getAll("brands").map(String),
      otherBrands:String(data.get("otherBrands")||""),
      website:String(data.get("website")||""),
      phone:String(data.get("phone")||""),
      contactName:String(data.get("contactName")||""),
      contactEmail:String(data.get("contactEmail")||""),
      contactMobile:String(data.get("contactMobile")||""),
      officialSourceUrl:String(data.get("officialSourceUrl")||""),
      listingPlan,
      sourcePath,
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

  if(state==="success")return <div className="lead-form lead-form-success" aria-live="polite"><div className="lead-form-head"><span>Application received</span><h2>We saved your dealer application.</h2><p>{message}</p></div><small>{submittedPlan==="free"?"Your free listing application will now go through branch verification.":`${dealerPlacementLabels[submittedPlan]} interest was recorded. Paid placement is discussed only after verification and never changes verification status.`}</small></div>;

  return <form className="lead-form dealer-partner-form" onSubmit={submit} aria-live="polite">
    <div className="lead-form-head"><span>Dealer listing application</span><h2>Apply for a free verified dealer listing</h2><p>Free is the default. Choose a paid option only if you also want MotoIndex to contact you about extra visibility after verification.</p></div>
    <input className="form-honeypot" name="websiteCheck" tabIndex={-1} autoComplete="off" aria-hidden="true"/>

    <fieldset className="dealer-placement-options"><legend>Listing and visibility option</legend><p>Select the free listing or register interest in one of the optional paid placements.</p>{dealerPlacementPlans.map(plan=><label className="dealer-placement-choice" key={plan.id}><input type="radio" name="listingPlan" value={plan.id} defaultChecked={plan.id===defaultPlan}/><span><strong>{plan.name}</strong><small>{plan.description}</small></span><b>{plan.price}</b></label>)}</fieldset>

    <div className="lead-form-grid">
      <label><span>Business name</span><input name="businessName" required /></label>
      <label><span>Branch name <small>optional</small></span><input name="branchName" /></label>
      <label className="lead-form-wide"><span>Branch address</span><input name="addressLabel" required /></label>
      <label><span>City</span><input name="city" required defaultValue={defaultCity} /></label>
      <label><span>Province</span><input name="province" required defaultValue={defaultProvince} /></label>
      <label><span>Region <small>optional</small></span><input name="region" /></label>
      <label><span>Branch phone</span><input name="phone" required inputMode="tel" /></label>
      <label><span>Website <small>optional</small></span><input name="website" type="url" placeholder="https://..." /></label>
      <label className="lead-form-wide"><span>Official manufacturer/dealer source <small>strongly recommended</small></span><input name="officialSourceUrl" type="url" placeholder="https://..." /></label>
    </div>

    <fieldset className="dealer-brand-fieldset"><legend>Brands sold at this branch</legend><div className="dealer-brand-checks">{brands.map(brand=><label key={brand}><input type="checkbox" name="brands" value={brand}/><span>{brand}</span></label>)}</div><label className="dealer-other-brands"><span>Other brands <small>comma separated</small></span><input name="otherBrands" placeholder="e.g. Kymco, Vespa"/></label></fieldset>

    <div className="lead-form-grid">
      <label><span>Contact person</span><input name="contactName" required autoComplete="name"/></label>
      <label><span>Contact mobile</span><input name="contactMobile" required inputMode="tel" autoComplete="tel"/></label>
      <label className="lead-form-wide"><span>Contact email</span><input name="contactEmail" type="email" required autoComplete="email"/></label>
      <label className="lead-form-wide"><span>Notes <small>optional</small></span><textarea name="notes" rows={4} placeholder="Dealer group, coverage area, financing support, or featured-placement questions."/></label>
    </div>

    <label className="lead-consent"><input type="checkbox" name="consent" required/><span>I confirm that I am authorized to submit these branch details and agree that MotoIndex may store them, contact me about verification, and publish the business information if the branch is approved.</span></label>
    {state==="error"&&<p className="form-error" role="alert">{message}</p>}
    <button className="button" type="submit" disabled={state==="sending"}>{state==="sending"?"Saving application…":"Submit dealer application"}</button>
    <small>The verified standard listing is free. Selecting a paid option creates no charge and does not guarantee placement or buyer leads.</small>
  </form>;
}

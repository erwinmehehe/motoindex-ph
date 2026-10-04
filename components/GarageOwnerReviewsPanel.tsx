"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Bike={
  garageMotorcycleLocalId:string;
  modelExternalId:string;
  label:string;
  variantLabel:string|null;
  modelYear:number|null;
  purchaseDate:string|null;
  odometerKm:number;
};

type Review={
  id:string;
  garageMotorcycleLocalId:string;
  modelExternalId:string;
  status:string;
  moderatorNote:string|null;
  submittedAt:string;
  reviewedAt:string|null;
  summary:string;
  likes:string;
  dislikes:string;
  ownershipMonths:number;
  odometerKm:number;
  comfortRating:number;
  cityTrafficRating:number;
  maintenanceRating:number;
  passengerRating:number|null;
  highwayRating:number|null;
  fuelEconomyKmpl:number|null;
  annualMaintenancePhp:number|null;
  unscheduledRepairsCount:number;
  intelligenceConsent:boolean;
};

type State={
  loading:boolean;
  available:boolean;
  authenticated:boolean;
  bikes:Bike[];
  reviews:Review[];
  message:string;
};

function RatingOptions({optional=false}:{optional?:boolean}){
  return <>
    {optional&&<option value="">Not enough experience</option>}
    {[1,2,3,4,5].map(value=><option value={value} key={value}>{value} / 5</option>)}
  </>;
}

export function GarageOwnerReviewsPanel(){
  const [state,setState]=useState<State>({loading:true,available:false,authenticated:false,bikes:[],reviews:[],message:""});
  const [selectedId,setSelectedId]=useState("");
  const [working,setWorking]=useState(false);

  async function load(){
    const response=await fetch("/api/owner-reviews",{cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(response.status===401){
      setState({loading:false,available:Boolean(data.available),authenticated:false,bikes:[],reviews:[],message:""});
      return;
    }
    if(!response.ok||!data.available){
      setState({loading:false,available:false,authenticated:false,bikes:[],reviews:[],message:""});
      return;
    }
    const bikes=Array.isArray(data.bikes)?data.bikes:[];
    const reviews=Array.isArray(data.reviews)?data.reviews:[];
    setState({loading:false,available:true,authenticated:true,bikes,reviews,message:""});
    setSelectedId(current=>current&&bikes.some((bike:Bike)=>bike.garageMotorcycleLocalId===current)?current:(bikes[0]?.garageMotorcycleLocalId||""));
  }

  useEffect(()=>{void load();},[]);

  const selectedBike=state.bikes.find(bike=>bike.garageMotorcycleLocalId===selectedId)||null;
  const current=useMemo(
    ()=>state.reviews.find(review=>review.garageMotorcycleLocalId===selectedId||(selectedBike&&review.modelExternalId===selectedBike.modelExternalId))||null,
    [state.reviews,selectedId,selectedBike]
  );

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setWorking(true);
    setState(currentState=>({...currentState,message:""}));
    const form=new FormData(event.currentTarget);
    const payload=Object.fromEntries(form.entries());
    payload.garageMotorcycleLocalId=selectedId;
    const response=await fetch("/api/owner-reviews",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const data=await response.json().catch(()=>({}));
    setWorking(false);
    if(!response.ok){
      setState(currentState=>({...currentState,message:data.error||"Review could not be submitted."}));
      return;
    }
    await load();
    setState(currentState=>({...currentState,message:data.message||"Review submitted for moderation."}));
  }

  async function remove(reviewId:string){
    if(!window.confirm("Delete this owner review? If it is published, it will disappear from the public model page."))return;
    setWorking(true);
    const response=await fetch("/api/owner-reviews",{
      method:"DELETE",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({reviewId})
    });
    setWorking(false);
    if(response.ok){
      await load();
      setState(currentState=>({...currentState,message:"Owner review deleted."}));
    }else{
      const data=await response.json().catch(()=>({}));
      setState(currentState=>({...currentState,message:data.error||"Review could not be deleted."}));
    }
  }

  if(state.loading||!state.available)return null;

  if(!state.authenticated){
    return <section className="info-card">
      <span className="field-label">Owner reviews</span>
      <h2>Share real ownership experience</h2>
      <p>Sign in to your MotoIndex account and save a private cloud Garage copy before submitting a Garage-verified owner review.</p>
    </section>;
  }

  if(!state.bikes.length){
    return <section className="info-card">
      <span className="field-label">Owner reviews</span>
      <h2>{state.reviews.length?"Manage your owner reviews":"Save an exact MotoIndex motorcycle to your cloud Garage first"}</h2>
      <p>{state.reviews.length
        ?"You can still delete a previous review even if that motorcycle is no longer in your current cloud Garage. Add the motorcycle back to Garage if you want to edit and resubmit it."
        :"Reviews are accepted only for a motorcycle linked to a MotoIndex model in your private cloud Garage."}</p>
      {state.reviews.length>0&&<div className="spec-grid">
        {state.reviews.map(review=><article className="info-card" key={review.id}>
          <strong>{review.modelExternalId}</strong>
          <small>Status: {review.status}</small>
          <button className="button small ghost" type="button" disabled={working} onClick={()=>void remove(review.id)}>Delete review</button>
        </article>)}
      </div>}
      <button className="button small ghost" type="button" onClick={()=>void load()}>Refresh review eligibility</button>
      {state.message&&<p className="muted-note" role="status">{state.message}</p>}
    </section>;
  }

  return <section className="info-card">
    <div className="section-head">
      <div>
        <span className="field-label">Garage-verified owner reviews</span>
        <h2>Share what ownership is actually like</h2>
        <p>Your public review is anonymous. MotoIndex verifies only that the review came from a signed-in account with the matching motorcycle saved in its private cloud Garage. Registration documents are not inspected.</p>
      </div>
      <button className="button small ghost" type="button" onClick={()=>void load()} disabled={working}>Refresh</button>
    </div>

    <label className="lead-form-wide">Motorcycle
      <select value={selectedId} onChange={event=>setSelectedId(event.target.value)}>
        {state.bikes.map(bike=><option value={bike.garageMotorcycleLocalId} key={bike.garageMotorcycleLocalId}>
          {bike.label}{bike.variantLabel?" · "+bike.variantLabel:""}{bike.modelYear?" · "+bike.modelYear:""}
        </option>)}
      </select>
    </label>

    {selectedBike&&<form className="lead-form" onSubmit={submit} key={selectedId+":"+(current?.submittedAt||"new")}>
      <div className="lead-form-head">
        <span>{current?"Current status: "+current.status:"New review"}</span>
        <h3>{selectedBike.label}</h3>
        <p>{selectedBike.odometerKm.toLocaleString("en-PH")} km currently saved in cloud Garage. Editing a published review sends it back to moderation.</p>
      </div>
      <div className="lead-form-grid">
        <label><span>Comfort</span><select name="comfortRating" required defaultValue={current?.comfortRating||""}><option value="" disabled>Rate 1–5</option><RatingOptions/></select></label>
        <label><span>City traffic</span><select name="cityTrafficRating" required defaultValue={current?.cityTrafficRating||""}><option value="" disabled>Rate 1–5</option><RatingOptions/></select></label>
        <label><span>Maintenance experience</span><select name="maintenanceRating" required defaultValue={current?.maintenanceRating||""}><option value="" disabled>Rate 1–5</option><RatingOptions/></select></label>
        <label><span>Passenger use</span><select name="passengerRating" defaultValue={current?.passengerRating||""}><RatingOptions optional/></select></label>
        <label><span>Highway use</span><select name="highwayRating" defaultValue={current?.highwayRating||""}><RatingOptions optional/></select></label>
        <label><span>Months owned</span><input name="ownershipMonths" type="number" min="1" max="600" defaultValue={current?.ownershipMonths||""} placeholder={selectedBike.purchaseDate?"Calculated from Garage purchase date":"Required if purchase date is missing"}/></label>
        <label><span>Real fuel economy <small>optional km/L</small></span><input name="fuelEconomyKmpl" type="number" min="5" max="100" step="0.1" defaultValue={current?.fuelEconomyKmpl||""}/></label>
        <label><span>Annual maintenance <small>optional ₱</small></span><input name="annualMaintenancePhp" type="number" min="0" max="300000" step="100" defaultValue={current?.annualMaintenancePhp||""}/></label>
        <label><span>Unscheduled repairs</span><input name="unscheduledRepairsCount" type="number" min="0" max="50" required defaultValue={current?.unscheduledRepairsCount??0}/></label>
        <label className="lead-form-wide"><span>Ownership summary</span><textarea name="summary" rows={5} minLength={60} maxLength={1200} required defaultValue={current?.summary||""} placeholder="What should another rider know after living with this motorcycle?"/></label>
        <label className="lead-form-wide"><span>What you like</span><textarea name="likes" rows={3} minLength={10} maxLength={500} required defaultValue={current?.likes||""}/></label>
        <label className="lead-form-wide"><span>What you dislike</span><textarea name="dislikes" rows={3} minLength={10} maxLength={500} required defaultValue={current?.dislikes||""}/></label>
        <label className="lead-form-wide"><span>Publication consent</span><span><input name="publishConsent" type="checkbox" value="yes" required/> I understand this review will be public and anonymous after moderation, using the model/year/variant, ownership duration, odometer and review details shown here.</span></label>
        <label className="lead-form-wide"><span>Anonymous owner intelligence <small>optional</small></span><span><input name="intelligenceConsent" type="checkbox" value="yes" defaultChecked={Boolean(current?.intelligenceConsent)}/> I also allow MotoIndex to calculate anonymous aggregate ownership metrics from this motorcycle's current cloud Garage. Only derived values and coarse maintenance-category counts are saved for intelligence; raw Garage records, notes, documents, plate numbers and provider details are not published or copied into the intelligence dataset.</span></label>
      </div>
      <div className="hero-actions">
        <button className="button small" type="submit" disabled={working}>{working?"Submitting…":current?"Update and resubmit":"Submit for moderation"}</button>
        {current&&<button className="button small ghost" type="button" disabled={working} onClick={()=>void remove(current.id)}>Delete review</button>}
      </div>
      {current?.moderatorNote&&<p className="muted-note">Moderator note: {current.moderatorNote}</p>}
    </form>}
    {state.message&&<p className="muted-note" role="status">{state.message}</p>}
  </section>;
}

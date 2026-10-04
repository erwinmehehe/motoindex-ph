"use client";

import { useEffect, useState } from "react";
import type { PublicOwnerReview } from "@/lib/ownerReviewPolicy";

type Summary={
  reviewCount:number;
  ratingSampleReady:boolean;
  ratings:{comfort:number|null;cityTraffic:number|null;maintenance:number|null;passenger:number|null;highway:number|null}|null;
  fuelEconomyKmpl:number|null;
  fuelSample:number;
  annualMaintenancePhp:number|null;
  maintenanceSample:number;
};

function money(value:number){
  return new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(value);
}

function rating(value:number|null){
  return value===null?"—":value.toFixed(1)+" / 5";
}

export function OwnerReviewsPanel({modelId}:{modelId:string}){
  const [state,setState]=useState<{loading:boolean;available:boolean;reviews:PublicOwnerReview[];summary:Summary|null}>({loading:true,available:false,reviews:[],summary:null});

  useEffect(()=>{
    let cancelled=false;
    fetch("/api/owner-reviews/public?modelId="+encodeURIComponent(modelId),{cache:"no-store"})
      .then(response=>response.json())
      .then(data=>{if(!cancelled)setState({loading:false,available:Boolean(data.available),reviews:Array.isArray(data.reviews)?data.reviews:[],summary:data.summary||null});})
      .catch(()=>{if(!cancelled)setState({loading:false,available:false,reviews:[],summary:null});});
    return()=>{cancelled=true;};
  },[modelId]);

  if(state.loading||!state.available||!state.reviews.length)return null;
  const summary=state.summary;

  return <section className="owner-reviews-section" aria-labelledby={"owner-reviews-"+modelId}>
    <div className="section-head">
      <div>
        <span className="field-label">Garage-verified owner reviews</span>
        <h2 id={"owner-reviews-"+modelId}>What owners report</h2>
        <p>Anonymous reviews submitted from a matching motorcycle in MotoIndex My Garage and manually moderated before publication. MotoIndex does not inspect registration documents.</p>
      </div>
    </div>

    {summary?.ratingSampleReady&&summary.ratings&&<div className="spec-grid owner-review-summary">
      <div><span>Published owners</span><strong>{summary.reviewCount}</strong><small>Minimum 3 for rating averages</small></div>
      <div><span>Comfort</span><strong>{rating(summary.ratings.comfort)}</strong></div>
      <div><span>City traffic</span><strong>{rating(summary.ratings.cityTraffic)}</strong></div>
      <div><span>Maintenance</span><strong>{rating(summary.ratings.maintenance)}</strong></div>
      {summary.fuelEconomyKmpl!==null&&<div><span>Owner-reported fuel economy</span><strong>{summary.fuelEconomyKmpl.toFixed(1)} km/L</strong><small>{summary.fuelSample} published reports</small></div>}
      {summary.annualMaintenancePhp!==null&&<div><span>Owner-reported annual maintenance</span><strong>{money(summary.annualMaintenancePhp)}</strong><small>{summary.maintenanceSample} published reports</small></div>}
    </div>}

    {!summary?.ratingSampleReady&&<div className="note-box"><strong>{state.reviews.length} published Garage-verified review{state.reviews.length===1?"":"s"}</strong><p>MotoIndex waits for at least 3 published owners before showing rating averages, and at least 5 reports before showing aggregated fuel or maintenance figures.</p></div>}

    <div className="owner-review-list">
      {state.reviews.map(review=><article className="owner-review-card" key={review.id}>
        <div className="owner-review-card-head">
          <div><strong>Garage-verified owner</strong><small>{review.modelYear?review.modelYear+" · ":""}{review.variantLabel?review.variantLabel+" · ":""}{review.ownershipMonths} months owned · {review.odometerKm.toLocaleString("en-PH")} km</small></div>
          <small>Published {new Date(review.publishedAt).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"})}</small>
        </div>
        <p>{review.summary}</p>
        <div className="owner-review-dimensions">
          <span>Comfort {review.comfortRating}/5</span>
          <span>City {review.cityTrafficRating}/5</span>
          <span>Maintenance {review.maintenanceRating}/5</span>
          {review.passengerRating&&<span>Passenger {review.passengerRating}/5</span>}
          {review.highwayRating&&<span>Highway {review.highwayRating}/5</span>}
        </div>
        <div className="owner-review-pros-cons">
          <div><span>Likes</span><p>{review.likes}</p></div>
          <div><span>Dislikes</span><p>{review.dislikes}</p></div>
        </div>
        <p className="muted-note">
          {review.fuelEconomyKmpl?"Owner-reported fuel economy: "+review.fuelEconomyKmpl.toFixed(1)+" km/L. ":""}
          {review.annualMaintenancePhp!==null?"Owner-reported annual maintenance: "+money(review.annualMaintenancePhp)+". ":""}
          Unscheduled repairs reported: {review.unscheduledRepairsCount}.
        </p>
      </article>)}
    </div>
  </section>;
}

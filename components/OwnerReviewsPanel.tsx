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
type Intelligence={
  contributorCount:number;
  ready:boolean;
  monthlyRunningCostPhp:number|null;
  monthlyRunningCostSample:number;
  annualMaintenancePhp:number|null;
  annualMaintenanceSample:number;
  fuelEconomyKmpl:number|null;
  fuelEconomySample:number;
  tireLifeKm:number|null;
  tireLifeSample:number;
  maintenanceEventsPer10kKm:number|null;
  maintenanceEventsSample:number;
  repairsPer10kKm:number|null;
  repairsSample:number;
  commonMaintenance:Array<{category:string;eventCount:number;ownerSample:number}>;
};

function money(value:number){
  return new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(value);
}

function rating(value:number|null){
  return value===null?"—":value.toFixed(1)+" / 5";
}

export function OwnerReviewsPanel({modelId}:{modelId:string}){
  const [state,setState]=useState<{loading:boolean;available:boolean;reviews:PublicOwnerReview[];summary:Summary|null;intelligence:Intelligence|null}>({loading:true,available:false,reviews:[],summary:null,intelligence:null});

  useEffect(()=>{
    let cancelled=false;
    fetch("/api/owner-reviews/public?modelId="+encodeURIComponent(modelId),{cache:"no-store"})
      .then(response=>response.json())
      .then(data=>{if(!cancelled)setState({loading:false,available:Boolean(data.available),reviews:Array.isArray(data.reviews)?data.reviews:[],summary:data.summary||null,intelligence:data.intelligence||null});})
      .catch(()=>{if(!cancelled)setState({loading:false,available:false,reviews:[],summary:null,intelligence:null});});
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

    {state.intelligence?.ready&&<section className="note-box owner-intelligence-block" aria-label="Anonymous owner intelligence">
      <span className="field-label">Owner Intelligence</span>
      <h3>What Garage data shows in real ownership</h3>
      <p>These figures use only owners who separately opted in to anonymous Garage-derived intelligence and whose Garage history met the minimum logging depth for each metric. MotoIndex stores derived metrics rather than publishing raw Garage records.</p>
      <div className="spec-grid">
        {state.intelligence.monthlyRunningCostPhp!==null&&<div><span>Average logged monthly running cost</span><strong>{money(state.intelligence.monthlyRunningCostPhp)}</strong><small>{state.intelligence.monthlyRunningCostSample} owner samples</small></div>}
        {state.intelligence.fuelEconomyKmpl!==null&&<div><span>Garage-derived fuel economy</span><strong>{state.intelligence.fuelEconomyKmpl.toFixed(1)} km/L</strong><small>{state.intelligence.fuelEconomySample} owner samples</small></div>}
        {state.intelligence.annualMaintenancePhp!==null&&<div><span>Annualized logged maintenance spend</span><strong>{money(state.intelligence.annualMaintenancePhp)}</strong><small>{state.intelligence.annualMaintenanceSample} owner samples</small></div>}
        {state.intelligence.tireLifeKm!==null&&<div><span>Observed tire replacement interval</span><strong>{Math.round(state.intelligence.tireLifeKm).toLocaleString("en-PH")} km</strong><small>{state.intelligence.tireLifeSample} owner samples</small></div>}
        {state.intelligence.maintenanceEventsPer10kKm!==null&&<div><span>Logged maintenance events</span><strong>{state.intelligence.maintenanceEventsPer10kKm.toFixed(1)} / 10,000 km</strong><small>{state.intelligence.maintenanceEventsSample} owner samples</small></div>}
        {state.intelligence.repairsPer10kKm!==null&&<div><span>Logged repair events</span><strong>{state.intelligence.repairsPer10kKm.toFixed(1)} / 10,000 km</strong><small>{state.intelligence.repairsSample} owner samples</small></div>}
      </div>
      {state.intelligence.commonMaintenance.length>0&&<div className="seller-tags" aria-label="Common logged maintenance categories">
        {state.intelligence.commonMaintenance.map(item=><span key={item.category}>{item.category} · {item.ownerSample} owners</span>)}
      </div>}
    </section>}

    <div className="dealer-application-list">
      {state.reviews.map(review=><article className="dealer-application-card" key={review.id}>
        <div className="section-head">
          <div><strong>Garage-verified owner</strong><small>{review.modelYear?review.modelYear+" · ":""}{review.variantLabel?review.variantLabel+" · ":""}{review.ownershipMonths} months owned · {review.odometerKm.toLocaleString("en-PH")} km</small></div>
          <small>Published {new Date(review.publishedAt).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"})}</small>
        </div>
        <p>{review.summary}</p>
        <div className="seller-tags">
          <span>Comfort {review.comfortRating}/5</span>
          <span>City {review.cityTrafficRating}/5</span>
          <span>Maintenance {review.maintenanceRating}/5</span>
          {review.passengerRating&&<span>Passenger {review.passengerRating}/5</span>}
          {review.highwayRating&&<span>Highway {review.highwayRating}/5</span>}
        </div>
        <div className="dealer-application-details">
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

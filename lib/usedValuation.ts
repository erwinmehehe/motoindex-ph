import type { PublicUsedListing } from "@/lib/persistentUsedListings";

export type ValuationCondition = "fair" | "good" | "excellent";

export type UsedValuationInput = {
  modelId: string;
  modelYear: number;
  mileageKm: number;
  condition: ValuationCondition;
  location?: string;
  currentSrpPhp: number;
  currentYear?: number;
};

export type UsedValuationAdjustment = { label: string; amountPhp: number; basis: string };

export type UsedMotorcycleValuation = {
  modelId: string;
  comparableCount: number;
  sameRegionComparableCount: number;
  confidence: "low" | "medium" | "high";
  privateSale: { lowPhp: number; midpointPhp: number; highPhp: number };
  dealerTrade: { lowPhp: number; midpointPhp: number; highPhp: number };
  baselinePhp: number;
  adjustments: UsedValuationAdjustment[];
  assumptions: string[];
  comparableIds: string[];
  generatedAt: string;
};

const CONDITION_MULTIPLIER: Record<ValuationCondition, number> = { fair: 0.90, good: 1, excellent: 1.06 };

function round500(value:number){ return Math.max(0,Math.round(value/500)*500); }
function median(values:number[]){
  if(!values.length)return 0;
  const ordered=[...values].sort((a,b)=>a-b);
  const mid=Math.floor(ordered.length/2);
  return ordered.length%2?ordered[mid]:(ordered[mid-1]+ordered[mid])/2;
}
function mad(values:number[],center:number){ return median(values.map(value=>Math.abs(value-center))); }

function cleanLocation(value?:string){
  return (value||"").toLowerCase().replace(/\b(city|province|metro|municipality)\b/g," ")
    .replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
}
function sameRegion(a?:string,b?:string){
  const left=cleanLocation(a),right=cleanLocation(b);
  if(!left||!right)return false;
  if(left===right)return true;
  const leftTail=left.split(" ").slice(-2).join(" ");
  const rightTail=right.split(" ").slice(-2).join(" ");
  return leftTail.length>=4&&leftTail===rightTail;
}
function conditionAdjustment(base:number,subject:ValuationCondition,comparable:string){
  const comp=comparable in CONDITION_MULTIPLIER?comparable as ValuationCondition:"good";
  return base*(CONDITION_MULTIPLIER[subject]/CONDITION_MULTIPLIER[comp]-1);
}
function adjustedComparablePrice(listing:PublicUsedListing,input:UsedValuationInput,regionFactor:number){
  const price=listing.askingPricePhp;
  const yearDifference=input.modelYear-listing.modelYear;
  const yearAmount=price*Math.max(-.30,Math.min(.30,yearDifference*.06));
  const mileageDifference=listing.mileageKm-input.mileageKm;
  const mileageRate=price*.03/10_000;
  const mileageAmount=Math.max(-price*.18,Math.min(price*.18,mileageDifference*mileageRate));
  const conditionAmount=conditionAdjustment(price,input.condition,listing.condition);
  const regionAmount=sameRegion(input.location,listing.location)?price*regionFactor:0;
  return {id:listing.id,value:Math.max(price*.55,Math.min(price*1.55,price+yearAmount+mileageAmount+conditionAmount+regionAmount))};
}
function fallbackValue(input:UsedValuationInput){
  const year=input.currentYear||new Date().getFullYear();
  const age=Math.max(0,Math.min(12,year-input.modelYear));
  let factor=1;
  for(let current=1;current<=age;current+=1)factor*=1-(current===1?.15:current===2?.10:current<=5?.08:.06);
  const mileagePenalty=Math.max(-.18,Math.min(.08,(10_000-input.mileageKm)/10_000*.025));
  return input.currentSrpPhp*factor*CONDITION_MULTIPLIER[input.condition]*(1+mileagePenalty);
}

export function estimateUsedMotorcycleValue(listings:PublicUsedListing[],input:UsedValuationInput,now=new Date()):UsedMotorcycleValuation{
  const raw=listings.filter(item=>item.modelExternalId===input.modelId)
    .filter(item=>Number.isFinite(item.askingPricePhp)&&item.askingPricePhp>=3_000).slice(0,100);
  const rawMedian=median(raw.map(item=>item.askingPricePhp));
  const filtered=rawMedian?raw.filter(item=>item.askingPricePhp>=rawMedian*.55&&item.askingPricePhp<=rawMedian*1.65):raw;

  const regionListings=filtered.filter(item=>sameRegion(input.location,item.location));
  const allMedian=median(filtered.map(item=>item.askingPricePhp));
  const regionMedian=median(regionListings.map(item=>item.askingPricePhp));
  const regionFactor=regionListings.length>=2&&allMedian>0?Math.max(-.08,Math.min(.08,regionMedian/allMedian-1)):0;

  const adjusted=filtered.map(item=>adjustedComparablePrice(item,input,regionFactor));
  const comparableValues=adjusted.map(item=>item.value);
  const compMid=median(comparableValues);
  const fallback=fallbackValue(input);

  let midpoint:number;
  let confidence:UsedMotorcycleValuation["confidence"];
  if(filtered.length>=5){midpoint=compMid;confidence="high";}
  else if(filtered.length>=3){midpoint=compMid*.85+fallback*.15;confidence="medium";}
  else if(filtered.length>=1){midpoint=compMid*.65+fallback*.35;confidence="low";}
  else{midpoint=fallback;confidence="low";}

  const dispersion=comparableValues.length>=2&&compMid>0?mad(comparableValues,compMid)/compMid:0;
  const spread=Math.max(.07,Math.min(.18,dispersion*1.5||.10));
  const privateMid=round500(midpoint);
  const privateLow=round500(midpoint*(1-spread));
  const privateHigh=round500(midpoint*(1+spread));
  const tradeMid=round500(privateMid*.80);
  const tradeLow=round500(privateMid*.72);
  const tradeHigh=round500(privateMid*.86);

  const baseline=filtered.length?round500(allMedian):round500(fallback);
  const subjectYearDelta=filtered.length?input.modelYear-Math.round(median(filtered.map(item=>item.modelYear))):0;
  const medianMileage=filtered.length?median(filtered.map(item=>item.mileageKm)):input.mileageKm;
  const mileageDelta=medianMileage-input.mileageKm;
  const adjustments:UsedValuationAdjustment[]=[];

  if(subjectYearDelta)adjustments.push({
    label:"Model year",
    amountPhp:round500(baseline*Math.max(-.30,Math.min(.30,subjectYearDelta*.06))),
    basis:`${subjectYearDelta>0?"+":""}${subjectYearDelta} year(s) versus the median comparable year`
  });
  if(Math.abs(mileageDelta)>=500)adjustments.push({
    label:"Mileage",
    amountPhp:round500(Math.max(-baseline*.18,Math.min(baseline*.18,mileageDelta*(baseline*.03/10_000)))),
    basis:`${Math.round(Math.abs(mileageDelta)).toLocaleString("en-PH")} km ${mileageDelta>0?"below":"above"} the median comparable mileage`
  });
  if(input.condition!=="good")adjustments.push({
    label:"Condition",
    amountPhp:round500(baseline*(CONDITION_MULTIPLIER[input.condition]-1)),
    basis:`${input.condition} seller-selected condition versus the good-condition reference`
  });
  if(regionFactor)adjustments.push({
    label:"Region",
    amountPhp:round500(baseline*regionFactor),
    basis:`${regionListings.length} same-region verified comparable${regionListings.length===1?"":"s"}`
  });

  return {
    modelId:input.modelId,
    comparableCount:filtered.length,
    sameRegionComparableCount:regionListings.length,
    confidence,
    privateSale:{lowPhp:privateLow,midpointPhp:privateMid,highPhp:privateHigh},
    dealerTrade:{lowPhp:tradeLow,midpointPhp:tradeMid,highPhp:tradeHigh},
    baselinePhp:baseline,
    adjustments,
    assumptions:[
      "Comparable prices are verified active asking prices, not completed sale prices.",
      "Year, mileage and condition adjustments are bounded planning assumptions so one field cannot dominate the estimate.",
      "A regional adjustment is used only when at least two same-region verified comparables exist.",
      "Dealer/trade values are a planning band derived from the private-sale estimate, not observed dealer bids.",
      filtered.length<3
        ?"Fewer than three verified comparables are available, so the estimate also leans on MotoIndex's age-based value reference."
        :"The estimate is primarily anchored to verified comparable listings."
    ],
    comparableIds:adjusted.map(item=>item.id),
    generatedAt:now.toISOString()
  };
}

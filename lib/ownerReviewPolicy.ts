export const OWNER_REVIEW_MIN_RATING_SAMPLE = 3;
export const OWNER_REVIEW_MIN_METRIC_SAMPLE = 5;

export type PublicOwnerReview = {
  id:string;
  modelExternalId:string;
  variantLabel:string|null;
  modelYear:number|null;
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
  summary:string;
  likes:string;
  dislikes:string;
  publishedAt:string;
};

export function cleanReviewText(value:unknown,max:number){
  return typeof value==="string"?value.trim().replace(/\s+/g," ").slice(0,max):"";
}

export function requiredRating(value:unknown){
  const n=Number(value);
  return Number.isInteger(n)&&n>=1&&n<=5?n:null;
}

export function optionalRating(value:unknown){
  if(value===undefined||value===null||value==="")return null;
  return requiredRating(value);
}

export function boundedNumber(value:unknown,min:number,max:number){
  if(value===undefined||value===null||value==="")return null;
  const n=Number(value);
  return Number.isFinite(n)&&n>=min&&n<=max?n:null;
}

export function boundedInteger(value:unknown,min:number,max:number){
  const n=Number(value);
  return Number.isInteger(n)&&n>=min&&n<=max?n:null;
}

export function ownershipMonthsFromDate(purchaseDate?:string){
  if(!purchaseDate)return null;
  const date=new Date(`${purchaseDate}T00:00:00`);
  if(!Number.isFinite(date.getTime())||date.getTime()>Date.now())return null;
  const now=new Date();
  const months=(now.getFullYear()-date.getFullYear())*12+(now.getMonth()-date.getMonth());
  return Math.max(1,Math.min(600,months||1));
}

function average(values:number[]){
  return values.length?Math.round((values.reduce((sum,n)=>sum+n,0)/values.length)*10)/10:null;
}

export function summarizeOwnerReviews(reviews:PublicOwnerReview[]){
  const ratingReady=reviews.length>=OWNER_REVIEW_MIN_RATING_SAMPLE;
  const fuel=reviews.map(r=>r.fuelEconomyKmpl).filter((v):v is number=>typeof v==="number");
  const maintenance=reviews.map(r=>r.annualMaintenancePhp).filter((v):v is number=>typeof v==="number");
  return {
    reviewCount:reviews.length,
    ratingSampleReady:ratingReady,
    ratings:ratingReady?{
      comfort:average(reviews.map(r=>r.comfortRating)),
      cityTraffic:average(reviews.map(r=>r.cityTrafficRating)),
      maintenance:average(reviews.map(r=>r.maintenanceRating)),
      passenger:average(reviews.map(r=>r.passengerRating).filter((v):v is number=>typeof v==="number")),
      highway:average(reviews.map(r=>r.highwayRating).filter((v):v is number=>typeof v==="number")),
    }:null,
    fuelEconomyKmpl:fuel.length>=OWNER_REVIEW_MIN_METRIC_SAMPLE?average(fuel):null,
    fuelSample:fuel.length,
    annualMaintenancePhp:maintenance.length>=OWNER_REVIEW_MIN_METRIC_SAMPLE?average(maintenance):null,
    maintenanceSample:maintenance.length,
  };
}

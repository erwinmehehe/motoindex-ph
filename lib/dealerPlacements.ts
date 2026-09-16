export type DealerPlacementTier="free"|"featured-city"|"brand-city"|"city-sponsor";
export type PaidDealerPlacementTier=Exclude<DealerPlacementTier,"free">;

export type DealerPlacementPlan={
  id:DealerPlacementTier;
  name:string;
  price:string;
  description:string;
  features:string[];
  paid:boolean;
};

export type DealerPlacement={
  sellerSlug:string;
  citySlug:string;
  tier:PaidDealerPlacementTier;
  brand?:string;
  startsAt:string;
  endsAt:string;
};

export const dealerPlacementPlans:DealerPlacementPlan[]=[
  {
    id:"free",
    name:"Free Verified Listing",
    price:"₱0",
    description:"Permanent directory presence after branch verification.",
    features:["Verified public dealer profile","City and brand directory visibility","Phone, address and website details","Eligibility for relevant buyer quote matching"],
    paid:false
  },
  {
    id:"featured-city",
    name:"Featured Dealer",
    price:"₱1,500 / month",
    description:"Priority visibility for one verified branch in one city.",
    features:["Featured section above standard listings","Clearly labeled paid placement","Stronger call-to-action visibility","One city placement"],
    paid:true
  },
  {
    id:"brand-city",
    name:"Brand + City Featured",
    price:"₱3,000 / month",
    description:"Priority placement tied to a motorcycle brand and city.",
    features:["Brand-specific featured label","Priority city visibility","Useful for brand-focused dealers","Limited placements per brand and city"],
    paid:true
  },
  {
    id:"city-sponsor",
    name:"City Sponsor",
    price:"From ₱5,000 / month",
    description:"Highest-visibility dealer placement for a local market.",
    features:["Top position in the featured dealer section","City Sponsor label","Highest dealer-directory visibility","Limited availability by city"],
    paid:true
  }
];

export const dealerPlacementLabels:Record<DealerPlacementTier,string>={
  free:"Free Verified Listing",
  "featured-city":"Featured Dealer",
  "brand-city":"Brand + City Featured",
  "city-sponsor":"City Sponsor"
};

export function normalizeDealerPlacementTier(value:string|undefined|null):DealerPlacementTier{
  if(value==="featured")return "featured-city";
  return dealerPlacementPlans.some(plan=>plan.id===value)?value as DealerPlacementTier:"free";
}

// Paid placement is deliberately separate from dealer verification.
// Add an entry only after a commercial placement is approved and paid.
// Keeping this list empty guarantees that verification alone never grants
// sponsored visibility.
export const dealerPlacements:DealerPlacement[]=[];

function normalizeCity(value:string){
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}

export function activeDealerPlacementsForCity(city:string,at=new Date()){
  const cityKey=normalizeCity(city);
  const time=at.getTime();
  const weight:Record<PaidDealerPlacementTier,number>={"city-sponsor":3,"brand-city":2,"featured-city":1};
  return dealerPlacements
    .filter(placement=>{
      if(normalizeCity(placement.citySlug)!==cityKey)return false;
      const startsAt=new Date(placement.startsAt).getTime();
      const endsAt=new Date(placement.endsAt).getTime();
      return Number.isFinite(startsAt)&&Number.isFinite(endsAt)&&startsAt<=time&&time<=endsAt;
    })
    .sort((a,b)=>weight[b.tier]-weight[a.tier]||a.sellerSlug.localeCompare(b.sellerSlug));
}

export function featuredDealerSlugsForCity(city:string,at=new Date()){
  return new Set(activeDealerPlacementsForCity(city,at).map(placement=>placement.sellerSlug));
}

export function dealerPlacementLabel(placement:DealerPlacement){
  const base=dealerPlacementLabels[placement.tier];
  return placement.tier==="brand-city"&&placement.brand?`${base} · ${placement.brand}`:base;
}

export type DealerPlacementTier="free"|"featured-city"|"brand-city"|"city-sponsor";

export type DealerPlacementPlan={
  id:DealerPlacementTier;
  name:string;
  price:string;
  description:string;
  features:string[];
  paid:boolean;
};

export type DealerPromotion={
  sellerSlug:string;
  citySlug:string;
  tier:Exclude<DealerPlacementTier,"free">;
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
    features:["Brand-specific featured message","Priority city visibility","Useful for dealers focused on one major brand","Limited placements per brand and city"],
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

export const placementInterestLabels:Record<DealerPlacementTier,string>={
  free:"Free Verified Listing",
  "featured-city":"Featured Dealer",
  "brand-city":"Brand + City Featured",
  "city-sponsor":"City Sponsor"
};

// Paid placements are activated only after the branch is independently verified
// and commercial terms are agreed. Keep this list empty until a real dealer pays.
export const dealerPromotions:DealerPromotion[]=[];

function normalizedSlug(value:string){return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}

export function activeDealerPromotionsForCity(city:string,at=new Date()){
  const cityKey=normalizedSlug(city);
  const time=at.getTime();
  const weight:Record<DealerPromotion["tier"],number>={"city-sponsor":3,"brand-city":2,"featured-city":1};
  return dealerPromotions
    .filter(item=>normalizedSlug(item.citySlug)===cityKey&&new Date(item.startsAt).getTime()<=time&&new Date(item.endsAt).getTime()>=time)
    .sort((a,b)=>weight[b.tier]-weight[a.tier]||a.sellerSlug.localeCompare(b.sellerSlug));
}

export function placementLabel(tier:DealerPromotion["tier"]){
  return tier==="city-sponsor"?"City Sponsor":tier==="brand-city"?"Brand + City Featured":"Featured Dealer";
}

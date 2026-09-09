import { databaseConfigured, prisma } from "@/lib/db";
import { publicSellersByType } from "@/lib/sellers";
import type { SellerProfile } from "@/lib/types";

function fromDb(row:{
  id:string;name:string;slug:string;type:string;city:string|null;province:string|null;region:string|null;addressLabel:string|null;
  website:string|null;phone:string|null;brands:string[];categories:string[];description:string|null;sourceLabel:string|null;sourceUrl:string|null;
  lastChecked:Date|null;verificationNote:string|null;status:string;
}):SellerProfile{
  return {
    id:row.id,
    name:row.name,
    slug:row.slug,
    type:(row.type==="dealer"?"dealer":row.type==="retailer"?"retailer":"official"),
    city:row.city||"",
    province:row.province||undefined,
    region:row.region||row.province||"",
    addressLabel:row.addressLabel||"",
    website:row.website||undefined,
    phoneLabel:row.phone||undefined,
    description:row.description||`${row.name} dealer profile.`,
    brands:row.brands,
    categories:row.categories.length?row.categories:["Motorcycles"],
    isDemo:false,
    status:row.status==="verified"?"verified":"research",
    lastChecked:row.lastChecked?.toISOString().slice(0,10),
    sourceLabel:row.sourceLabel||undefined,
    sourceUrl:row.sourceUrl||undefined,
    verificationNote:row.verificationNote||undefined
  };
}

export async function persistentVerifiedDealers(){
  if(!databaseConfigured())return [] as SellerProfile[];
  const rows=await prisma.seller.findMany({
    where:{type:"dealer",status:"verified"},
    orderBy:[{city:"asc"},{name:"asc"}],
    take:500
  });
  return rows.map(fromDb).filter(row=>row.city&&row.addressLabel&&row.sourceUrl&&row.lastChecked);
}

export async function allVerifiedDealers(){
  const staticRows=publicSellersByType("dealer");
  const dbRows=await persistentVerifiedDealers();
  const merged=new Map<string,SellerProfile>();
  for(const row of [...staticRows,...dbRows])merged.set(row.slug,row);
  return [...merged.values()].sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
}

export async function getVerifiedSellerProfile(slug:string){
  const staticRow=publicSellersByType("dealer").find(row=>row.slug===slug);
  if(staticRow)return staticRow;
  if(!databaseConfigured())return undefined;
  const row=await prisma.seller.findFirst({where:{slug,type:"dealer",status:"verified"}});
  if(!row)return undefined;
  const profile=fromDb(row);
  return profile.city&&profile.addressLabel&&profile.sourceUrl&&profile.lastChecked?profile:undefined;
}

export function sellerSlug(value:string){
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}


export type QuoteEligibleDealer = SellerProfile & { leadEmail:string };

function normalizedLocation(value:string){
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g," ").trim();
}

function locationScore(profile:SellerProfile, location:string){
  const haystack=` ${normalizedLocation(location)} `;
  const city=normalizedLocation(profile.city||"");
  const province=normalizedLocation(profile.province||"");
  const region=normalizedLocation(profile.region||"");
  if(city&&haystack.includes(` ${city} `))return 100;
  if(province&&haystack.includes(` ${province} `))return 70;
  if(region&&haystack.includes(` ${region} `))return 40;
  return 0;
}

export async function quoteEligibleDealers(){
  if(!databaseConfigured())return [] as QuoteEligibleDealer[];
  const rows=await prisma.seller.findMany({
    where:{type:"dealer",status:"verified",leadEmail:{not:null}},
    orderBy:[{city:"asc"},{name:"asc"}],
    take:500
  });
  return rows.flatMap(row=>{
    if(!row.leadEmail)return [];
    const profile=fromDb(row);
    if(!profile.city||!profile.addressLabel||!profile.sourceUrl||!profile.lastChecked)return [];
    return [{...profile,leadEmail:row.leadEmail}];
  });
}

export async function matchQuoteEligibleDealers(make:string, location:string, limit=3){
  const dealers=await quoteEligibleDealers();
  return dealers
    .filter(dealer=>dealer.brands.some(brand=>brand.toLowerCase()===make.toLowerCase()))
    .map(dealer=>({dealer,score:locationScore(dealer,location)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score||a.dealer.name.localeCompare(b.dealer.name))
    .slice(0,Math.max(1,Math.min(limit,3)))
    .map(item=>item.dealer);
}

export async function hasQuoteEligibleDealerForBrand(make:string){
  const dealers=await quoteEligibleDealers();
  return dealers.some(dealer=>dealer.brands.some(brand=>brand.toLowerCase()===make.toLowerCase()));
}

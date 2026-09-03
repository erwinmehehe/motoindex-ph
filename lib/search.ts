import { accessoryCategories, helmetBrands, publicMotorcycles, recommendationGuides, comparisons, isIndexableRecommendation, isIndexableComparison } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { observedMarketRange } from "@/lib/marketChecks";
import type { SearchItem } from "@/lib/searchQuery";
import { commuteGuides } from "@/lib/commute";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";
export type { SearchItem } from "@/lib/searchQuery";

export function getSearchItems(): SearchItem[] {
  const verifiedModels=publicMotorcycles;
  const models = verifiedModels.map(m=>({
    href:`/motorcycles/${m.makeSlug}/${m.slug}`,title:`${m.make} ${m.model}`,category:"Motorcycle",meta:`${m.category} · ${m.engineCc} cc · ${m.seatHeightMm} mm seat`,keywords:`${m.make} ${m.model} ${m.category} price specs tire size ${m.abs} ${m.transmission||""} fuel economy rider fit maintenance`,
    model:{make:m.make,category:m.category,engineCc:m.engineCc,pricePhp:observedMarketRange(m).from,seatHeightMm:m.seatHeightMm,curbWeightKg:m.curbWeightKg,transmission:m.transmission,abs:/\bABS\b/i.test(m.abs)&&!/^No ABS/i.test(m.abs),fuelConsumptionKmL:m.fuelConsumptionKmL}
  }));
  const helmets = helmetProducts.filter(p=>p.status==="verified").map(p=>({href:`/gear/helmets/${p.brandSlug}/${p.slug}`,title:`${p.brand} ${p.model}`,category:"Helmet",meta:`${p.helmetType}${p.certification?` · ${p.certification}`:""}`,keywords:`${p.brand} ${p.model} ${p.helmetType} helmet price`}));
  const brands = helmetBrands.filter(b=>isIndexableHelmetBrand(b.slug)).map(b=>({href:`/gear/helmets/${b.slug}`,title:`${b.brand} helmets`,category:"Helmet brand",meta:b.positioning,keywords:`${b.brand} helmet helmets price philippines`}));
  const guides = recommendationGuides.filter(g=>isIndexableRecommendation(g.slug)).map(g=>({href:`/recommendations/${g.slug}`,title:g.title,category:"Buying guide",meta:g.description,keywords:`${g.title} ${g.description}`}));
  const accessories = accessoryCategories.map(a=>({href:`/accessories/${a.slug}`,title:a.name,category:"Accessory",meta:a.description,keywords:`${a.name} motorcycle accessories`}));
  const commute = commuteGuides.map(g=>({href:`/commute/${g.slug}`,title:g.title,category:"Commuting guide",meta:g.description,keywords:`traffic commute delivery affordable passenger motorcycle philippines ${g.title}`}));
  const maintenance = maintenanceSeoTopics.map(topic=>({href:`/maintenance/${topic.slug}`,title:topic.title,category:"Maintenance guide",meta:topic.description,keywords:`${topic.primaryKeyword} motorcycle maintenance parts service philippines`}));
  const tools: SearchItem[] = [
    ...(comparisons.some(c=>isIndexableComparison(c.slug))?[{href:"/compare",title:"Compare motorcycles",category:"Tool",meta:"Compare verified price, engine, weight, seat height, fuel and tires.",keywords:"compare motorcycles versus vs three way"}]:[]),
    {href:"/finder",title:"Motorcycle finder",category:"Tool",meta:"Filter by budget, rider fit, use case, seat height, weight, ABS and transmission.",keywords:"find motorcycle short rider inseam passenger highway traffic luggage"},
    {href:"/ownership/cost-calculator",title:"Motorcycle total cost calculator",category:"Tool",meta:"Estimate purchase, financing, fuel, maintenance, insurance, registration, tires and resale.",keywords:"motorcycle monthly cost ownership calculator finance total cost"},
    {href:"/commute/cost-calculator",title:"Motorcycle commute cost calculator",category:"Tool",meta:"Estimate monthly fuel, maintenance reserve, parking and cost per commute day.",keywords:"commute traffic daily fuel cost work motorcycle philippines"},
    {href:"/commute/affordability",title:"Motorcycle affordability calculator",category:"Tool",meta:"Set your own monthly cap, running-cost reserve, down payment, APR and loan term.",keywords:"affordable motorcycle budget salary financing philippines"},
    {href:"/ownership/maintenance",title:"Motorcycle maintenance schedules",category:"Guide",meta:"Official service resources and manual-backed intervals.",keywords:"maintenance oil change cvt belt brake fluid coolant service schedule"},
    {href:"/ownership/safety-campaigns",title:"Recall and service campaign check",category:"Guide",meta:"Official manufacturer recall, product-update and service-campaign resources.",keywords:"recall service campaign safety vin frame product update"},
    {href:"/shortlist",title:"Saved motorcycle shortlist",category:"Tool",meta:"Save motorcycles locally, share a shortlist and compare up to three.",keywords:"save shortlist favorites compare three"},
    ...(verifiedModels.length?[{href:"/fitment",title:"Motorcycle fitment finder",category:"Tool",meta:"Start with a motorcycle and check tires and accessories.",keywords:"fitment tire top box accessories"}]:[]),
    {href:"/gear/helmets/brands",title:"Compare helmet brands",category:"Guide",meta:"Compare checked helmet brands, types and observed price ranges.",keywords:"helmet brands philippines best helmet brand"}
  ];
  return [...models,...helmets,...brands,...guides,...commute,...maintenance,...accessories,...tools];
}

import type { SellerProfile, SellerType } from "./types";
import { sellerOffers } from "./offers";

// Demo seller directory. Replace these records with verified business information before indexing seller pages.
export const sellers: SellerProfile[] = [
  { id:"seller-demo-yamaha-a", name:"Demo Yamaha Dealer A", slug:"demo-yamaha-dealer-a", type:"dealer", city:"Quezon City", region:"Metro Manila", addressLabel:"Demo location — Quezon City", description:"Demo Yamaha dealer in Quezon City for testing seller pages and motorcycle offers.", brands:["Yamaha"], categories:["Motorcycles","Financing"], isDemo:true, status:"research" },
  { id:"seller-demo-yamaha-b", name:"Demo Yamaha Dealer B", slug:"demo-yamaha-dealer-b", type:"dealer", city:"Makati", region:"Metro Manila", addressLabel:"Demo location — Makati", description:"Demo Yamaha dealer in Makati for testing model offers and financing listings.", brands:["Yamaha"], categories:["Motorcycles","Financing"], isDemo:true, status:"research" },
  { id:"seller-demo-honda-a", name:"Demo Honda Dealer A", slug:"demo-honda-dealer-a", type:"dealer", city:"Cebu City", region:"Central Visayas", addressLabel:"Demo location — Cebu City", description:"Demo Honda dealer in Cebu City for testing local seller and quote pages.", brands:["Honda"], categories:["Motorcycles","Financing"], isDemo:true, status:"research" },
  { id:"seller-demo-multibrand", name:"Demo Multi-brand Dealer", slug:"demo-multibrand-dealer", type:"dealer", city:"Pasig", region:"Metro Manila", addressLabel:"Demo location — Pasig", description:"Demo multi-brand dealer in Pasig for testing motorcycle price comparisons.", brands:["Yamaha","Honda","Suzuki","Kawasaki"], categories:["Motorcycles","Financing"], isDemo:true, status:"research" },
  { id:"seller-demo-gear", name:"Demo Gear Retailer", slug:"demo-gear-retailer", type:"retailer", city:"Taguig", region:"Metro Manila", addressLabel:"Demo location — Taguig", description:"Demo riding-gear shop in Taguig for testing helmet and gear offers.", brands:["Shoei","HJC","KYT","Spyder"], categories:["Helmets","Riding gear"], isDemo:true, status:"research" },
  { id:"seller-demo-helmet-shop", name:"Demo Helmet Shop", slug:"demo-helmet-shop", type:"retailer", city:"Manila", region:"Metro Manila", addressLabel:"Demo location — Manila", description:"Demo helmet shop in Manila for testing brand and model price comparisons.", brands:["HJC","KYT","EVO","Spyder"], categories:["Helmets"], isDemo:true, status:"research" },
  { id:"seller-demo-tires", name:"Demo Tire Retailer", slug:"demo-tire-retailer", type:"retailer", city:"Mandaluyong", region:"Metro Manila", addressLabel:"Demo location — Mandaluyong", description:"Demo motorcycle tire retailer in Mandaluyong for testing size-specific prices.", brands:["Michelin","Pirelli","Dunlop"], categories:["Tires"], isDemo:true, status:"research" },
  { id:"seller-demo-tire-shop", name:"Demo Tire Shop", slug:"demo-tire-shop", type:"retailer", city:"Caloocan", region:"Metro Manila", addressLabel:"Demo location — Caloocan", description:"Demo tire shop in Caloocan for testing local tire prices and replacement searches.", brands:["Pirelli","Michelin","IRC"], categories:["Tires"], isDemo:true, status:"research" },
  { id:"seller-demo-accessories", name:"Demo Accessories Shop", slug:"demo-accessories-shop", type:"retailer", city:"Davao City", region:"Davao Region", addressLabel:"Demo location — Davao City", description:"Demo accessory shop in Davao City for testing top-box, rack and bracket offers.", brands:["GIVI","SHAD"], categories:["Top boxes","Accessories"], isDemo:true, status:"research" },
];

export const MIN_PUBLIC_DEALERS_PER_CITY = 3;

export function isPublicSeller(seller: SellerProfile){ return !seller.isDemo && seller.status === "verified"; }
export function publicSellers(){ return sellers.filter(isPublicSeller); }
export function getSeller(slug:string){ return sellers.find(s=>s.slug===slug); }
export function getPublicSeller(slug:string){ const seller=getSeller(slug); return seller && isPublicSeller(seller) ? seller : undefined; }
export function sellersByType(type:SellerType){ return sellers.filter(s=>s.type===type); }
export function publicSellersByType(type:SellerType){ return sellers.filter(s=>s.type===type && isPublicSeller(s)); }
export function dealerCities(){ return [...new Set(sellers.filter(s=>s.type==="dealer").map(s=>s.city))].sort(); }
export function publicDealerCities(){ return [...new Set(publicSellersByType("dealer").map(s=>s.city))].sort(); }
export function citySlug(city:string){ return city.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
export function dealersByCity(slug:string){ return sellers.filter(s=>s.type==="dealer" && citySlug(s.city)===slug); }
export function publicDealersByCity(slug:string){ return dealersByCity(slug).filter(isPublicSeller); }
export function offersForSeller(slug:string){ return sellerOffers.filter(o=>o.sellerSlug===slug && o.status!=="expired"); }
export function sellerCounts(){ return { total:sellers.length, dealers:sellers.filter(s=>s.type==="dealer").length, retailers:sellers.filter(s=>s.type==="retailer").length, cities:new Set(sellers.map(s=>s.city)).size }; }

import type { UsedListing } from "./types";
import { motorcycles } from "./data";

const demo = "Sample listing used to test used-price ranges and filters. Not a live seller listing.";

export const usedListings: UsedListing[] = [
  {id:"u-aerox-1",modelId:"yamaha-aerox-v3",title:"2025 Yamaha Aerox V3",year:2025,mileageKm:7200,askingPricePhp:112000,condition:"excellent",sellerType:"private",location:"Quezon City",postedAt:"2026-08-20",status:"demo",sourceLabel:demo},
  {id:"u-aerox-2",modelId:"yamaha-aerox-v3",title:"2025 Yamaha Aerox V3",year:2025,mileageKm:11800,askingPricePhp:105000,condition:"good",sellerType:"private",location:"Manila",postedAt:"2026-08-18",status:"demo",sourceLabel:demo},
  {id:"u-aerox-3",modelId:"yamaha-aerox-v3",title:"2024 Yamaha Aerox V3",year:2024,mileageKm:18400,askingPricePhp:98000,condition:"good",sellerType:"dealer",location:"Pasig",postedAt:"2026-08-17",status:"demo",sourceLabel:demo},
  {id:"u-aerox-4",modelId:"yamaha-aerox-v3",title:"2024 Yamaha Aerox V3",year:2024,mileageKm:26000,askingPricePhp:89000,condition:"fair",sellerType:"private",location:"Caloocan",postedAt:"2026-08-14",status:"demo",sourceLabel:demo},

  {id:"u-nmax-1",modelId:"yamaha-nmax-v3",title:"2025 Yamaha NMAX V3",year:2025,mileageKm:6500,askingPricePhp:136000,condition:"excellent",sellerType:"private",location:"Makati",postedAt:"2026-08-21",status:"demo",sourceLabel:demo},
  {id:"u-nmax-2",modelId:"yamaha-nmax-v3",title:"2025 Yamaha NMAX V3",year:2025,mileageKm:12500,askingPricePhp:128000,condition:"good",sellerType:"dealer",location:"Taguig",postedAt:"2026-08-19",status:"demo",sourceLabel:demo},
  {id:"u-nmax-3",modelId:"yamaha-nmax-v3",title:"2024 Yamaha NMAX V3",year:2024,mileageKm:21500,askingPricePhp:117000,condition:"good",sellerType:"private",location:"Pasig",postedAt:"2026-08-16",status:"demo",sourceLabel:demo},
  {id:"u-nmax-4",modelId:"yamaha-nmax-v3",title:"2024 Yamaha NMAX V3",year:2024,mileageKm:33000,askingPricePhp:104000,condition:"fair",sellerType:"private",location:"Marikina",postedAt:"2026-08-12",status:"demo",sourceLabel:demo},

  {id:"u-adv160-1",modelId:"honda-adv-160",title:"2025 Honda ADV 160",year:2025,mileageKm:5900,askingPricePhp:151000,condition:"excellent",sellerType:"dealer",location:"Cebu City",postedAt:"2026-08-22",status:"demo",sourceLabel:demo},
  {id:"u-adv160-2",modelId:"honda-adv-160",title:"2025 Honda ADV 160",year:2025,mileageKm:14100,askingPricePhp:142000,condition:"good",sellerType:"private",location:"Mandaue",postedAt:"2026-08-18",status:"demo",sourceLabel:demo},
  {id:"u-adv160-3",modelId:"honda-adv-160",title:"2024 Honda ADV 160",year:2024,mileageKm:23000,askingPricePhp:131000,condition:"good",sellerType:"private",location:"Lapu-Lapu City",postedAt:"2026-08-15",status:"demo",sourceLabel:demo},
  {id:"u-adv160-4",modelId:"honda-adv-160",title:"2024 Honda ADV 160",year:2024,mileageKm:30500,askingPricePhp:119000,condition:"fair",sellerType:"private",location:"Cebu City",postedAt:"2026-08-11",status:"demo",sourceLabel:demo},

  {id:"u-click160-1",modelId:"honda-click-160",title:"2025 Honda Click 160",year:2025,mileageKm:8200,askingPricePhp:103000,condition:"excellent",sellerType:"private",location:"Davao City",postedAt:"2026-08-20",status:"demo",sourceLabel:demo},
  {id:"u-click160-2",modelId:"honda-click-160",title:"2025 Honda Click 160",year:2025,mileageKm:15400,askingPricePhp:96000,condition:"good",sellerType:"dealer",location:"Davao City",postedAt:"2026-08-18",status:"demo",sourceLabel:demo},
  {id:"u-click160-3",modelId:"honda-click-160",title:"2024 Honda Click 160",year:2024,mileageKm:22400,askingPricePhp:88000,condition:"good",sellerType:"private",location:"Tagum",postedAt:"2026-08-15",status:"demo",sourceLabel:demo},
  {id:"u-click160-4",modelId:"honda-click-160",title:"2024 Honda Click 160",year:2024,mileageKm:36000,askingPricePhp:79000,condition:"fair",sellerType:"private",location:"Digos",postedAt:"2026-08-10",status:"demo",sourceLabel:demo},

  {id:"u-pcx160-1",modelId:"honda-pcx-160",title:"2025 Honda PCX 160",year:2025,mileageKm:6900,askingPricePhp:121000,condition:"excellent",sellerType:"dealer",location:"Quezon City",postedAt:"2026-08-21",status:"demo",sourceLabel:demo},
  {id:"u-pcx160-2",modelId:"honda-pcx-160",title:"2025 Honda PCX 160",year:2025,mileageKm:13200,askingPricePhp:114000,condition:"good",sellerType:"private",location:"Manila",postedAt:"2026-08-18",status:"demo",sourceLabel:demo},
  {id:"u-pcx160-3",modelId:"honda-pcx-160",title:"2024 Honda PCX 160",year:2024,mileageKm:24500,askingPricePhp:104000,condition:"good",sellerType:"private",location:"Pasay",postedAt:"2026-08-14",status:"demo",sourceLabel:demo},
  {id:"u-pcx160-4",modelId:"honda-pcx-160",title:"2024 Honda PCX 160",year:2024,mileageKm:34000,askingPricePhp:94000,condition:"fair",sellerType:"private",location:"Paranaque",postedAt:"2026-08-09",status:"demo",sourceLabel:demo},

  {id:"u-fazzio-1",modelId:"yamaha-fazzio",title:"2025 Yamaha Fazzio",year:2025,mileageKm:5200,askingPricePhp:84000,condition:"excellent",sellerType:"private",location:"Bacolod",postedAt:"2026-08-22",status:"demo",sourceLabel:demo},
  {id:"u-fazzio-2",modelId:"yamaha-fazzio",title:"2025 Yamaha Fazzio",year:2025,mileageKm:11400,askingPricePhp:79000,condition:"good",sellerType:"private",location:"Iloilo City",postedAt:"2026-08-18",status:"demo",sourceLabel:demo},
  {id:"u-fazzio-3",modelId:"yamaha-fazzio",title:"2024 Yamaha Fazzio",year:2024,mileageKm:19800,askingPricePhp:72000,condition:"good",sellerType:"dealer",location:"Bacolod",postedAt:"2026-08-13",status:"demo",sourceLabel:demo},
  {id:"u-fazzio-4",modelId:"yamaha-fazzio",title:"2024 Yamaha Fazzio",year:2024,mileageKm:31000,askingPricePhp:63000,condition:"fair",sellerType:"private",location:"Iloilo City",postedAt:"2026-08-08",status:"demo",sourceLabel:demo},

  {id:"u-outlier-aerox",modelId:"yamaha-aerox-v3",title:"2025 Yamaha Aerox V3 — unusual ask",year:2025,mileageKm:900,askingPricePhp:168000,condition:"excellent",sellerType:"private",location:"Manila",postedAt:"2026-08-23",status:"demo",sourceLabel:demo}
];

export function listingsForModel(modelId:string){return usedListings.filter(x=>x.modelId===modelId&&x.status==="verified");}
export function getUsedListing(id:string){return usedListings.find(x=>x.id===id&&x.status==="verified");}

export function median(values:number[]){if(!values.length)return 0;const s=[...values].sort((a,b)=>a-b);const m=Math.floor(s.length/2);return s.length%2?s[m]:Math.round((s[m-1]+s[m])/2);}
export function isPriceOutlier(listing:UsedListing, peers:UsedListing[]){const med=median(peers.map(x=>x.askingPricePhp));if(!med||peers.length<4)return false;return listing.askingPricePhp<med*.65||listing.askingPricePhp>med*1.35;}

export function marketSummary(modelId:string){
  const all=listingsForModel(modelId);
  const clean=all.filter(x=>!isPriceOutlier(x,all));
  const prices=clean.map(x=>x.askingPricePhp).sort((a,b)=>a-b);
  const verified=clean.length;
  const medianPrice=median(prices);
  const reference=motorcycles.find(m=>m.id===modelId)?.srp||0;
  return {
    total:all.length,
    included:clean.length,
    excluded:all.length-clean.length,
    medianPrice,
    low:prices[0]||0,
    high:prices.at(-1)||0,
    averageMileage:clean.length?Math.round(clean.reduce((a,x)=>a+x.mileageKm,0)/clean.length):0,
    newestYear:clean.length?Math.max(...clean.map(x=>x.year)):0,
    oldestYear:clean.length?Math.min(...clean.map(x=>x.year)):0,
    discountVsReference:reference&&medianPrice?Math.round((1-medianPrice/reference)*100):0,
    confidence: verified>=10?"high":verified>=5?"medium":verified>0?"low":clean.length?"demo":"none"
  } as const;
}

export function modelsWithUsedListings(){return motorcycles.filter(m=>listingsForModel(m.id).length>0);}

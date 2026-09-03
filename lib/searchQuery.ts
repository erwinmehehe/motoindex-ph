export type SearchModelMeta = {
  make: string;
  category: string;
  engineCc: number;
  pricePhp: number;
  seatHeightMm: number;
  curbWeightKg: number;
  transmission?: string;
  abs: boolean;
  fuelConsumptionKmL?: number;
};

export type SearchItem = { href: string; title: string; category: string; meta: string; keywords: string; model?: SearchModelMeta };

type Intent = {
  under?: number;
  over?: number;
  cc?: number;
  transmission?: "Automatic"|"Manual";
  abs?: boolean;
  lowSeat?: boolean;
  light?: boolean;
  fuelEfficient?: boolean;
  trafficFriendly?: boolean;
  delivery?: boolean;
  category?: string;
  textTerms: string[];
};

function money(raw:string, suffix?:string){const n=Number(raw.replace(/,/g,""));return suffix?.toLowerCase()==="k"?n*1000:n}

export function parseSearchIntent(query:string):Intent{
  let q=query.toLowerCase().replace(/₱/g,"").trim();
  const intent:Intent={textTerms:[]};
  const under=q.match(/\b(?:under|below|less than|max(?:imum)?(?: of)?)\s*([0-9][0-9,]*(?:\.\d+)?)\s*(k)?\b/i);
  if(under){intent.under=money(under[1],under[2]);q=q.replace(under[0]," ")}
  const over=q.match(/\b(?:over|above|more than|min(?:imum)?(?: of)?)\s*([0-9][0-9,]*(?:\.\d+)?)\s*(k)?\b/i);
  if(over){intent.over=money(over[1],over[2]);q=q.replace(over[0]," ")}
  const cc=q.match(/\b(\d{2,4})\s*cc\b/i);if(cc){intent.cc=Number(cc[1]);q=q.replace(cc[0]," ")}
  if(/\bautomatic\b/.test(q)){intent.transmission="Automatic";q=q.replace(/\bautomatic\b/g," ")}
  if(/\bmanual\b/.test(q)){intent.transmission="Manual";q=q.replace(/\bmanual\b/g," ")}
  if(/\bno\s+abs\b/.test(q)){intent.abs=false;q=q.replace(/\bno\s+abs\b/g," ")}else if(/\babs\b/.test(q)){intent.abs=true;q=q.replace(/\babs\b/g," ")}
  if(/\blow(?:er)?\s+seat\b|\bshort rider\b/.test(q)){intent.lowSeat=true;q=q.replace(/\blow(?:er)?\s+seat\b|\bshort rider\b/g," ")}
  if(/\blight(?:weight)?\b/.test(q)){intent.light=true;q=q.replace(/\blight(?:weight)?\b/g," ")}
  if(/\bfuel[ -]?efficient\b|\bhigh km\/?l\b/.test(q)){intent.fuelEfficient=true;q=q.replace(/\bfuel[ -]?efficient\b|\bhigh km\/?l\b/g," ")}
  if(/\bheavy traffic\b|\bstop[ -]?go\b|\btraffic friendly\b/.test(q)){intent.trafficFriendly=true;q=q.replace(/\bheavy traffic\b|\bstop[ -]?go\b|\btraffic friendly\b/g," ")}
  if(/\bdelivery rider\b|\bdelivery bike\b|\bwork bike\b|\bgig work\b/.test(q)){intent.delivery=true;q=q.replace(/\bdelivery rider\b|\bdelivery bike\b|\bwork bike\b|\bgig work\b/g," ")}
  const categories=["scooter","underbone","adventure","sport bike","sport","business","dual-sport","dual sport","naked","roadster"];
  for(const cat of categories){if(q.includes(cat)){intent.category=cat.replace("dual sport","dual-sport");q=q.replace(cat," ");break}}
  intent.textTerms=q.split(/\s+/).filter(Boolean).filter(t=>!["motorcycle","motorcycles","bike","bikes","philippines","ph","price","specs"].includes(t));
  return intent;
}

export function searchItemMatches(item:SearchItem,query:string){
  const q=query.trim();if(!q)return true;
  const intent=parseSearchIntent(q);
  const m=item.model;
  const hasStructured=Boolean(intent.under||intent.over||intent.cc||intent.transmission||typeof intent.abs==="boolean"||intent.lowSeat||intent.light||intent.fuelEfficient||intent.trafficFriendly||intent.delivery||intent.category);
  if(hasStructured&&!m)return false;
  if(m){
    if(intent.under&&m.pricePhp>intent.under)return false;
    if(intent.over&&m.pricePhp<intent.over)return false;
    if(intent.cc&&Math.abs(m.engineCc-intent.cc)>Math.max(8,intent.cc*.08))return false;
    if(intent.transmission&&m.transmission!==intent.transmission)return false;
    if(typeof intent.abs==="boolean"&&m.abs!==intent.abs)return false;
    if(intent.lowSeat&&m.seatHeightMm>780)return false;
    if(intent.light&&m.curbWeightKg>120)return false;
    if(intent.fuelEfficient&&(!m.fuelConsumptionKmL||m.fuelConsumptionKmL<45))return false;
    if(intent.trafficFriendly&&!(m.curbWeightKg<=125&&(m.transmission==="Automatic"||/underbone|business/i.test(m.category))))return false;
    if(intent.delivery&&!(m.curbWeightKg<=130&&(/underbone|business|scooter/i.test(m.category))))return false;
    if(intent.category){const c=m.category.toLowerCase();if(intent.category==="sport"?!c.includes("sport"):!c.includes(intent.category))return false;}
  }
  if(!intent.textTerms.length)return true;
  const haystack=`${item.title} ${item.category} ${item.meta} ${item.keywords}`.toLowerCase();
  return intent.textTerms.every(term=>haystack.includes(term));
}

export function searchItemScore(item:SearchItem,query:string){const q=query.trim().toLowerCase();if(!q)return 0;let score=0;const title=item.title.toLowerCase();if(title===q)score+=100;if(title.startsWith(q))score+=40;for(const t of parseSearchIntent(q).textTerms){if(title.includes(t))score+=12;if(item.keywords.toLowerCase().includes(t))score+=3}if(item.model)score+=5;return score;}

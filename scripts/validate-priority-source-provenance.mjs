import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const data=read("lib","data.ts");
const tier=read("lib","phTier23ModelsBase.ts");
const errors=[];

const priorityIds=[
  "yamaha-aerox-v3","yamaha-nmax-v3","honda-adv-160","honda-click-125i","honda-click-160",
  "honda-pcx-160","yamaha-fazzio","suzuki-burgman-street-ex","suzuki-raider-r150","yamaha-sniper-155",
  "honda-adv-350","honda-cb650r","kawasaki-ninja-500","kawasaki-z500","honda-winner-x",
  "yamaha-mio-gravis","yamaha-mio-i-125","yamaha-tmax","yamaha-yzf-r1m","motorstar-cafe-400"
];

const competitorPattern=/(?:^|\/\/)(?:www\.)?(?:zigwheels\.ph|motodeal\.com\.ph)(?:\/|$)/i;
const documentedExceptions=new Map([
  ["motorstar-cafe-400","No model-level first-party MotorStar Cafe 400 page was located in the 2026-10-03 verification pass; retain the secondary model record until primary evidence is available."]
]);

function blockFor(id){
  for(const source of [data,tier]){
    const start=source.indexOf(`id: "${id}"`);
    if(start<0)continue;
    const next=source.indexOf("\n  {",start+10);
    return source.slice(start,next>start?next:start+5000);
  }
  return "";
}

function field(block,name){
  return block.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1]||"";
}

let strongCoreSources=0;
for(const id of priorityIds){
  const block=blockFor(id);
  if(!block){
    errors.push(`Priority provenance model missing: ${id}`);
    continue;
  }

  const sourceUrl=field(block,"sourceUrl");
  const marketPriceSourceUrl=field(block,"marketPriceSourceUrl");
  const sourceLabel=field(block,"sourceLabel");
  const verifiedAt=field(block,"verifiedAt");

  if(!sourceUrl)errors.push(`Priority provenance sourceUrl missing: ${id}`);
  if(!sourceLabel)errors.push(`Priority provenance sourceLabel missing: ${id}`);
  if(!verifiedAt)errors.push(`Priority provenance verifiedAt missing: ${id}`);

  const exception=documentedExceptions.get(id);
  const competitorCore=competitorPattern.test(sourceUrl);
  const competitorPrice=marketPriceSourceUrl&&competitorPattern.test(marketPriceSourceUrl);

  if(competitorCore||competitorPrice){
    if(!exception){
      errors.push(`Priority model still depends on competitor-site provenance: ${id} -> ${[sourceUrl,marketPriceSourceUrl].filter(Boolean).join(" | ")}`);
    }
  }else{
    strongCoreSources++;
  }
}

if(strongCoreSources<19){
  errors.push(`At least 19 of 20 priority models must be free of ZigWheels/MotoDeal provenance; found ${strongCoreSources}.`);
}

for(const [id,reason] of documentedExceptions){
  if(!priorityIds.includes(id))errors.push(`Documented provenance exception is not in the priority set: ${id}`);
  if(!reason.trim())errors.push(`Documented provenance exception requires a reason: ${id}`);
}

for(const token of [
  'sourceLabel: "Suzuki Motorcycles Philippines current Burgman Street 125 EX product reference"',
  'sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street-125-ex/"',
  'sourceLabel: "Yamaha Motor Philippines current Sniper155 product reference"',
  'sourceUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/on-road/sniper155"',
  'marketPriceSourceLabel: "Motortrade Philippines current Sniper155 and Sniper155R dealer listings"',
  'sourceLabel: "Honda Philippines Winner X launch, variant, fuel-economy and specification reference"',
  'marketPriceSourceLabel: "Motortrade Philippines current Winner X Racing dealer cross-check"'
]){
  if(!data.includes(token))errors.push(`Priority provenance upgrade missing token: ${token}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Priority source provenance validation passed: ${strongCoreSources}/20 priority models are free of ZigWheels/MotoDeal provenance; 1 documented exception remains.`);

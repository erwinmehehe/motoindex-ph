import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const data=read("lib","data.ts");
const recommendation=read("app","recommendations","[slug]","page.tsx");
const brandPage=read("app","motorcycles","[make]","page.tsx");
const brandGrowth=read("lib","brandSeoGrowth.ts");
const nextConfig=read("next.config.mjs");

const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

for(const token of [
  'slug: "dual-sport-motorcycles-philippines"',
  'seoTitle: "Dual-Sport & Trail Motorcycles Philippines 2026 | Prices"',
  'primaryKeyword: "dual sport motorcycles Philippines"',
  '"trail bike Philippines"',
  '"off road motorcycle Philippines"',
  '"off-road motorcycle Philippines"',
  '"off road bike Philippines"',
  '"Dual-sport vs trail bike vs off-road motorcycle"',
  '"Weight, tires and low-speed trail control"',
  '"What matters most for trail and rough-road use?"'
]){
  requireText(data,token,`Dual-sport semantic consolidation missing: ${token}`);
}

for(const token of [
  'guide.slug==="dual-sport-motorcycles-philippines"',
  'rather than treating displacement as an off-road score',
  'weight, tires and low-speed trail control',
  'dual-sport, trail bikes and off-road motorcycles the same',
  'what matters most for trail and rough-road use'
]){
  requireText(recommendation.toLowerCase(),token.toLowerCase(),`Dual-sport renderer logic missing: ${token}`);
}

const dualMeta=[...data.matchAll(/slug: "dual-sport-motorcycles-philippines"[\s\S]{0,600}?seoTitle: "([^"]+)"[\s\S]{0,600}?description: "([^"]+)"/g)];
if(dualMeta.length!==1){
  errors.push("Expected exactly one dual-sport metadata record.");
}else{
  const [,title,description]=dualMeta[0];
  if(title.length<55||title.length>60)errors.push(`Dual-sport title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`Dual-sport description must be 150-160 chars; found ${description.length}.`);
}

for(const slug of ["best-off-road","off-road-motorcycles-philippines","trail-motorcycles-philippines"]){
  if(data.includes(`slug: "${slug}"`))errors.push(`Do not create a competing off-road/trail recommendation URL: ${slug}`);
}

for(const [slug,label] of [["honda","Honda"],["yamaha","Yamaha"],["kawasaki","Kawasaki"]]){
  for(const token of [
    `bigBikeTitle: "${label} big bikes in the Philippines"`,
    'bigBikeMinCc: 400'
  ]){
    const blockStart=brandGrowth.indexOf(`  ${slug}: {`);
    const blockNext=brandGrowth.indexOf("\n  ",blockStart+5);
    const block=brandGrowth.slice(blockStart,blockNext>blockStart?blockNext:brandGrowth.length);
    if(!block.includes(token))errors.push(`${label} brand big-bike authority missing token: ${token}`);
  }
}

for(const token of [
  'const bigBikeRanges =',
  'const lightestBigBike =',
  'const lowestSeatBigBike =',
  'const literBikes =',
  'href="/recommendations/motorcycles-400cc-plus-philippines"',
  'href="/recommendations/motorcycles-1000cc-plus-philippines"',
  'href="/motorcycles/expressway-legal"',
  'Are all ${brand} big bikes expressway legal in the Philippines?',
  '<span>Weight</span>',
  'Current tracked big-bike references'
]){
  requireText(brandPage,token,`Brand big-bike authority renderer missing: ${token}`);
}

for(const token of [
  'recommendationHref: "/recommendations/dual-sport-motorcycles-philippines"',
  'recommendationLabel: "Compare dual-sport and trail motorcycles"'
]){
  requireText(brandGrowth,token,`Brand trail spotlight consolidation missing: ${token}`);
}
requireText(brandPage,'href={categorySpotlight.recommendationHref}',"Brand spotlight must render its canonical recommendation link.");

for(const route of [
  "/motorcycles/honda-big-bike",
  "/motorcycles/honda-big-bikes",
  "/motorcycles/yamaha-big-bike",
  "/motorcycles/yamaha-big-bikes",
  "/motorcycles/kawasaki-big-bike",
  "/motorcycles/kawasaki-big-bikes"
]){
  if(nextConfig.includes(route))errors.push(`Do not create thin brand big-bike redirect/page architecture: ${route}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Semantic consolidation wave 5 validation passed.");

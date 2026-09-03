import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const pkg=JSON.parse(read("package.json"));
const [maj,min,patch]=String(pkg.version).split(".").map(Number);
if(!(maj===2&&(min>4||(min===4&&patch>=2))))errors.push(`package version must be v2.4.2 or newer within major v2, found ${pkg.version}`);

const data=read("lib/data.ts");
for(const brand of ["HNJ","Shark","MT","Bell"]){
  if(!data.includes(`brand: "${brand}"`))errors.push(`helmet brand missing ${brand}`);
}

const catalog=read("lib/catalog.ts");
const media=read("lib/media.ts");
const newHelmetIds=[
  "hnj-a119","hnj-983","shark-skwal-i3-rhad","shark-spartan-gt-pro-carbon-dokhta",
  "mt-thunder-4-sv-pd-solid","mt-atom-2-sv-pd-pure","bell-qualifier-dlx-mips","bell-custom-500"
];
for(const id of newHelmetIds){
  if(!catalog.includes(`id:"${id}"`))errors.push(`new helmet product missing ${id}`);
  const row=catalog.match(new RegExp(`\\{ id:"${id}"[^\\n]+`))?.[0]||"";
  if(!row.includes('status:"verified"'))errors.push(`new helmet product not verified ${id}`);
  if(!media.includes(`entityId: "${id}"`))errors.push(`new helmet media missing ${id}`);
}
for(const id of ["michelin-city-grip-2","dunlop-scootsmart"]){
  const row=catalog.match(new RegExp(`\\{ id:"${id}"[^\\n]+`))?.[0]||"";
  if(!row.includes('status:"verified"'))errors.push(`tire not promoted to verified: ${id}`);
  if(!row.includes('lastChecked:"2026-08-26"'))errors.push(`tire freshness not updated: ${id}`);
  if(!media.includes(`entityId: "${id}"`))errors.push(`verified tire media missing ${id}`);
}
if(!catalog.includes('sourceLabel:"Michelin official City Grip 2 product and size data"'))errors.push("Michelin official size evidence missing");
if(!catalog.includes('sourceLabel:"Dunlop official ScootSmart size catalog"'))errors.push("Dunlop official size evidence missing");

const next=read("next.config.mjs");
for(const host of ["platincdn.com","cdn.idealo.com","vault.widen.net","easyr.com.au","tripleclampmoto.ca"]){
  if(!next.includes(host))errors.push(`remote image allowlist missing ${host}`);
}

// Site-wide eyebrow/kicker cleanup: no visual classes or named kicker/eyebrow renderer remains.
const scanRoots=[path.join(root,"app"),path.join(root,"components")];
for(const base of scanRoots){
  const stack=[base];
  while(stack.length){
    const current=stack.pop();
    for(const entry of fs.readdirSync(current,{withFileTypes:true})){
      const full=path.join(current,entry.name);
      if(entry.isDirectory())stack.push(full);
      else if(entry.isFile()&&entry.name.endsWith(".tsx")){
        const text=fs.readFileSync(full,"utf8");
        const rel=path.relative(root,full).split(path.sep).join("/");
        if(/className="(?:kicker|eyebrow)"/.test(text))errors.push(`${rel} still renders a kicker/eyebrow class`);
        if(/<span>\{(?:guide|g)\.kicker\}<\/span>/.test(text))errors.push(`${rel} still renders a kicker label`);
        if(/link\.eyebrow\s*&&\s*<span>/.test(text))errors.push(`${rel} still renders a related-link eyebrow`);
      }
    }
  }
}
const css=read("app/globals.css");
if(/\.kicker\b|\.eyebrow\b/.test(css))errors.push("dead kicker/eyebrow CSS selectors remain");

const verified=[...catalog.matchAll(/\{ id:"([^"]+)"[^\n]+status:"verified"/g)].map(m=>m[1]);
if(verified.length<43)errors.push(`expected at least 43 verified gear products after v2.4.2 expansion, found ${verified.length}`);

const lock=JSON.parse(read("package-lock.json"));
if(lock.version!==pkg.version||lock.packages?.[""]?.version!==pkg.version)errors.push("package-lock root version does not match package.json");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`v2.4.2 validation passed: ${newHelmetIds.length} new helmet products, Michelin/Dunlop verified tire depth, and site-wide page eyebrow removal are wired. Verified gear products: ${verified.length}.`);

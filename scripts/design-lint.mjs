import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root=process.cwd();
const sharedCss=new Set([
  "app/globals.css",
  "app/tailwind.css",
  "app/research-ux.css",
  "app/responsive-polish.css",
  "app/premium-light.css",
  "app/product-system.css",
  "app/image-stage-cleanup.css",
  "app/product-experience-v2.css",
  "app/hub-structure.css",
  "app/navigation.css",
  "app/styles/tokens.css",
  "app/styles/base.css",
  "app/styles/components.css",
  "app/styles/routes.css",
  "app/styles/ui-system.css",
  "app/styles/motorcycles-index-fix.css",
  "app/styles/product-entity-layout-fix.css"
]);

const rawColor=/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;
const sharedSelector=/\.(?:product-card(?:-media|-copy|-shell)?|section-head|brand-facts|product-grid|entity-media-contained|model-card)\b/;
const allowedImportantInTokens=[
  "scroll-behavior: auto !important",
  "transition-duration: .01ms !important",
  "animation-duration: .01ms !important",
  "animation-iteration-count: 1 !important"
];

function diffText(){
  try{
    execFileSync("git",["rev-parse","HEAD^1"],{stdio:"ignore"});
    return execFileSync("git",["diff","--unified=0","HEAD^1","HEAD","--","app/**/*.css","app/*.css"],{encoding:"utf8"});
  }catch{
    return "";
  }
}

function selectorForLine(filePath,lineNumber){
  if(!fs.existsSync(filePath)) return "";
  const lines=fs.readFileSync(filePath,"utf8").split(/\r?\n/);
  let selector="";
  let depth=0;
  for(let i=0;i<Math.min(lineNumber,lines.length);i++){
    const line=lines[i];
    if(depth===0 && line.includes("{")){
      selector=line.slice(0,line.indexOf("{")).trim();
      depth=1;
      continue;
    }
    if(depth>0){
      depth+=(line.match(/\{/g)||[]).length;
      depth-=(line.match(/\}/g)||[]).length;
      if(depth<=0){depth=0;selector="";}
    }
  }
  return selector;
}

const diff=diffText();
if(!diff.trim()){
  console.log("Design lint: no CSS additions to inspect.");
  process.exit(0);
}

const errors=[];
let currentPath="";
let newLine=0;
for(const raw of diff.split(/\r?\n/)){
  if(raw.startsWith("+++ b/")){currentPath=raw.slice(6);continue;}
  const hunk=raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if(hunk){newLine=Number(hunk[1]);continue;}
  if(!currentPath) continue;
  const isCss=currentPath.endsWith(".css");
  if(!isCss) continue;

  if(raw.startsWith("+") && !raw.startsWith("+++")){
    const line=raw.slice(1);
    const selector=selectorForLine(path.join(root,currentPath),newLine);
    const isTokens=currentPath==="app/styles/tokens.css";
    const isRoute=!sharedCss.has(currentPath);

    if(rawColor.test(line) && !isTokens){
      errors.push(`${currentPath}:${newLine}: raw color added outside tokens.css -> ${line.trim()}`);
    }
    if(line.includes("!important")){
      const approved=isTokens && allowedImportantInTokens.some(value=>line.includes(value));
      if(!approved) errors.push(`${currentPath}:${newLine}: new !important is not allowed -> ${line.trim()}`);
    }
    if(/min-(?:height|width)\s*:/.test(line) && /\bimg\b/.test(selector)){
      errors.push(`${currentPath}:${newLine}: image min-size rule is forbidden; media stage owns image sizing -> ${selector}`);
    }
    if(isRoute && sharedSelector.test(selector)){
      errors.push(`${currentPath}:${newLine}: route CSS may not restyle shared component selector -> ${selector}`);
    }
    if(line.includes(":global(")){
      errors.push(`${currentPath}:${newLine}: new :global() CSS override is not allowed`);
    }
    newLine++;
    continue;
  }
  if(raw.startsWith("-") && !raw.startsWith("---")) continue;
  if(!raw.startsWith("\\")) newLine++;
}


function styleDebt(source){
  return {
    rawColor:(source.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g)||[]).length,
    important:(source.match(/!important/g)||[]).length,
    sharedSelectors:(source.match(/\.(?:product-card(?:-media|-copy|-shell)?|section-head|brand-facts|product-grid|entity-media-contained|model-card)\b/g)||[]).length,
    imageMin:(source.match(/\bimg\b[^{}]*\{[^}]*min-(?:height|width)\s*:/gs)||[]).length,
    globalSelectors:(source.match(/:global\\(/g)||[]).length
  };
}

let styleFiles=[];
try{
  styleFiles=execFileSync("git",["diff","--name-only","HEAD^1","HEAD","--","app/**/*Style.tsx","app/**/*Style.ts"],{encoding:"utf8"}).trim().split(/\r?\n/).filter(Boolean);
}catch{}
for(const file of styleFiles){
  const current=fs.existsSync(file)?fs.readFileSync(file,"utf8"):"";
  let previous="";
  try{previous=execFileSync("git",["show",`HEAD^1:${file}`],{encoding:"utf8"});}catch{}
  const before=styleDebt(previous);
  const after=styleDebt(current);
  for(const key of Object.keys(after)){
    if(after[key]>before[key]){
      errors.push(`${file}: CSS-in-TS ${key} debt increased from ${before[key]} to ${after[key]}`);
    }
  }
}

if(errors.length){
  console.error("Design lint failed. New visual debt is blocked:");
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Design lint passed: this change adds no unapproved raw colors, !important rules, image min-size hacks, route-owned shared-component skins, or :global() overrides.");

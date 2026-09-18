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

function git(args,options={}){
  return execFileSync("git",args,{encoding:"utf8",...options});
}

function resolveBase(){
  const explicit=process.env.DESIGN_LINT_BASE?.trim();
  if(explicit){
    git(["rev-parse","--verify",explicit],{stdio:"ignore"});
    return explicit;
  }

  const baseRef=process.env.GITHUB_BASE_REF?.trim();
  if(baseRef){
    for(const candidate of [`origin/${baseRef}`,baseRef]){
      try{
        git(["rev-parse","--verify",candidate],{stdio:"ignore"});
        return git(["merge-base",candidate,"HEAD"]).trim();
      }catch{}
    }
    throw new Error(`Design lint could not resolve the pull-request base "${baseRef}". Ensure checkout uses fetch-depth: 0.`);
  }

  return git(["rev-parse","HEAD^"]).trim();
}

const base=resolveBase();

function diffText(){
  return git(["diff","--unified=0",base,"HEAD","--","app/**/*.css","app/*.css"]);
}

function changedFiles(patterns){
  const output=git(["diff","--name-only",base,"HEAD","--",...patterns]).trim();
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function selectorForLine(filePath,lineNumber){
  if(!fs.existsSync(filePath)) return "";
  const lines=fs.readFileSync(filePath,"utf8").split(/\r?\n/);
  let selector="";
  let depth=0;
  const targetIndex=Math.max(0,lineNumber-1);

  for(let i=0;i<=targetIndex && i<lines.length;i++){
    const line=lines[i];
    if(depth===0){
      const brace=line.indexOf("{");
      if(brace<0) continue;
      selector=line.slice(0,brace).trim();
      if(i===targetIndex) return selector;
      const opens=(line.match(/\{/g)||[]).length;
      const closes=(line.match(/\}/g)||[]).length;
      depth=opens-closes;
      if(depth<=0){depth=0;selector="";}
      continue;
    }

    if(i===targetIndex) return selector;
    depth+=(line.match(/\{/g)||[]).length;
    depth-=(line.match(/\}/g)||[]).length;
    if(depth<=0){depth=0;selector="";}
  }
  return selector;
}

function sourceAt(ref,file){
  try{
    return execFileSync("git",["show",`${ref}:${file}`],{encoding:"utf8",stdio:["ignore","pipe","ignore"]});
  }catch{
    return "";
  }
}

function nonZeroImageMinCount(source){
  const imageBlocks=source.match(/\bimg\b[^{}]*\{[^}]*\}/gs)||[];
  let count=0;
  for(const block of imageBlocks){
    for(const match of block.matchAll(/min-(?:height|width)\s*:\s*([^;}]+)/g)){
      const value=match[1].trim();
      if(!/^0(?:[a-z%]+)?$/i.test(value)) count++;
    }
  }
  return count;
}

function styleDebt(source){
  return {
    rawColor:(source.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g)||[]).length,
    important:(source.match(/!important/g)||[]).length,
    sharedSelectors:(source.match(/\.(?:product-card(?:-media|-copy|-shell)?|section-head|brand-facts|product-grid|entity-media-contained|model-card)\b/g)||[]).length,
    imageMin:nonZeroImageMinCount(source),
    globalSelectors:(source.match(/:global\(/g)||[]).length
  };
}

const diff=diffText();
const styleFiles=changedFiles(["app/**/*Style.tsx","app/**/*Style.ts"]);
const cssFiles=changedFiles(["app/**/*.css","app/*.css"]);
if(!diff.trim() && styleFiles.length===0){
  console.log(`Design lint: no design-surface changes between ${base.slice(0,8)} and HEAD.`);
  process.exit(0);
}

const errors=[];
let currentPath="";
let newLine=0;
for(const raw of diff.split(/\r?\n/)){
  if(raw.startsWith("+++ b/")){currentPath=raw.slice(6);continue;}
  const hunk=raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if(hunk){newLine=Number(hunk[1]);continue;}
  if(!currentPath || !currentPath.endsWith(".css")) continue;

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
    if(/\bimg\b/.test(selector) && nonZeroImageMinCount(`${selector}{${line}}`) > 0){
      errors.push(`${currentPath}:${newLine}: non-zero image min-size rule is forbidden; media stage owns image sizing -> ${selector}`);
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

for(const file of cssFiles){
  if(file==="app/styles/tokens.css") continue;
  const before=styleDebt(sourceAt(base,file));
  const after=styleDebt(fs.existsSync(file)?fs.readFileSync(file,"utf8"):"");
  for(const key of Object.keys(after)){
    if(after[key]>before[key]){
      errors.push(`${file}: ${key} design debt increased from ${before[key]} to ${after[key]} across the PR`);
    }
  }
}

for(const file of styleFiles){
  const beforeSource=sourceAt(base,file);
  const current=fs.existsSync(file)?fs.readFileSync(file,"utf8"):"";
  const before={...styleDebt(beforeSource),rawPx:(beforeSource.match(/\b\d+(?:\.\d+)?px\b/g)||[]).length};
  const after={...styleDebt(current),rawPx:(current.match(/\b\d+(?:\.\d+)?px\b/g)||[]).length};
  for(const key of Object.keys(after)){
    if(after[key]>before[key]){
      errors.push(`${file}: CSS-in-TS ${key} debt increased from ${before[key]} to ${after[key]} across the PR`);
    }
  }
}

if(errors.length){
  console.error(`Design lint failed against base ${base.slice(0,8)}. New visual debt is blocked:`);
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Design lint passed against base ${base.slice(0,8)}: no raw-color, !important, shared-selector, image-sizing or global-selector debt increased across the PR.`);

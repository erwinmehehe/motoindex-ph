import fs from "node:fs";
import path from "node:path";

const sources=["lib/data.ts","lib/phTier23Models.ts"].filter(fs.existsSync);
const records=[];
for(const file of sources){
  const text=fs.readFileSync(file,"utf8");
  const chunks=text.split(/\n\s*\{\s*\n/).slice(1);
  for(const chunk of chunks){
    const id=chunk.match(/\bid:\s*["']([^"']+)["']/)?.[1];
    const make=chunk.match(/\bmake:\s*["']([^"']+)["']/)?.[1];
    const model=chunk.match(/\bmodel:\s*["']([^"']+)["']/)?.[1];
    if(!id||!make||!model)continue;
    const number=(key)=>{const m=chunk.match(new RegExp(`\\b${key}:\\s*(-?\\d+(?:\\.\\d+)?)`));return m?Number(m[1]):undefined;};
    records.push({file,id,make,model,srp:number("srp"),engineCc:number("engineCc"),seatHeightMm:number("seatHeightMm"),curbWeightKg:number("curbWeightKg"),sourceUrl:/\bsourceUrl:\s*["']https?:\/\//.test(chunk),verifiedAt:/\bverifiedAt:\s*["']\d{4}-\d{2}-\d{2}["']/.test(chunk),image:/\b(?:imageUrl|image|sourceImageUrl):\s*["']https?:\/\//.test(chunk)});
  }
}
const ids=new Map(); const issues=[]; const warnings=[];
for(const row of records){
  if(ids.has(row.id))issues.push(`Duplicate model id ${row.id} in ${ids.get(row.id)} and ${row.file}`); else ids.set(row.id,row.file);
  if(row.srp!==undefined&&row.srp<=0)issues.push(`${row.id}: non-positive SRP ${row.srp}`);
  if(row.engineCc!==undefined&&(row.engineCc<40||row.engineCc>2500))warnings.push(`${row.id}: unusual engine displacement ${row.engineCc}cc`);
  if(row.seatHeightMm!==undefined&&(row.seatHeightMm<600||row.seatHeightMm>1000))warnings.push(`${row.id}: unusual seat height ${row.seatHeightMm}mm`);
  if(row.curbWeightKg!==undefined&&(row.curbWeightKg<60||row.curbWeightKg>500))warnings.push(`${row.id}: unusual curb weight ${row.curbWeightKg}kg`);
  if(!row.sourceUrl)warnings.push(`${row.id}: no HTTP sourceUrl found in record block`);
  if(!row.verifiedAt)warnings.push(`${row.id}: no verifiedAt date found in record block`);
}
fs.mkdirSync("artifacts",{recursive:true});
fs.writeFileSync("artifacts/model-quality-report.md",[`# Motorcycle data quality report`,``,`Scanned models: ${records.length}`,`Blocking issues: ${issues.length}`,`Review warnings: ${warnings.length}`,``,"## Blocking issues",...(issues.length?issues.map(x=>`- ${x}`):["- None"]),``,"## Review queue",...(warnings.length?warnings.map(x=>`- ${x}`):["- None"])].join("\n"));
if(issues.length){console.error("Model quality audit failed:\n- "+issues.join("\n- "));process.exit(1)}
console.log(`Model quality audit passed: ${records.length} model blocks scanned, ${warnings.length} review warnings written to artifacts/model-quality-report.md.`);

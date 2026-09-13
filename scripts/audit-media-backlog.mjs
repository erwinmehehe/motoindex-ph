import fs from "node:fs";

const sources=["lib/data.ts","lib/phTier23Models.ts"].filter(fs.existsSync);
const rows=[];
for(const file of sources){
  const text=fs.readFileSync(file,"utf8");
  const chunks=text.split(/\n\s*\{\s*\n/).slice(1);
  for(const chunk of chunks){
    const id=chunk.match(/\bid:\s*["']([^"']+)["']/)?.[1];
    const make=chunk.match(/\bmake:\s*["']([^"']+)["']/)?.[1];
    const model=chunk.match(/\bmodel:\s*["']([^"']+)["']/)?.[1];
    if(!id||!make||!model)continue;
    const hasDirectImage=/\b(?:imageUrl|image|sourceImageUrl):\s*["']https?:\/\//.test(chunk);
    rows.push({id,label:`${make} ${model}`,hasDirectImage,file});
  }
}
const missing=rows.filter(row=>!row.hasDirectImage);
fs.mkdirSync("artifacts",{recursive:true});
fs.writeFileSync("artifacts/media-backlog.md",[`# Motorcycle media backlog`,``,`Model blocks scanned: ${rows.length}`,`Records without a direct HTTP image field in the model block: ${missing.length}`,``,`This is a production-media work queue, not a build failure. EntityMedia can still provide approved media from the media registry.`,``,"## Review queue",...(missing.length?missing.map(row=>`- ${row.label} (${row.id}) — ${row.file}`):["- None"])].join("\n"));
console.log(`Media backlog audit: ${missing.length}/${rows.length} model blocks need direct-image review. Report: artifacts/media-backlog.md`);

import fs from "node:fs";

const failures = [];

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function checkMotorcycleSummaries(path) {
  const text = read(path);
  const blockPattern = /id:\s*"([^"]+)"[\s\S]*?summary:\s*"([^"]*)"/g;
  for (const match of text.matchAll(blockPattern)) {
    const block = match[0];
    const id = match[1];
    const summary = match[2];
    const engine = block.match(/engineCc:\s*([\d.]+)/)?.[1];
    const weight = block.match(/curbWeightKg:\s*([\d.]+)/)?.[1];
    const seat = block.match(/seatHeightMm:\s*([\d.]+)/)?.[1];

    if (engine && /\bcc\b/i.test(summary) && !summary.includes(engine)) {
      failures.push(`${path}: ${id} summary mentions cc but not the stored ${engine} cc value`);
    }
    if (weight && /\bkg\b/i.test(summary) && !summary.includes(weight)) {
      failures.push(`${path}: ${id} summary mentions kg but not the stored ${weight} kg value`);
    }
    if (seat && /\bmm\b/i.test(summary) && /seat/i.test(summary) && !summary.includes(seat)) {
      failures.push(`${path}: ${id} summary mentions seat height but not the stored ${seat} mm value`);
    }
  }
}

checkMotorcycleSummaries("lib/data.ts");
checkMotorcycleSummaries("lib/phTier23Models.ts");

const usedMarket = read("lib/usedMarket.ts");
if (!usedMarket.includes('listingsForModel(modelId:string){return usedListings.filter(x=>x.modelId===modelId&&x.status==="verified");}')) {
  failures.push("lib/usedMarket.ts: public listingsForModel must expose verified listings only");
}
if (!usedMarket.includes('getUsedListing(id:string){return usedListings.find(x=>x.id===id&&x.status==="verified");}')) {
  failures.push("lib/usedMarket.ts: public getUsedListing must expose verified listings only");
}

const sourceRef = read("components/SourceRef.tsx");
if (!sourceRef.includes('"nofollow noreferrer"')) {
  failures.push("components/SourceRef.tsx: competitor citations must retain nofollow noreferrer");
}

const publicFiles = {
  "components/MotorcycleEntityPage.tsx": [
    "Authority score",
    "publication gate",
    "generated paragraphs",
    "Observed PH price"
  ],
  "app/recommendations/[slug]/page.tsx": [
    "defensible scoring model",
    "guide-source-freshness",
    "Philippine-market record"
  ]
};

for (const [path, phrases] of Object.entries(publicFiles)) {
  const text = read(path);
  for (const phrase of phrases) {
    if (text.includes(phrase)) failures.push(`${path}: remove public internal-language phrase "${phrase}"`);
  }
}

const priceChecks = read("components/MarketPriceChecks.tsx");
if (!priceChecks.includes('href="/dealers"')) {
  failures.push("components/MarketPriceChecks.tsx: price verification should keep a dealer-directory next step");
}

if (failures.length) {
  console.error("Public trust validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public trust validation passed.");

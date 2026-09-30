import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    failures.push(`missing required schema file: ${file}`);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

function requireTokens(file, tokens) {
  const source = read(file);
  for (const token of tokens) {
    if (!source.includes(token)) failures.push(`${file}: missing schema coverage token ${token}`);
  }
}

requireTokens("app/layout.tsx", ['"@type": "Organization"', '"@type": "WebSite"']);
const home = read("app/page.tsx");
if (home.includes("MotorcycleDealer")) failures.push("app/page.tsx must not identify MotoIndex itself as a MotorcycleDealer");

requireTokens("lib/structuredData.ts", [
  '"@type": "Offer"',
  'priceCurrency: "PHP"',
  '"MotorcycleDealer"',
  '"@type": "ItemList"',
  '"@type": "CollectionPage"'
]);

requireTokens("components/MotorcycleEntityPage.tsx", ["motorcycleOfferSchema", "offers: offer"]);
requireTokens("app/gear/helmets/[brand]/[product]/page.tsx", ["catalogProductOfferSchema", "offers:"]);
requireTokens("app/tires/[slug]/[product]/page.tsx", ["catalogProductOfferSchema", "offers:"]);
requireTokens("app/accessories/top-box/[product]/page.tsx", ["catalogProductOfferSchema", "offers:"]);

requireTokens("app/sellers/[slug]/page.tsx", ["sellerBusinessSchema", "<JsonLd data={localBusinessSchema}"]);
requireTokens("app/dealers/page.tsx", ["dealerDirectorySchema", "<JsonLd data={directorySchema}"]);
requireTokens("app/dealers/[city]/page.tsx", ["dealerDirectorySchema", "<JsonLd data={directorySchema}"]);
requireTokens("app/dealers/pampanga/page.tsx", ["dealerDirectorySchema", "<JsonLd data={directorySchema}"]);

if (failures.length) {
  console.error("Structured-data coverage validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("Structured-data coverage validation passed.");

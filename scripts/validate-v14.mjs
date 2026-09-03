import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = loadTypeScript();
const root = process.cwd();
const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

for (const file of ["lib/topBoxFitment.ts","lib/ownershipGuides.ts","lib/media.ts","components/EntityMedia.tsx","app/ownership/[slug]/page.tsx","app/fitment/[make]/[slug]/page.tsx","app/motorcycles/[make]/[slug]/tire-size/page.tsx","scripts/validate-v14.mjs"]) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
}

const fitment = read("lib/topBoxFitment.ts");
for (const code of ["Y0AE14IST","H0XD12IST","H0VR15IST","H0IPC11ST","Y0NM14IST"]) if (!fitment.includes(code)) errors.push(`Missing top-box rack code ${code}`);
if ((fitment.match(/status: "verified"/g) || []).length < 4) errors.push("Expected at least four verified manufacturer top-box fitment edges");

const catalog = read("lib/catalog.ts");
if (!/pirelli-angel-scooter[\s\S]{0,1200}status:"verified"/.test(catalog)) errors.push("Pirelli Angel Scooter should be source-backed and verified");
if (!catalog.includes("getTopBoxFitmentsForModel")) errors.push("Top-box model suggestions must consult explicit fitment edges");
const modelTirePage = read("app/motorcycles/[make]/[slug]/tire-size/page.tsx");
const entityPage = fs.existsSync(path.join(root,"components/MotorcycleEntityPage.tsx")) ? read("components/MotorcycleEntityPage.tsx") : "";
if (!modelTirePage.includes("getTireProductsForModel") && !(modelTirePage.includes("permanentRedirect") && entityPage.includes("getTireProductsForModel"))) errors.push("Canonical model tire section must surface catalog size matches");
const modelFitmentPage = read("app/fitment/[make]/[slug]/page.tsx");
if (!(modelFitmentPage.includes("getTopBoxFitmentsForModel") && modelFitmentPage.includes("rackCode")) && !(modelFitmentPage.includes("permanentRedirect") && entityPage.includes("getTopBoxFitmentsForModel") && entityPage.includes("rackCode"))) errors.push("Canonical model fitment section must expose explicit rack evidence");

const ownership = read("lib/ownershipGuides.ts");
for (const slug of ["registration-renewal","transfer-of-ownership","motorcycle-insurance"]) if (!ownership.includes(`slug: "${slug}"`)) errors.push(`Missing ownership guide ${slug}`);
for (const domain of ["lto.gov.ph","insurance.gov.ph"]) if (!ownership.includes(domain)) errors.push(`Ownership guides missing primary-source domain ${domain}`);

const sitemaps = read("lib/sitemaps.ts");
if (sitemaps.includes('f.modelIds.includes')) errors.push("Sitemap still references removed ModelFamily.modelIds");
if (!sitemaps.includes("f.generationIds.includes")) errors.push("Sitemap family URLs must use ModelFamily.generationIds");
if (sitemaps.includes('["/corrections",.35]')) errors.push("Noindex corrections page must not be in sitemap");
if (!sitemaps.includes("NEXT_PUBLIC_CONTACT_EMAIL")) errors.push("Contact sitemap entry should be gated by configured public email");

const productValidator = read("scripts/validate-product-layer.mjs");
if (productValidator.includes("/mnt/data/motoindex-ph-next")) errors.push("Product validator still has an environment-specific absolute root");

const schema = read("prisma/schema.prisma");
for (const model of ["model MediaAsset ","model MaintenanceRecord "]) if (!schema.includes(model)) errors.push(`Prisma missing ${model.trim()}`);
for (const field of ["bracketCode","plateRequirement","rightsStatus","intervalKm"]) if (!schema.includes(field)) errors.push(`Prisma missing source-aware field ${field}`);
const variantBlock = schema.match(/model Variant \{[\s\S]*?\n\}/)?.[0] || "";
if (/AccessoryFitment|MediaAsset|MaintenanceRecord/.test(variantBlock)) errors.push("Variant contains a relation without a matching foreign key in the new v1.4 models");
for (const relation of ["accessoryFitments AccessoryFitment[]","mediaAssets   MediaAsset[]","maintenanceRecords MaintenanceRecord[]"]) if (!schema.includes(relation)) errors.push(`Source model missing opposite relation ${relation}`);

const media = read("lib/media.ts");
const mediaComponent = read("components/EntityMedia.tsx");
const safeImage = read("components/SafeEntityImage.tsx");
if (!media.includes('rightsStatus: "first-party"')) errors.push("Media seed must demonstrate explicit rights status");
if (!mediaComponent.includes("SafeEntityImage") || !safeImage.includes('from "next/image"') || !safeImage.includes("onError")) errors.push("Entity media pipeline must render through next/image with a runtime failure state");
for (const page of ["app/motorcycles/[make]/[slug]/page.tsx","app/gear/helmets/[brand]/[product]/page.tsx","app/tires/[slug]/[product]/page.tsx","app/accessories/top-box/[product]/page.tsx"]) { let src=read(page); if(page==="app/motorcycles/[make]/[slug]/page.tsx"&&src.includes("MotorcycleEntityPage")) src+=entityPage; if (!src.includes("<EntityMedia")) errors.push(`${page} is not wired to the rights-aware media renderer`); }

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name).split(path.sep).join("/");
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) sourceFiles.push(full);
  }
}
for (const dir of ["app","components","lib"]) walk(path.join(root, dir));
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const out = ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true, fileName: file });
  for (const diagnostic of out.diagnostics || []) if (diagnostic.category === ts.DiagnosticCategory.Error) errors.push(`${path.relative(root,file).split(path.sep).join("/")}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText," ")}`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`v1.4 validation passed: explicit top-box fitment graph, verified priority tire family, ownership source guides, media/maintenance contracts, sitemap fixes, ${sourceFiles.length} TS/TSX source files syntax-clean.`);

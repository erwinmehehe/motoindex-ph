import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const page = fs.readFileSync(path.join(root, "app/compare/[slug]/page.tsx"), "utf8");
const pageCssPath = path.join(root, "app/compare/[slug]/ComparisonDetailPage.module.css");
const matrix = fs.readFileSync(path.join(root, "components/ComparisonDecisionMatrix.tsx"), "utf8");
const matrixCssPath = path.join(root, "components/ComparisonDecisionMatrix.module.css");
const editorial = fs.readFileSync(path.join(root, "components/ComparisonEditorial.tsx"), "utf8");
const editorialCssPath = path.join(root, "components/ComparisonEditorial.module.css");
const workbenchCss = fs.readFileSync(path.join(root, "components/ComparisonDecisionWorkbench.module.css"), "utf8");
const tableCss = fs.readFileSync(path.join(root, "components/DetailedMotorcycleCompare.module.css"), "utf8");

const errors = [];
if (!page.includes("ComparisonDetailPage.module.css")) errors.push("comparison detail page does not load its route-scoped visual system");
for (const token of ["styles.hero", "styles.deltaRail", "styles.contentFlow"]) {
  if (!page.includes(token)) errors.push(`comparison detail page is missing ${token}`);
}
if (!fs.existsSync(pageCssPath)) errors.push("comparison detail route stylesheet is missing");
if (!matrix.includes("ComparisonDecisionMatrix.module.css")) errors.push("decision matrix still relies on unscoped or missing styles");
if (!fs.existsSync(matrixCssPath)) errors.push("decision matrix stylesheet is missing");
if (!editorial.includes("ComparisonEditorial.module.css")) errors.push("comparison editorial still relies on unscoped or missing styles");
if (!fs.existsSync(editorialCssPath)) errors.push("comparison editorial stylesheet is missing");
for (const token of ["styles.differenceList", "styles.variantGrid", "styles.variantRow"]) {
  if (!editorial.includes(token)) errors.push(`comparison editorial is missing structured layout hook: ${token}`);
}
if (fs.existsSync(editorialCssPath)) {
  const editorialCss = fs.readFileSync(editorialCssPath, "utf8");
  for (const token of ["grid-template-columns:repeat(2,minmax(0,1fr))", "grid-template-columns:minmax(90px,.55fr) minmax(110px,.55fr) minmax(0,1.5fr)"]) {
    if (!editorialCss.includes(token)) errors.push(`comparison editorial is missing responsive data layout: ${token}`);
  }
}
for (const token of ["grid-template-columns:minmax(0,", "position:sticky"]) {
  if (!workbenchCss.includes(token)) errors.push(`decision workbench is missing analytics-layout rule: ${token}`);
}
for (const token of ["position:sticky", "border-collapse:separate"]) {
  if (!tableCss.includes(token)) errors.push(`comparison table is missing scan-friendly rule: ${token}`);
}

if (errors.length) {
  console.error(`Comparison detail design validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("Comparison detail design validation passed.");

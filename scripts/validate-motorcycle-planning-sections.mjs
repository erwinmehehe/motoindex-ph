import fs from "node:fs";

const css = fs.readFileSync("app/styles/calculator-system.css", "utf8");
const modelDetail = fs.readFileSync("app/model-detail.css", "utf8");
const failures = [];

const requireRule = (source, pattern, message) => {
  if (!pattern.test(source)) failures.push(message);
};

requireRule(css, /\.finance-scenario-section\s*\{[^}]*border\s*:/s, "Financing snapshots need a bounded card surface.");
requireRule(css, /\.finance-scenario-section\s+\.ui-stat-row\s*\{[^}]*grid-template-columns/s, "Financing scenarios need their own responsive card grid.");
requireRule(css, /\[data-calculator="rider-fit"\]\s*\{[^}]*background\s*:/s, "Rider fit needs a deliberate shared surface.");
requireRule(modelDetail, /#ownership\s+\.commute-snapshot-kpis>span\.is-primary\s*\{[^}]*background:var\(--mi-color-primary-soft\)/s, "Ownership needs a visually dominant monthly-cost KPI.");
requireRule(css, /@media\(max-width:620px\)[\s\S]*\.finance-scenario-section/s, "Financing snapshots need an explicit mobile treatment.");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Motorcycle planning section design contract passed.");

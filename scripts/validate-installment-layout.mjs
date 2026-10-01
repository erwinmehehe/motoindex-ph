import fs from "node:fs";

const component = fs.readFileSync("components/InstallmentCalculator.tsx", "utf8");
const styles = fs.readFileSync("app/styles/calculator-system.css", "utf8");

const failures = [];

if (/className="[^"]*\bcalculator\b[^"]*"\s+data-calculator="installment"/.test(component)) {
  failures.push("The installment planner must not opt into the legacy .calculator grid.");
}

if (!/\[data-calculator="installment"\][^{]*\{[^}]*display\s*:\s*block\b/s.test(styles)) {
  failures.push("The installment planner needs an explicit display:block guard for stale legacy markup.");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Installment planner layout guard is present.");

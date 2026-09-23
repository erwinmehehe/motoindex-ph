import fs from "node:fs";

const required = [
  ["app/garage/page.tsx", ["robots: { index: false", "publicMotorcycles", "GarageWorkspace", "garageCatalog"]],
  ["components/GarageWorkspace.tsx", ["catalogModelId", "Smart maintenance", "Actual fuel economy", "MotoIndex motorcycle", "Export backup"]],
  ["lib/garage.ts", ["smartMaintenanceTasks", "estimatedGarageResaleValue", "actualFuelEconomy", "tireFactsForBike", "\"DEED_OF_SALE\""]],
  ["lib/maintenance.ts", ["garageRule", "pmsMileageMilestones", "pmsRecurringKm"]],
  ["middleware.ts", ["/garage"]],
];

for (const [path, needles] of required) {
  const source = fs.readFileSync(path, "utf8");
  for (const needle of needles) {
    if (!source.includes(needle)) throw new Error(`Garage QA failed: ${path} missing ${needle}`);
  }
}
console.log("Garage QA passed");

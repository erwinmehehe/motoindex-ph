import fs from "node:fs";

const required = [
  ["app/garage/page.tsx", ["robots: { index: false", "GarageWorkspace"]],
  ["components/GarageWorkspace.tsx", ["GARAGE_STORAGE_KEY", "Export backup", "Document wallet", "Maintenance by mileage", "Spend this year", "Fuel economy", "Needs attention", "Verified maintenance reminders", "Mark done", "addVerifiedReminders"]],
  ["lib/garage.ts", ["maintenanceReferenceForBike", "GARAGE_DOCUMENT_TYPES", "\"REGISTRATION\"", "\"INSURANCE\"", "\"RESALE\"", "\"DEED_OF_SALE\""]],
  ["middleware.ts", ["/garage"]],
];

for (const [path, needles] of required) {
  const source = fs.readFileSync(path, "utf8");
  for (const needle of needles) {
    if (!source.includes(needle)) throw new Error(`Garage QA failed: ${path} missing ${needle}`);
  }
}
console.log("Garage QA passed");

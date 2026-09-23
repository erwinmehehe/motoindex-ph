import fs from "node:fs";

const required = [
  ["app/garage/page.tsx", ["robots: { index: false", "GarageWorkspace", "publicMotorcycles", "maintenanceSchedules"]],
  ["components/GarageWorkspace.tsx", ["GARAGE_STORAGE_KEY", "Export backup", "Document wallet", "catalogModelId", "Smart maintenance", "Stock tires", "MotoIndex depreciation estimate", "exactMaintenance"]],
  ["lib/garage.ts", ["maintenanceReferenceForBike", "GARAGE_DOCUMENT_TYPES", "smartMaintenanceDue", "estimatedGarageResale", "\"REGISTRATION\"", "\"INSURANCE\"", "\"RESALE\"", "\"DEED_OF_SALE\""]],
  ["middleware.ts", ["/garage"]],
];

for (const [path, needles] of required) {
  const source = fs.readFileSync(path, "utf8");
  for (const needle of needles) {
    if (!source.includes(needle)) throw new Error(`Garage QA failed: ${path} missing ${needle}`);
  }
}

const workspace = fs.readFileSync("components/GarageWorkspace.tsx", "utf8");
if (!workspace.includes("selectedCatalog?.exactMaintenance && smartMaintenance.length > 0")) {
  throw new Error("Garage QA failed: smart maintenance must remain gated to exact model schedules.");
}
console.log("Garage QA passed");

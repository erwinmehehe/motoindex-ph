import fs from "node:fs";

const required = [
  ["app/garage/page.tsx", ["robots: { index: false", "GarageWorkspace", "publicMotorcycles", "maintenanceSchedules"]],
  ["app/garage/resale/page.tsx", ["robots: { index: false", "GarageResalePack", "Private plate and document references stay hidden"]],
  ["components/GarageWorkspace.tsx", ["GARAGE_STORAGE_KEY", "Export backup", "Document wallet", "catalogModelId", "Smart maintenance", "Stock tires", "Ownership analytics", "Actual fuel economy", "Where the money goes", "Value & depreciation", "purchaseOdometerKm", "fullTank", "Prepare resale pack"]],
  ["components/GarageResalePack.tsx", ["Private by default", "Print / save PDF", "Copy listing draft", "Export seller pack", "No accident records logged in My Garage", "This is not a claim that the motorcycle is accident-free.", "includePlate", "includeDocumentRefs", "includeAmounts"]],
  ["lib/garage.ts", ["maintenanceReferenceForBike", "GARAGE_DOCUMENT_TYPES", "smartMaintenanceDue", "estimatedGarageResale", "garageOwnershipAnalytics", "distanceBasis", "fullTankRecords", "netOwnershipCostPhp", "\"REGISTRATION\"", "\"INSURANCE\"", "\"RESALE\"", "\"DEED_OF_SALE\""]],
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
if (workspace.includes("estimatedResaleValuePhp: n(form.get(\"estimatedResaleValuePhp\")) ?? estimatedGarageResale")) {
  throw new Error("Garage QA failed: automatic resale estimates must remain dynamic, not be stored as owner overrides.");
}

const garage = fs.readFileSync("lib/garage.ts", "utf8");
if (!garage.includes('record.fullTank && record.odometerKm !== undefined')) {
  throw new Error("Garage QA failed: fuel economy must only use explicitly marked full-tank fills.");
}
if (!garage.includes('distanceBasis = "purchase"') || !garage.includes('distanceBasis = "first-log"')) {
  throw new Error("Garage QA failed: cost/km must disclose its mileage baseline.");
}

const resale = fs.readFileSync("components/GarageResalePack.tsx", "utf8");
if (!resale.includes('useState(false)') || !resale.includes('Plate: Hidden from this report') || !resale.includes('Private references hidden from this report')) {
  throw new Error("Garage QA failed: resale pack privacy defaults must hide sensitive owner data.");
}
if (resale.includes("accident-free motorcycle")) {
  throw new Error("Garage QA failed: absence of Garage accident records must not be described as accident-free.");
}
console.log("Garage QA passed");

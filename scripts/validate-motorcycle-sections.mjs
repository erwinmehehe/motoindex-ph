const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const response = await fetch(`${baseUrl}/motorcycles/yamaha/nmax-v3`);

if (!response.ok) {
  throw new Error(`Motorcycle page returned ${response.status}`);
}

const html = await response.text();
const failures = [];

if (html.includes("Price and buying path")) {
  failures.push("removed commercial-intent section is still rendered");
}

for (const marker of [
  'class="authority-verdict motorcycle-decision-panel"',
  'class="authority-grid motorcycle-decision-grid"',
  'class="authority-comparisons motorcycle-alternative-cards"',
  "Similar motorcycles worth checking",
]) {
  if (!html.includes(marker)) failures.push(`missing rendered marker: ${marker}`);
}

if (failures.length > 0) {
  console.error("Motorcycle section validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Motorcycle section validation passed.");

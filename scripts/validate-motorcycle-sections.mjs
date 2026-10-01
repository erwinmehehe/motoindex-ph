const failures = [];
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const routes = [
  "/motorcycles/yamaha/nmax-v3",
  "/motorcycles/honda/giorno-plus",
  "/motorcycles/vespa/sprint-150",
];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) {
    failures.push(`${route} returned ${response.status}`);
    continue;
  }

  const html = await response.text();
  if (html.includes("Price and buying path")) {
    failures.push(`${route} still renders the removed commercial-intent section`);
  }

  for (const marker of [
    'class="authority-verdict motorcycle-decision-panel"',
    'class="authority-grid motorcycle-decision-grid"',
    'class="authority-comparisons motorcycle-alternative-cards"',
    "Similar motorcycles worth checking",
  ]) {
    if (!html.includes(marker)) failures.push(`${route} is missing rendered marker: ${marker}`);
  }
}

if (failures.length > 0) {
  console.error("Motorcycle section validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Motorcycle section validation passed.");

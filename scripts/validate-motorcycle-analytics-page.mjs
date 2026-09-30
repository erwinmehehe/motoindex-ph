const baseUrl = process.env.MOTOINDEX_BASE_URL || "http://localhost:3000";

const cases = [
  {
    path: "/motorcycles/yamaha/aerox-v3",
    label: "Yamaha Aerox V3",
    powerToWeight: "12.4 hp / 100 kg",
  },
  {
    path: "/motorcycles/yamaha/nmax-v3",
    label: "Yamaha NMAX V3",
    powerToWeight: "11.5 hp / 100 kg",
  },
];

for (const testCase of cases) {
  const response = await fetch(`${baseUrl}${testCase.path}`);
  if (!response.ok) throw new Error(`${testCase.path} returned ${response.status}`);

  const html = (await response.text()).replace(/\s+/g, " ");
  const visibleText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const markupExpectations = [
    'data-motorcycle-analytics="true"',
    `aria-label="${testCase.label} performance snapshot"`,
    'data-metric="power"',
    'data-metric="torque"',
    'data-metric="power-to-weight"',
    'data-metric="seat-height"',
  ];
  const textExpectations = [
    "Performance snapshot",
    "The numbers that shape the ride",
    testCase.powerToWeight,
  ];

  for (const expected of markupExpectations) {
    if (!html.includes(expected)) {
      throw new Error(`${testCase.path} is missing rendered analytics contract: ${expected}`);
    }
  }
  for (const expected of textExpectations) {
    if (!visibleText.includes(expected)) {
      throw new Error(`${testCase.path} is missing visible analytics content: ${expected}`);
    }
  }
}

console.log(`Motorcycle analytics validation passed for ${cases.length} representative pages.`);

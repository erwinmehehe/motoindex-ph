import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const gitignore = read(".gitignore");
for (const token of ["node_modules/", ".next/", ".env", "!.env.example"]) expect(gitignore.includes(token), `.gitignore missing ${token}`);

const data = read("lib/data.ts");
expect(data.includes("modelSourceNeedsRefresh"), "motorcycle indexing gate must enforce age-based source freshness");
const freshness = read("lib/freshnessPolicy.ts");
for (const token of ["MODEL_SOURCE_MAX_AGE_DAYS = 90", "MARKET_PRICE_MAX_AGE_DAYS = 30", "marketPriceNeedsRefresh"]) expect(freshness.includes(token), `freshness policy missing ${token}`);

const finance = read("app/api/finance/route.ts");
for (const token of ["maxDownPct: 95", "maxMonths: 84", "maxRatePct: 60", "Number.isInteger(months)", '"Cache-Control": "no-store"']) expect(finance.includes(token), `finance route hardening missing ${token}`);

const calculator = read("components/InstallmentCalculator.tsx");
expect(calculator.includes("Purchase price"), "installment calculator must expose editable purchase price");
const entityPage = fs.existsSync("components/MotorcycleEntityPage.tsx") ? read("components/MotorcycleEntityPage.tsx") : "";
for (const file of ["app/motorcycles/[make]/[slug]/page.tsx", "app/motorcycles/[make]/[slug]/price/page.tsx"]) {
  const src=read(file);
  expect(src.includes("observedMarketRange") || (src.includes("MotorcycleEntityPage")&&entityPage.includes("observedMarketRange")) || (src.includes("permanentRedirect")&&entityPage.includes("observedMarketRange")), `${file} must resolve to financing seeded from observed market range`);
}

for (const file of ["components/CommuteSnapshot.tsx", "components/CommuteCostCalculator.tsx"]) {
  const body=read(file);
  expect(body.includes("efficiencyEvidence"), `${file} must use fuel-economy evidence state`);
  expect(body.includes("estimated"), `${file} must visibly label estimated fuel economy`);
}

const redirectRoute = read("app/go/[offerId]/route.ts");
for (const token of ["Cache-Control", "no-store", "X-Robots-Tag", "noindex, nofollow, noarchive"]) expect(redirectRoute.includes(token), `generic offer redirect hardening missing ${token}`);

const nextConfig = read("next.config.mjs");
for (const token of ["Content-Security-Policy", "default-src 'self'", "object-src 'none'", "frame-ancestors 'self'"]) expect(nextConfig.includes(token), `security headers missing ${token}`);

const middleware = read("middleware.ts");
for (const token of ["AUTH_MAX_FAILURES = 10", "AUTH_WINDOW_MS", "Too many authentication attempts.", "Retry-After"]) expect(middleware.includes(token), `admin authentication throttling missing ${token}`);

const prisma = read("scripts/prisma-validate.mjs");
expect(prisma.includes("motoindex_validation"), "Prisma validation wrapper must supply a non-production validation URL when DATABASE_URL is absent");

if (failures.length) {
  console.error("Launch hardening validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("Launch hardening validation passed.");

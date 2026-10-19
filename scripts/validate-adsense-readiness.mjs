import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const requireFile = (...parts) => {
  const file = path.join(root, ...parts);
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${parts.join("/")}`);
};
const requireText = (source, needle, message) => {
  if (!source.includes(needle)) errors.push(message);
};

requireFile("app", "ads.txt", "route.ts");
requireFile("lib", "adsense.ts");
requireFile("components", "AdSense.tsx");

if (fs.existsSync(path.join(root, "app", "ads.txt", "route.ts"))) {
  const route = read("app", "ads.txt", "route.ts");
  requireText(route, "adsensePublisherId", "ads.txt route must use validated AdSense publisher configuration.");
  requireText(route, "f08c47fec0942fa0", "ads.txt route must emit Google's certification authority ID.");
  requireText(route, "status: 404", "ads.txt route must stay unavailable until a real publisher ID is configured.");
  requireText(route, 'content-type": "text/plain; charset=utf-8"', "ads.txt route must return plain text.");
}
if (fs.existsSync(path.join(root, "lib", "adsense.ts"))) {
  const config = read("lib", "adsense.ts");
  requireText(config, "ADSENSE_PUBLISHER_ID", "AdSense config must read the server-side publisher ID.");
  requireText(config, "/^pub-\\d{16}$/", "AdSense publisher ID must be validated as pub- plus 16 digits.");
  requireText(config, "NEXT_PUBLIC_ADSENSE_CLIENT_ID", "AdSense client config must support the ca-pub client ID separately.");
  requireText(config, "/^ca-pub-\\d{16}$/", "AdSense client ID must be validated as ca-pub plus 16 digits.");
  requireText(config, "pub-1900865456140693", "Verified MotoIndex AdSense publisher ID must remain configured.");
  requireText(config, "ca-pub-1900865456140693", "Verified MotoIndex AdSense client ID must remain configured.");
  requireText(config, 'NEXT_PUBLIC_ADSENSE_ENABLED === "true"', "AdSense must not load without explicit operator activation.");
  requireText(config, 'NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"', "AdSense must stay OFF until independent CSP, consent and private-route approval.");
}
if (fs.existsSync(path.join(root, "components", "AdSense.tsx"))) {
  const component = read("components", "AdSense.tsx");
  requireText(component, "adsenseEnabled", "AdSense bootstrap must use validated activation state.");
  requireText(component, "adsenseClientId", "AdSense bootstrap must use the validated ca-pub client ID.");
  requireText(component, 'strategy="afterInteractive"', "Guide-scoped AdSense bootstrap must load after the nonce-protected document is interactive.");
  requireText(component, "nonce={nonce}", "AdSense bootstrap must carry the middleware nonce.");
  requireText(component, "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=", "AdSense bootstrap must use Google's current loader URL.");
}
const layout = read("app", "layout.tsx");
requireText(layout, "<AdSenseNavigationSafety", "Root layout must enforce document boundaries when AdSense has loaded.");
if (layout.includes("<AdSense/>") || layout.includes("<AdSense />")) errors.push("Root layout must not inject AdSense on private routes.");
const editorialGuide = read("app", "guides", "[slug]", "page.tsx");
requireText(editorialGuide, "<AdSense nonce={adNonce} />", "Only public editorial guide pages may mount the AdSense bootstrap.");
requireText(editorialGuide, "nonceReady={Boolean(adNonce)}", "Guide ad slot must require a matching nonce.");
const middleware = read("middleware.ts");
requireText(middleware, "adsenseGuideCsp(nonce)", "AdSense guide middleware must inject a nonce-bound CSP.");
const workflow = read(".github", "workflows", "cloudflare-production-deploy.yml");
requireText(workflow, "vars.MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED || 'false'", "AdSense release gate must remain owner controlled, OFF by default.");
const privacy = read("app", "privacy", "page.tsx");
for (const token of [
  "Google advertising cookies",
  "third-party vendors, including Google",
  "Ads Settings",
  "personalized advertising"
]) {
  requireText(privacy, token, `Privacy page missing AdSense disclosure: ${token}`);
}
const robots = read("app", "robots.ts");
requireText(robots, 'allow:["/","/ads.txt"]', "robots.txt must explicitly allow /ads.txt while keeping protected paths disallowed.");

if (errors.length) {
  console.error("AdSense readiness validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("AdSense readiness validation passed: ads.txt is root-routable, publisher IDs are validated, privacy disclosure is present, and crawlers can reach ads.txt.");

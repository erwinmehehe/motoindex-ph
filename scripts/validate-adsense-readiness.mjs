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
}
if (fs.existsSync(path.join(root, "components", "AdSense.tsx"))) {
  const component = read("components", "AdSense.tsx");
  requireText(component, "adsenseEnabled", "AdSense bootstrap must use validated activation state.");
  requireText(component, "adsenseClientId", "AdSense bootstrap must use the validated ca-pub client ID.");
  requireText(component, 'strategy="beforeInteractive"', "AdSense bootstrap must be injected into the document head.");
  requireText(component, "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=", "AdSense bootstrap must use Google's current loader URL.");
}
const layout = read("app", "layout.tsx");
requireText(layout, "<AdSense", "Root layout must include the AdSense bootstrap.");
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

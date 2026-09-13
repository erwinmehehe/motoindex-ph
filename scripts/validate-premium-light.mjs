import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];
const requireText = (file, text, message) => { if (!file.includes(text)) errors.push(message); };

const layout = read("app", "layout.tsx");
const theme = read("app", "premium-light.css");
const fixes = read("app", "premium-light-fixes.css");
const motion = read("components", "MotionEnhancer.tsx");
const logo = read("public", "brand", "motoindex-mark.svg");

requireText(layout, 'Inter, Plus_Jakarta_Sans', "Layout must use Inter and Plus Jakarta Sans from next/font/google.");
requireText(layout, 'variable: "--font-inter"', "Inter must expose the --font-inter variable.");
requireText(layout, 'variable: "--font-jakarta"', "Plus Jakarta Sans must expose the --font-jakarta variable.");
requireText(layout, 'import "./premium-light.css";', "Premium light design layer must stay loaded.");
requireText(layout, 'import "./premium-light-fixes.css";', "Premium light high-specificity fixes must stay loaded.");
if (layout.indexOf('import "./premium-light-fixes.css";') < layout.indexOf('import "./premium-light.css";')) errors.push("Premium light fixes must load after the base premium light layer.");
requireText(layout, 'data-theme="premium-light"', "Root HTML should identify the premium light theme.");
requireText(layout, '<MotionEnhancer/>', "Root layout must keep the scroll-reveal motion enhancer.");

for (const [token, value] of [["--accent", "#444CE7"], ["--green", "#12B76A"], ["--violet", "#7A5AF8"], ["--accent2", "#FDB022"]]) {
  requireText(theme, `${token}:${value}`, `Premium light theme must retain ${token} ${value}.`);
}
requireText(theme, "background:rgba(255,255,255,.78)!important", "Header should remain a translucent white glass surface.");
requireText(theme, "backdrop-filter:blur(22px) saturate(145%)", "Header should retain glassmorphism blur.");
requireText(theme, "@keyframes ambient-float", "Premium light theme should keep 6–8 second ambient decorative motion.");
requireText(theme, '[data-reveal="pending"]', "Premium light theme should keep scroll-reveal states.");
requireText(theme, "prefers-reduced-motion:reduce", "Motion must respect reduced-motion preferences.");
requireText(fixes, ".finder-live-preview", "Finder dark surface must stay overridden by the premium light layer.");
requireText(fixes, ".compare-tray", "Sticky compare tray must stay light/glass.");
requireText(fixes, ".motorcycle-entity-hero", "Motorcycle detail hero must stay light.");
requireText(fixes, ".mi-category-card:nth-child(1)", "Homepage legacy dark bento cards must stay overridden.");
requireText(motion, "IntersectionObserver", "Motion enhancer should use IntersectionObserver instead of scroll polling.");
requireText(motion, "prefers-reduced-motion", "Motion enhancer must respect reduced motion.");
requireText(logo, "#444CE7", "Brand mark should use the indigo primary color.");
requireText(logo, "#12B76A", "Brand mark should retain the emerald accent.");
requireText(logo, "#FDB022", "Brand mark should retain the amber highlight.");

if (errors.length) {
  console.error("Premium light validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Premium light validation passed.");

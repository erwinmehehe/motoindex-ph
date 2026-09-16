import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];
const requireText = (file, text, message) => { if (!file.includes(text)) errors.push(message); };
const forbidText = (file, text, message) => { if (file.includes(text)) errors.push(message); };

const layout = read("app", "layout.tsx");
const styleStack = read("app", "style-stack.css");
const tokens = read("app", "styles", "tokens.css");
const base = read("app", "styles", "base.css");
const components = read("app", "styles", "components.css");
const routes = read("app", "styles", "routes.css");
const homepage = read("app", "homepage.css");
const theme = read("app", "premium-light.css");
const productExperience = read("app", "product-experience-v2.css");
const recommendationsPage = read("app", "recommendations", "page.tsx");
const recommendationsStyle = read("app", "recommendations", "RecommendationsHubStyle.tsx");
const motion = read("components", "MotionEnhancer.tsx");
const logo = read("public", "brand", "motoindex-mark.svg");

requireText(layout, 'Inter, Plus_Jakarta_Sans', "Layout must use Inter and Plus Jakarta Sans from next/font/google.");
requireText(layout, 'variable: "--font-inter"', "Inter must expose the --font-inter variable.");
requireText(layout, 'variable: "--font-jakarta"', "Plus Jakarta Sans must expose the --font-jakarta variable.");
requireText(layout, 'import "./style-stack.css";', "Root layout must load the global style architecture.");
requireText(layout, 'data-theme="premium-light"', "Root HTML should identify the premium light theme.");
requireText(layout, '<MotionEnhancer/>', "Root layout must keep the scroll-reveal motion enhancer.");

for (const layer of ["tokens", "base", "components", "routes"]) {
  requireText(styleStack, `@import "./styles/${layer}.css";`, `Global style stack must load the ${layer} layer.`);
}
for (const forbidden of ["v247.css","v260.css","v261.css","v270.css","v280.css","redesign.css","redesign-v2.css","arena-sitewide.css","arena-premium-v2.css","experience-v4.css","experience-v5.css","experience-v6.css","experience-v7.css","premium-light-fixes.css","premium-light-final-fixes.css","buyer-flow-final-cleanup.css"]) {
  if (styleStack.includes(forbidden) || base.includes(forbidden) || components.includes(forbidden) || routes.includes(forbidden)) errors.push(`Legacy global style generation ${forbidden} must not be part of the runtime cascade.`);
}

requireText(base, '@import "../globals.css";', "Base layer must retain globals.css.");
requireText(base, '@import "../premium-light.css";', "Base layer must retain the stable premium light theme.");
requireText(components, '@import "../product-system.css";', "Component layer must load the canonical product system.");
requireText(components, '@import "../image-stage-cleanup.css";', "Component layer must load image-stage rules.");
requireText(components, '@import "../product-experience-v2.css";', "Component layer must load the current buyer experience authority layer.");
forbidText(routes, "recommendations-polish.css", "Recommendations styling should stay route-local instead of re-entering the global CSS bundle.");
requireText(recommendationsPage, '<RecommendationsHubStyle />', "Recommendations hub must render its route-local visual system.");
for (const selector of [".rec-hero-actions", ".rec-start-card>a", ".rec-nav", ".rec-principle-grid", ".rec-two-column"]) {
  requireText(recommendationsStyle, selector, `Recommendations route-local style must retain ${selector}.`);
}
requireText(routes, '@import "../homepage.css";', "Route layer must load the single self-contained homepage system.");
forbidText(routes, "homepage-compact-modern.css", "Retired homepage-compact-modern.css must not be loaded by the route layer.");
forbidText(routes, "homepage-feature-hero.css", "Retired homepage-feature-hero.css must not be loaded by the route layer.");
requireText(routes, '@import "../brand-page-refined.css";', "Route layer must retain the current brand experience.");

requireText(homepage, ".mi-hero-layout", "Homepage system must own the hero layout.");
requireText(homepage, "display:grid", "Homepage hero must retain an explicit grid layout instead of depending on retired CSS.");
requireText(homepage, ".mi-search", "Homepage system must own the search presentation.");
requireText(homepage, "grid-template-columns:minmax(0,1fr) auto", "Homepage search must keep a stable field/action grid on desktop.");
requireText(homepage, ".mi-research-shell", "Homepage system must own the research snapshot surface.");
requireText(homepage, ".mi-brand-grid", "Homepage system must own the brand grid.");
requireText(homepage, ".mi-model-grid", "Homepage system must own the motorcycle grid.");
requireText(homepage, ".mi-category-grid", "Homepage system must own the decision-category grid.");
requireText(homepage, "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)", "Homepage hero must retain the light premium background.");
requireText(homepage, ".mi-hero h1", "Homepage system must own hero typography.");
requireText(homepage, "60px", "Homepage desktop H1 must remain restrained to a 60px maximum.");
forbidText(homepage, "background:#090a0d", "Homepage route must not restore the retired near-black hero background.");

for (const [token, value] of [["--mi-primary", "#444CE7"], ["--mi-success", "#12B76A"], ["--mi-violet", "#7A5AF8"], ["--mi-warning", "#FDB022"]]) {
  requireText(tokens, `${token}: ${value}`, `Design tokens must retain ${token} ${value}.`);
}
requireText(tokens, ".page-head h1", "Tokens must enforce the restrained page-heading hierarchy.");
requireText(tokens, "60px", "Desktop page headings must be capped at 60px by the shared hierarchy.");
requireText(tokens, "prefers-reduced-motion: reduce", "Design tokens must respect reduced-motion preferences.");

requireText(theme, "background:rgba(255,255,255,.78)!important", "Header should remain a translucent white glass surface.");
requireText(theme, "backdrop-filter:blur(22px) saturate(145%)", "Header should retain glassmorphism blur.");
requireText(theme, "@keyframes ambient-float", "Premium light theme should keep ambient decorative motion.");
requireText(theme, '[data-reveal="pending"]', "Premium light theme should keep scroll-reveal states.");
requireText(productExperience, ".motorcycle-entity-hero", "Buyer experience layer must own the motorcycle hero.");
requireText(productExperience, ".motorcycle-hero-media", "Buyer experience layer must own motorcycle image stages.");
requireText(productExperience, ".authority-verdict", "Buyer experience layer must own decision verdict surfaces.");
requireText(productExperience, ".motorcycle-entity-page .calculator", "Buyer experience layer must own financing presentation.");
requireText(productExperience, ".recently-viewed", "Buyer experience layer must own recently viewed presentation.");

requireText(motion, "IntersectionObserver", "Motion enhancer should use IntersectionObserver instead of scroll polling.");
requireText(motion, "prefers-reduced-motion", "Motion enhancer must respect reduced motion.");
requireText(logo, "#444CE7", "Brand mark should use the indigo primary color.");
requireText(logo, "#12B76A", "Brand mark should retain the emerald accent.");
requireText(logo, "#FDB022", "Brand mark should retain the amber highlight.");

if (errors.length) {
  console.error("Design-system validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Design-system validation passed.");

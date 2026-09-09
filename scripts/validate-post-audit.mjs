import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(file)=>fs.readFileSync(path.join(root,...file.split("/")),"utf8");
const errors=[];
const need=(ok,message)=>{if(!ok)errors.push(message)};

const header=read("components/Header.tsx");
need(header.includes("motorcycleBrands")&&header.includes("/motorcycles/${slug}"),"Motorcycles nav must expose brand catalog links");
need(header.includes("navGuides.map")&&header.includes("/recommendations/${guide.slug}"),"Guides nav must expose curated public guide pages");

const pair=read("app/compare/[slug]/page.tsx");
const three=read("app/compare/three/page.tsx");
const detailed=read("components/DetailedMotorcycleCompare.tsx");
need(pair.includes("DetailedMotorcycleCompare")&&three.includes("DetailedMotorcycleCompare"),"Motorcycle comparisons must use the detailed comparison workspace");
need(detailed.includes("EntityMedia")&&detailed.includes("compare-diff")&&detailed.includes("Price & market")&&detailed.includes("Fuel & range"),"Detailed comparison must retain selected images, grouped specs and difference highlighting");

const helmetCompare=read("app/gear/helmets/compare/page.tsx");
need(helmetCompare.includes("EntityMedia")&&helmetCompare.includes("compare-diff"),"Helmet comparison must retain selected product images and difference highlighting");
need(!read("app/gear/helmets/page.tsx").includes("verified.slice(0,9)"),"Helmet hub must not arbitrarily cap verified products at nine");

const modelPage=read("app/motorcycles/[make]/[slug]/page.tsx");
need(!/tireCandidates[^\n]*slice\(0,\s*3\)/.test(modelPage)&&!/topBoxCandidates[^\n]*slice\(0,\s*3\)/.test(modelPage),"Model product recommendations must not arbitrarily cap checked products at three");

const affiliate=read("app/go/affiliate/[productId]/route.ts");
const shopee=read("app/go/shopee/[productId]/route.ts");
need(affiliate.includes("affiliate.url, 302")&&!affiliate.includes("affiliate.url, 307"),"Generic affiliate redirect must use 302, not 307");
need(shopee.includes("affiliate.url, 302")&&!shopee.includes("affiliate.url, 307"),"Shopee affiliate redirect must use 302, not 307");

const css=read("app/v247.css");
need(css.includes("--media-canvas:#fff")&&css.includes("background:#fff!important"),"Product and motorcycle media canvases must be white");
need(css.includes("env(safe-area-inset-bottom)")&&css.includes("compare-tray.expanded"),"Mobile compare tray must reserve safe-area/expanded space");
need(css.includes("finder-results button:nth-child(n+3){display:flex}"),"Mobile finder must not hide results that are included in its count");
need(css.includes("last-child:nth-child(odd)"),"Odd entity spec rows must span the table cleanly");

const accessory=read("app/accessories/[slug]/page.tsx");
need(accessory.includes("verifiedBoxesWithImages")&&accessory.includes("verifiedBoxesWithoutImages"),"Top-box hub must distinguish checked records with and without sourced images");

const rec=read("app/recommendations/[slug]/page.tsx");
for(const token of ["We currently track","Quick picks","Full comparison table","How we selected these motorcycles","Individual model analysis","Which one should you choose?","Important caveats","Related recommendation guides","Sources and freshness"]){need(rec.includes(token),`Guide template missing ${token}`)}
const guideTypes=read("lib/types.ts");
for(const field of ["primaryKeyword","secondaryKeywords","directAnswer","inclusionRules","orderingRule","tieBreakers","sourcePolicy","tableColumns","editorialSections","faqQuestions","relatedGuideSlugs"]){need(guideTypes.includes(field),`RecommendationGuide must include ${field}`)}
need(rec.includes("Why it&apos;s here")&&rec.includes("Prices checked:")&&rec.includes("Specifications checked:"),"Guide table and freshness block must expose rationale plus separate price/spec dates");

const middleware=read("middleware.ts");
need(!middleware.includes('pathname.startsWith("/dealers/")')&&!middleware.includes('pathname.startsWith("/sellers/")'),"Middleware must not blanket-block public dealer or verified seller detail routes");
need(middleware.includes('pathname === "/sellers"')&&middleware.includes('"/sellers"'),"Prototype seller directory root must remain hidden while verified seller profiles stay route-gated");
const sellers=read("lib/sellers.ts");
need(sellers.includes("isPublicSeller")&&sellers.includes("publicDealersByCity")&&sellers.includes("getPublicSeller")&&sellers.includes("MIN_PUBLIC_DEALERS_PER_CITY"),"Seller data layer must provide one verified public visibility rule and shared city threshold");
const dealerCity=read("app/dealers/[city]/page.tsx");
need(dealerCity.includes("publicDealersByCity")&&dealerCity.includes("MIN_PUBLIC_DEALERS_PER_CITY")&&dealerCity.includes("notFound()"),"Dealer city routes must require enough verified public dealers");
const sellerPage=read("app/sellers/[slug]/page.tsx");
need(sellerPage.includes("getPublicSeller")&&sellerPage.includes("notFound()")&&sellerPage.includes('o.status==="verified"'),"Seller profiles must reject non-public sellers and hide unverified offers");
const dealersPage=read("app/dealers/page.tsx");
need(dealersPage.includes("No dealer profiles are published yet")&&!dealersPage.includes("sample businesses")&&dealersPage.includes("href={`/sellers/${dealer.slug}`}"),"Dealer root must provide an honest buyer guide and link verified dealer cards");
const continuity=read("components/HeaderContinuity.tsx");
need(continuity.includes('pathname.startsWith("/dealers")')&&continuity.includes('pathname.startsWith("/sellers/")'),"Dealer and seller routes must retain the More navigation active state");
const sitemapSource=read("lib/sitemaps.ts");
need(sitemapSource.includes("publicSellers()")&&sitemapSource.includes("publicDealerCities()")&&sitemapSource.includes("MIN_PUBLIC_DEALERS_PER_CITY"),"Commerce sitemap must use the same public seller and dealer-city rules as routes");
const robotsSource=read("app/robots.ts");
need(robotsSource.includes("commerceSitemapEntries().length")&&robotsSource.includes("/sitemaps/commerce.xml"),"Robots must advertise commerce sitemap only when it has verified public URLs");
const smoke=read("scripts/smoke-production.mjs");
need(smoke.includes('"/dealers"')&&smoke.includes('"/sellers/demo-yamaha-dealer-a"')&&smoke.includes("populated commerce sitemap"),"Production smoke test must cover dealer root, hidden demo routes and populated commerce URLs");
need(fs.existsSync(path.join(root,"app/dealer-directory.css"))&&dealersPage.includes("dealer-checklist")&&dealersPage.includes("dealer-empty-state"),"Dealer directory must retain dedicated mobile checklist and empty-state styling");

const checkLaunch=read("scripts/check-launch.mjs");
need(checkLaunch.includes("findSiblingDynamicRouteConflicts"),"Launch gate must include sibling dynamic route conflict guard");
need(fs.existsSync(path.join(root,"scripts/route-conflict-guard.mjs"))&&fs.existsSync(path.join(root,"scripts/test-route-conflict-guard.mjs")),"Route conflict guard and negative test must be present");
need(read("scripts/validate-v09.mjs").includes("split(path.sep).join")&&read("scripts/validate-v13.mjs").includes("split(path.sep).join"),"Windows-sensitive validator walkers must normalize path separators");

for(const file of ["AFFILIATE_SETUP.md","SHOPEE_AFFILIATE_SETUP.md"]){const source=read(file);need(/build[- ]time/i.test(source)&&/redeploy/i.test(source),`${file} must document build-time affiliate configuration and redeploy requirement`)}

if(errors.length){console.error("Post-audit validation failed:\n- "+errors.join("\n- "));process.exit(1)}
console.log("Post-audit validation passed: navigation, comparisons, product media, dealer publication rules, responsive fixes and route/tooling guards are present.");

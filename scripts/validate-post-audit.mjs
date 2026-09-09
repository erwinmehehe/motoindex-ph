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
for(const token of ["guide-direct-answer","Quick picks","Full comparison table","What qualifies for this comparison","Model-by-model breakdown","Which one should you choose?","Before you buy","Related motorcycle guides","Latest checks"]){need(rec.includes(token),`Guide template missing ${token}`)}
const guideTypes=read("lib/types.ts");
for(const field of ["primaryKeyword","secondaryKeywords","directAnswer","inclusionRules","orderingRule","tieBreakers","sourcePolicy","tableColumns","editorialSections","faqQuestions","relatedGuideSlugs"]){need(guideTypes.includes(field),`RecommendationGuide must include ${field}`)}
need(rec.includes("Why it&apos;s here")&&rec.includes("Prices:")&&rec.includes("Specifications:"),"Guide table and freshness block must expose rationale plus separate price/spec dates");

const middleware=read("middleware.ts");
need(!middleware.includes('pathname.startsWith("/dealers/")')&&!middleware.includes('pathname.startsWith("/sellers/")'),"Middleware must not blanket-block public dealer or verified seller detail routes");
need(middleware.includes('pathname === "/sellers"')&&middleware.includes('"/sellers"'),"Prototype seller directory root must remain hidden while verified seller profiles stay route-gated");
const sellers=read("lib/sellers.ts");
need(sellers.includes("isPublicSeller")&&sellers.includes("publicDealersByCity")&&sellers.includes("getPublicSeller")&&sellers.includes("MIN_PUBLIC_DEALERS_PER_CITY"),"Seller data layer must provide one verified public visibility rule and shared city threshold");
const dealerCity=read("app/dealers/[city]/page.tsx");
need(dealerCity.includes("publicDealersByCity")&&dealerCity.includes("MIN_PUBLIC_DEALERS_PER_CITY")&&dealerCity.includes("notFound()"),"Dealer city routes must require enough verified public dealers");
const sellerPage=read("app/sellers/[slug]/page.tsx");
need(sellerPage.includes("getVerifiedSellerProfile")&&sellerPage.includes("notFound()")&&sellerPage.includes('legacyOffers=offersForSeller(slug).filter(o=>o.status==="verified")')&&sellerPage.includes("getVerifiedOffers"),"Seller profiles must use verified static/persistent seller gating and hide unverified offers");
need(read("lib/persistentSellers.ts").includes('where:{type:"dealer",status:"verified"}')&&read("lib/persistentSellers.ts").includes("profile.city&&profile.addressLabel&&profile.sourceUrl&&profile.lastChecked"),"Persistent dealer profiles must require verified status plus publishable business/source fields");
const dealersPage=read("app/dealers/page.tsx");
need(dealersPage.includes("index: true")&&dealersPage.includes("DealerFinder")&&dealersPage.includes("officialDealerLocators"),"Dealer root must be indexable only when it provides checked search and official locator utility");
need(sellers.includes("sourceUrl")&&sellers.includes("lastChecked")&&sellers.includes("Yamaha Motor Philippines dealer locator"),"Public dealer records must carry current official-source verification details");
need(["Honda","Yamaha","Suzuki","Kawasaki"].every(brand=>sellers.includes(`brands:["${brand}"]`))&&sellers.includes('city:"San Fernando"'),"San Fernando coverage must retain checked Honda, Yamaha, Suzuki and Kawasaki records");
need(["Angeles City","Cebu City","Davao City"].every(city=>(sellers.match(new RegExp(`city:"${city}"[^\\n]+isDemo:false[^\\n]+status:"verified"`,"g"))||[]).length>=3),"Angeles, Cebu and Davao must each retain at least three real verified dealers for public city pages");
need(fs.existsSync(path.join(root,"components/DealerFinder.tsx"))&&read("components/DealerFinder.tsx").includes("Search dealers"),"Dealer directory must provide working search and filters");
need(fs.existsSync(path.join(root,"lib/dealerLocators.ts"))&&read("lib/dealerLocators.ts").includes("hondaph.com/dealer-locator")&&read("lib/dealerLocators.ts").includes("motorcycles-dealer")&&read("lib/dealerLocators.ts").includes("kawasaki.ph/dealers/motorcycle"),"Dealer root must link current official manufacturer locators");
const continuity=read("components/HeaderContinuity.tsx");
need(continuity.includes('pathname.startsWith("/dealers")')&&continuity.includes('pathname.startsWith("/sellers/")'),"Dealer and seller routes must retain the More navigation active state");
const sitemapSource=read("lib/sitemaps.ts");
need(sitemapSource.includes("publicSellers()")&&sitemapSource.includes("publicDealerCities()")&&sitemapSource.includes("MIN_PUBLIC_DEALERS_PER_CITY"),"Commerce sitemap must use the same public seller and dealer-city rules as routes");
need(sitemapSource.includes('["/dealers",.82]'),"Indexed dealer root must be present in the core sitemap");
const robotsSource=read("app/robots.ts");
need(robotsSource.includes("commerceSitemapEntries().length")&&robotsSource.includes("/sitemaps/commerce.xml"),"Robots must advertise commerce sitemap only when it has verified public URLs");
const smoke=read("scripts/smoke-production.mjs");
need(["/dealers","/dealers/san-fernando","/dealers/angeles-city","/dealers/cebu-city","/dealers/davao-city"].every(route=>smoke.includes(`"${route}"`))&&smoke.includes('"/sellers/demo-yamaha-dealer-a"')&&smoke.includes("populated commerce sitemap"),"Production smoke test must cover published dealer cities, hidden demo routes and populated commerce URLs");
need(fs.existsSync(path.join(root,"app/dealer-directory.css"))&&dealersPage.includes("dealer-checklist")&&read("app/dealer-directory.css").includes(".dealer-filter-bar")&&read("app/dealer-directory.css").includes("@media(max-width:650px)"),"Dealer directory must retain finder and mobile checklist styling");

const checkLaunch=read("scripts/check-launch.mjs");
need(checkLaunch.includes("findSiblingDynamicRouteConflicts"),"Launch gate must include sibling dynamic route conflict guard");
need(fs.existsSync(path.join(root,"scripts/route-conflict-guard.mjs"))&&fs.existsSync(path.join(root,"scripts/test-route-conflict-guard.mjs")),"Route conflict guard and negative test must be present");
need(read("scripts/validate-v09.mjs").includes("split(path.sep).join")&&read("scripts/validate-v13.mjs").includes("split(path.sep).join"),"Windows-sensitive validator walkers must normalize path separators");

for(const file of ["AFFILIATE_SETUP.md","SHOPEE_AFFILIATE_SETUP.md"]){const source=read(file);need(/build[- ]time/i.test(source)&&/redeploy/i.test(source),`${file} must document build-time affiliate configuration and redeploy requirement`)}

if(errors.length){console.error("Post-audit validation failed:\n- "+errors.join("\n- "));process.exit(1)}
console.log("Post-audit validation passed: navigation, comparisons, product media, dealer publication rules, responsive fixes and route/tooling guards are present.");

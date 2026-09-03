import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(root,p));

function luminance(hex){
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4));
  return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}

const layout=read("app/layout.tsx");
if(!layout.includes('from "next/font/google"')||!layout.includes('Inter({')||!layout.includes('variable: "--font-inter"'))errors.push("Inter is not loaded through next/font/google");
if(!layout.includes('className={inter.variable}'))errors.push("Inter font variable is not attached to the root html element");

const css=read("app/globals.css");
for(const token of ['--accent:#c13b19','--accent-bright:#f0542d','--muted:#5f6972','font-family:var(--font-inter)'])if(!css.includes(token))errors.push(`missing UI token/fix: ${token}`);
if(contrast("#c13b19","#fbfbf8")<4.5||contrast("#c13b19","#f5f4ef")<4.5||contrast("#c13b19","#f0f2ef")<4.5)errors.push("accent text token does not meet AA contrast on light surfaces");
if(contrast("#5f6972","#f0f2ef")<4.5)errors.push("muted text token does not meet AA contrast on soft surface");
if(contrast("#f0542d","#101317")<4.5)errors.push("bright accent does not meet AA contrast on dark surface");
if(!css.includes('.mobile-search{display:none}')||!css.includes('.mobile-search{display:inline-flex'))errors.push("mobile search affordance CSS missing");
if(!css.includes('.homepage-hero .hero-grid{min-height:auto;padding:22px 0 28px'))errors.push("mobile hero height override missing");
if(!css.includes('.mobile-hero-bike{display:grid'))errors.push("mobile above-the-fold motorcycle preview missing");
if(!css.includes('min-height:44px'))errors.push("44px tap-target baseline missing");

const header=read("components/Header.tsx"), footer=read("components/Footer.tsx");
if(!header.includes('className="mobile-search"')||!header.includes('href="/search"'))errors.push("header does not keep Search visible on mobile");
for(const [name,src] of [["header",header],["footer",footer]]){
  const imgs=[...src.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
  for(const img of imgs)if(!/alt="[^"]+"/.test(img))errors.push(`${name} contains an image without descriptive alt text`);
}

const home=read("app/page.tsx");
if(!home.includes('className="mobile-hero-bike"')||!home.includes('EntityMedia entityType="motorcycle"'))errors.push("homepage does not render a real motorcycle in the compact mobile hero");

const priceRoute=read("app/motorcycles/[make]/[slug]/price/page.tsx");
const price=priceRoute.includes("permanentRedirect")&&exists("components/MotorcycleEntityPage.tsx")?read("components/MotorcycleEntityPage.tsx"):priceRoute;
for(const token of ['"@type": "Product"','AggregateOffer','"@type": "Offer"','priceCurrency: "PHP"','getRenderableMedia("motorcycle", model.id)','<JsonLd data={schema} />'])if(!price.includes(token))errors.push(`canonical price/product schema fix missing: ${token}`);
if(price.includes('availability: "https://schema.org/InStock"')||price.includes('availability:"https://schema.org/InStock"'))errors.push("price schema must not invent stock availability");

if(!exists("components/FaqSection.tsx"))errors.push("FAQ component missing");
else {
  const faq=read("components/FaqSection.tsx");
  for(const token of ['"@type": "FAQPage"','"@type": "Question"','"@type": "Answer"','<details'])if(!faq.includes(token))errors.push(`FAQ implementation missing ${token}`);
}
for(const file of ["app/tools/lto-registration-fee-calculator/page.tsx","app/tools/motorcycle-insurance-calculator/page.tsx","app/ownership/maintenance/page.tsx","app/ownership/[slug]/page.tsx"]){
  if(!read(file).includes("FaqSection"))errors.push(`${file} missing visible FAQ section`);
}

const robots=read("app/robots.ts");
for(const sm of ["/sitemap.xml","/sitemaps/motorcycles.xml","/sitemaps/gear.xml"])if(!robots.includes(sm))errors.push(`robots missing ${sm}`);
if(robots.includes("/sitemaps/commerce.xml"))errors.push("robots still advertises empty commerce sitemap");

const og=path.join(root,"public/brand/motoindex-og.png");
if(!fs.existsSync(og))errors.push("social OG image missing");
else if(fs.statSync(og).size>=100*1024)errors.push(`social OG image is ${Math.round(fs.statSync(og).size/1024)}KB; must remain under 100KB`);

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`v2.1.2 validation passed: Inter loaded, contrast ratios AA-safe, mobile Search/hero/tap targets patched, price Product+Offer schema present, visible FAQ markup wired, empty commerce sitemap removed from robots, OG image ${Math.round(fs.statSync(og).size/1024)}KB.`);

import { accessoryCategories, comparisons, helmetBrands, motorcycles, recommendationGuides, isIndexableModel, isIndexableComparison, isIndexableRecommendation } from "@/lib/data";
import { modelFamilies } from "@/lib/families";
import { helmetProducts, tireProducts, topBoxProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { sellers, dealerCities, citySlug } from "@/lib/sellers";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";
import { ownershipGuides } from "@/lib/ownershipGuides";
import { commuteGuides, isIndexableCommuteGuide } from "@/lib/commute";
import { tireFamilyHubs } from "@/lib/tireSeo";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";
import { editorialGuides } from "@/lib/editorialGuides";
import { helmetSeoCollections, isIndexableHelmetSeoCollection } from "@/lib/helmetSeoCollections";

type Entry = { url: string; lastModified: string; changeFrequency?: "daily"|"weekly"|"monthly"|"yearly"; priority?: number };
const iso = (value?: string) => value || RELEASE_DATE;
const newest = (dates: string[]) => dates.sort().at(-1) || RELEASE_DATE;

export function coreSitemapEntries(): Entry[] {
  const hasModels=motorcycles.some(isIndexableModel);
  const hasComparisons=comparisons.some(c=>isIndexableComparison(c.slug));
  const hasGuides=recommendationGuides.some(g=>isIndexableRecommendation(g.slug));
  const staticPaths = [
    ["/",1],
    ...(hasModels ? [["/motorcycles",.9] as const,["/finder",.84] as const,["/fitment",.78] as const] : []),
    ...(hasComparisons ? [["/compare",.82] as const] : []),
    ...(hasGuides ? [["/recommendations",.8] as const] : []),
    ["/gear/helmets",.85],["/accessories",.72],["/guides",.74],["/tires",.75],["/maintenance",.78],["/used-motorcycles/repo",.82],["/used-motorcycles/buying-checklist",.74],["/tools",.84],["/tools/motorcycle-loan-calculator",.88],["/tools/lto-registration-fee-calculator",.8],["/tools/motorcycle-insurance-calculator",.8],["/ownership",.72],["/ownership/cost-calculator",.7],["/ownership/maintenance",.69],["/ownership/safety-campaigns",.66],["/commute",.86],["/commute/cost-calculator",.82],["/commute/affordability",.8],["/commute/rainy-season",.72],
    ["/about",.45],["/methodology",.52],["/data-sources",.5],["/editorial-policy",.42],["/privacy",.4],
    ...(process.env.NEXT_PUBLIC_CONTACT_EMAIL ? [["/contact",.35] as const] : [])
  ] as const;
  const guides = recommendationGuides.filter(g=>isIndexableRecommendation(g.slug)).map(g=>({url:`${SITE_URL}/recommendations/${g.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.72}));
  const ownership = ownershipGuides.map(g=>({url:`${SITE_URL}/ownership/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"yearly" as const,priority:.64}));
  const editorial = editorialGuides.map(g=>({url:`${SITE_URL}/guides/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"monthly" as const,priority:.72}));
  const commute = commuteGuides.filter(g=>isIndexableCommuteGuide(g.slug)).map(g=>({url:`${SITE_URL}/commute/${g.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76}));
  const maintenanceTopics = maintenanceSeoTopics.map(topic=>({url:`${SITE_URL}/maintenance/${topic.slug}`,lastModified:topic.lastChecked,changeFrequency:"monthly" as const,priority: topic.volume >= 1000 ? .76 : .7}));
  const comps = comparisons.filter(c=>isIndexableComparison(c.slug)).map(c=>{const ms=motorcycles.filter(m=>m.id===c.a||m.id===c.b);return {url:`${SITE_URL}/compare/${c.slug}`,lastModified:newest(ms.map(m=>m.verifiedAt)),changeFrequency:"monthly" as const,priority:.74};});
  return [...staticPaths.map(([path,priority])=>({url:`${SITE_URL}${path==="/"?"":path}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority})),...guides,...editorial,...commute,...maintenanceTopics,...ownership,...comps];
}

export function motorcycleSitemapEntries(): Entry[] {
  const brands = [...new Set(motorcycles.map(m=>m.makeSlug))].flatMap(make=>{
    const list=motorcycles.filter(m=>m.makeSlug===make&&isIndexableModel(m));
    return list.length?[{url:`${SITE_URL}/motorcycles/${make}`,lastModified:newest(list.map(m=>m.verifiedAt)),changeFrequency:"weekly" as const,priority:.82}]:[];
  });
  const scooterHubs = ["honda","yamaha","suzuki"].flatMap(make=>{
    const list=motorcycles.filter(m=>m.makeSlug===make&&/scooter/i.test(m.category)&&m.marketStatus!=="previous"&&m.marketStatus!=="uncertain"&&m.marketStatus!=="discontinued"&&isIndexableModel(m));
    return list.length>=3?[{url:`${SITE_URL}/motorcycles/${make}/scooters`,lastModified:newest(list.map(m=>m.marketPriceCheckedAt||m.verifiedAt)),changeFrequency:"weekly" as const,priority:.86}]:[];
  });
  const families = modelFamilies.flatMap(f=>{
    const list=motorcycles.filter(m=>f.generationIds.includes(m.id));
    return list.some(isIndexableModel)?[{url:`${SITE_URL}/motorcycles/${f.makeSlug}/${f.slug}`,lastModified:newest(list.map(m=>m.verifiedAt)),changeFrequency:"monthly" as const,priority:.84}]:[];
  });
  // v2.6: each motorcycle has one canonical entity URL. Price, installment, tire-size,
  // fitment, fuel, maintenance, safety and ownership intent live as anchored sections
  // on that page instead of separate sitemap URLs competing with the parent entity.
  const models = motorcycles.filter(isIndexableModel).map(m=>({
    url:`${SITE_URL}/motorcycles/${m.makeSlug}/${m.slug}`,
    lastModified:iso(m.marketPriceCheckedAt || m.verifiedAt),
    changeFrequency:m.marketStatus==="previous"||m.marketStatus==="uncertain"?"monthly" as const:"weekly" as const,
    priority:m.marketStatus==="previous"?.82:m.marketStatus==="uncertain"?.78:.92
  }));
  return [...brands,...scooterHubs,...families,...models];
}

export function gearSitemapEntries(): Entry[] {
  const categories=["/gear/helmets/finder","/gear/helmets/full-face","/gear/helmets/half-face","/gear/helmets/modular","/gear/helmets/brands"].map(path=>({url:`${SITE_URL}${path}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76}));
  const helmetCollections=helmetSeoCollections.filter(c=>isIndexableHelmetSeoCollection(c.slug)).map(c=>({url:`${SITE_URL}/gear/helmets/${c.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.78}));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug)).map(h=>{const p=helmetProducts.filter(x=>x.brandSlug===h.slug&&x.status==="verified");return {url:`${SITE_URL}/gear/helmets/${h.slug}`,lastModified:newest(p.map(x=>x.lastChecked||RELEASE_DATE)),changeFrequency:"monthly" as const,priority:.78};});
  const products=helmetProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/gear/helmets/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.74}));
  const tires=tireProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/tires/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.68}));
  const tireSeoHubs=[...tireFamilyHubs.map(h=>({url:`${SITE_URL}/tires/${h.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76})),{url:`${SITE_URL}/tires/motorcycle-tire-size-chart`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.74}];
  const boxes=topBoxProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/accessories/top-box/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.66}));
  const accessoryHubs=accessoryCategories.map(a=>({url:`${SITE_URL}/accessories/${a.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76}));
  return [...categories,...helmetCollections,...brands,...products,...tires,...tireSeoHubs,...boxes,...accessoryHubs];
}

export function commerceSitemapEntries(): Entry[] {
  const sellerUrls=sellers.filter(s=>!s.isDemo&&s.status==="verified").map(s=>({url:`${SITE_URL}/sellers/${s.slug}`,lastModified:iso(s.lastChecked),changeFrequency:"weekly" as const,priority:.62}));
  const dealerUrls=dealerCities().filter(city=>sellers.filter(s=>s.type==="dealer"&&!s.isDemo&&s.status==="verified"&&s.city===city).length>=3).map(city=>({url:`${SITE_URL}/dealers/${citySlug(city)}`,lastModified:RELEASE_DATE,changeFrequency:"weekly" as const,priority:.62}));
  return [...sellerUrls,...dealerUrls];
}

export function sitemapXml(entries: Entry[]) {
  const body=entries.map(e=>`  <url><loc>${escapeXml(e.url)}</loc><lastmod>${e.lastModified}</lastmod>${e.changeFrequency?`<changefreq>${e.changeFrequency}</changefreq>`:""}${typeof e.priority==="number"?`<priority>${e.priority.toFixed(2)}</priority>`:""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
function escapeXml(value:string){return value.replace(/[<>&'\"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]!));}

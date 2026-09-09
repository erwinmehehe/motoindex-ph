import { accessoryCategories, comparisons, helmetBrands, motorcycles, isIndexableModel, isIndexableComparison } from "@/lib/data";
import { modelFamilies } from "@/lib/families";
import { helmetProducts, tireProducts, topBoxProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug, publicDealerCities, publicDealersByCity, publicSellers, publicSellersByType } from "@/lib/sellers";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";
import { ownershipGuides } from "@/lib/ownershipGuides";
import { editorialGuides } from "@/lib/editorialGuides";
import { electricMotorcycles } from "@/lib/electricMotorcycles";

type Entry = { url: string; lastModified: string; changeFrequency?: "daily"|"weekly"|"monthly"|"yearly"; priority?: number };
const iso = (value?: string) => value || RELEASE_DATE;
const newest = (dates: string[]) => dates.sort().at(-1) || RELEASE_DATE;

export function coreSitemapEntries(): Entry[] {
  const hasModels=motorcycles.some(isIndexableModel);
  const hasComparisons=comparisons.some(c=>isIndexableComparison(c.slug));
  const staticPaths = [
    ["/",1],
    ...(hasModels ? [["/motorcycles",.9] as const,["/finder",.84] as const,["/fitment",.78] as const] : []),
    ...(hasComparisons ? [["/compare",.82] as const] : []),
    ["/recommendations",.8],
    ["/dealers",.82],["/dealers/join",.58],["/gear/helmets",.85],["/accessories",.72],["/tools/electric-motorcycle-charging-cost",.82],["/tools/electric-motorcycle-range-calculator",.82],["/guides",.74],["/tires",.75],["/maintenance",.78],["/used-motorcycles/repo",.82],["/used-motorcycles/buying-checklist",.74],["/tools",.84],["/tools/motorcycle-loan-calculator",.88],["/tools/lto-registration-fee-calculator",.8],["/tools/motorcycle-insurance-calculator",.8],["/ownership",.72],["/ownership/cost-calculator",.7],["/commute",.86],["/commute/cost-calculator",.82],["/commute/affordability",.8],["/commute/rainy-season",.72],
    ["/about",.45],["/authors/erwin-valles",.5],["/methodology",.52],["/data-sources",.5],["/editorial-policy",.42],["/privacy",.4],
    ...(process.env.NEXT_PUBLIC_CONTACT_EMAIL ? [["/contact",.35] as const] : [])
  ] as const;
  const ownership = ownershipGuides.map(g=>({url:`${SITE_URL}/ownership/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"yearly" as const,priority:.64}));
  const editorial = editorialGuides.map(g=>({url:`${SITE_URL}/guides/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"monthly" as const,priority:.72}));
  const comps = comparisons.filter(c=>isIndexableComparison(c.slug)).map(c=>{const ms=motorcycles.filter(m=>m.id===c.a||m.id===c.b);return {url:`${SITE_URL}/compare/${c.slug}`,lastModified:newest(ms.map(m=>m.verifiedAt)),changeFrequency:"monthly" as const,priority:.74};});
  return [...staticPaths.map(([path,priority])=>({url:`${SITE_URL}${path==="/"?"":path}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority})),...editorial,...ownership,...comps];
}

export function motorcycleSitemapEntries(): Entry[] {
  const brands = [...new Set(motorcycles.map(m=>m.makeSlug))].flatMap(make=>{
    const list=motorcycles.filter(m=>m.makeSlug===make&&isIndexableModel(m));
    return list.length?[{url:`${SITE_URL}/motorcycles/${make}`,lastModified:newest(list.map(m=>m.verifiedAt)),changeFrequency:"weekly" as const,priority:.82}]:[];
  });
  const families = modelFamilies.flatMap(f=>{
    const list=motorcycles.filter(m=>f.generationIds.includes(m.id));
    return list.some(isIndexableModel)?[{url:`${SITE_URL}/motorcycles/${f.makeSlug}/${f.slug}`,lastModified:newest(list.map(m=>m.verifiedAt)),changeFrequency:"monthly" as const,priority:.84}]:[];
  });
  // Model-level price, specs, colors, installment, fitment, fuel, gear, maintenance and ownership stay on one canonical motorcycle page.
  const indexableModels = motorcycles.filter(isIndexableModel);
  const models = indexableModels.map(m=>({
    url:`${SITE_URL}/motorcycles/${m.makeSlug}/${m.slug}`,
    lastModified:iso(m.marketPriceCheckedAt || m.verifiedAt),
    changeFrequency:m.marketStatus==="previous"||m.marketStatus==="uncertain"?"monthly" as const:"weekly" as const,
    priority:m.marketStatus==="previous"?.82:m.marketStatus==="uncertain"?.78:.92
  }));
  const electricPages=[{url:`${SITE_URL}/motorcycles/electric`,lastModified:"2026-09-09",changeFrequency:"weekly" as const,priority:.9},...electricMotorcycles.map(m=>({url:`${SITE_URL}/motorcycles/electric/${m.slug}`,lastModified:m.checkedAt,changeFrequency:"weekly" as const,priority:.88}))];
  return [...brands,...families,...models,...electricPages];
}

export function gearSitemapEntries(): Entry[] {
  const categories=["/gear/helmets/finder","/gear/helmets/compare"].map(path=>({url:`${SITE_URL}${path}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76}));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug)).map(h=>{const p=helmetProducts.filter(x=>x.brandSlug===h.slug&&x.status==="verified");return {url:`${SITE_URL}/gear/helmets/${h.slug}`,lastModified:newest(p.map(x=>x.lastChecked||RELEASE_DATE)),changeFrequency:"monthly" as const,priority:.78};});
  const products=helmetProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/gear/helmets/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.74}));
  const tires=tireProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/tires/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.68}));
  const boxes=topBoxProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/accessories/top-box/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.66}));
  const accessoryHubs=accessoryCategories.filter(a=>a.slug==="top-box").map(a=>({url:`${SITE_URL}/accessories/${a.slug}`,lastModified:RELEASE_DATE,changeFrequency:"monthly" as const,priority:.76}));
  return [...categories,...brands,...products,...tires,...boxes,...accessoryHubs];
}

export function commerceSitemapEntries(): Entry[] {
  const sellerUrls=publicSellers().map(s=>({url:`${SITE_URL}/sellers/${s.slug}`,lastModified:iso(s.lastChecked),changeFrequency:"weekly" as const,priority:.62}));
  const dealerUrls=publicDealerCities()
    .filter(city=>publicDealersByCity(citySlug(city)).length>=MIN_PUBLIC_DEALERS_PER_CITY)
    .map(city=>({url:`${SITE_URL}/dealers/${citySlug(city)}`,lastModified:RELEASE_DATE,changeFrequency:"weekly" as const,priority:.62}));
  const pampangaDealers=publicSellersByType("dealer").filter(s=>s.province==="Pampanga");
  const provinceUrls=pampangaDealers.length>=5
    ? [{url:`${SITE_URL}/dealers/pampanga`,lastModified:newest(pampangaDealers.map(s=>s.lastChecked||RELEASE_DATE)),changeFrequency:"weekly" as const,priority:.66}]
    : [];
  return [...sellerUrls,...dealerUrls,...provinceUrls];
}

export function sitemapXml(entries: Entry[]) {
  const body=entries.map(e=>`  <url><loc>${escapeXml(e.url)}</loc><lastmod>${e.lastModified}</lastmod>${e.changeFrequency?`<changefreq>${e.changeFrequency}</changefreq>`:""}${typeof e.priority==="number"?`<priority>${e.priority.toFixed(2)}</priority>`:""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
function escapeXml(value:string){return value.replace(/[<>&'\"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]!));}

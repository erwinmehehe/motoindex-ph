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
const newest = (dates: string[]) => [...dates].sort().at(-1) || RELEASE_DATE;
const modelCheckedAt = (model: (typeof motorcycles)[number]) => model.marketPriceCheckedAt || model.verifiedAt;

export function coreSitemapEntries(): Entry[] {
  const indexableModels = motorcycles.filter(isIndexableModel);
  const hasModels=indexableModels.length > 0;
  const hasComparisons=comparisons.some(c=>isIndexableComparison(c.slug));
  const verifiedHelmets=helmetProducts.filter(p=>p.status==="verified");
  const verifiedTires=tireProducts.filter(p=>p.status==="verified");
  const verifiedBoxes=topBoxProducts.filter(p=>p.status==="verified");
  const publicSellerRows=publicSellers();

  const latestModelDate=newest(indexableModels.map(modelCheckedAt));
  const latestHelmetDate=newest(verifiedHelmets.map(p=>iso(p.lastChecked)));
  const latestTireDate=newest(verifiedTires.map(p=>iso(p.lastChecked)));
  const latestAccessoryDate=newest([...verifiedHelmets,...verifiedTires,...verifiedBoxes].map(p=>iso(p.lastChecked)));
  const latestEditorialDate=newest(editorialGuides.map(g=>g.lastChecked));
  const latestOwnershipDate=newest(ownershipGuides.map(g=>g.lastChecked));
  const latestElectricDate=newest(electricMotorcycles.map(m=>m.checkedAt));
  const latestSellerDate=newest(publicSellerRows.map(s=>iso(s.lastChecked)));
  const latestHomeDate=newest([latestModelDate,latestAccessoryDate,latestEditorialDate]);

  // Only canonical indexable destinations belong here. Redirect aliases such as
  // /motorcycles/{make}/scooters and consolidated model subroutes stay out.
  const staticPaths: {path:string;priority:number;lastModified:string}[] = [
    {path:"/",priority:1,lastModified:latestHomeDate},
    ...(hasModels ? [
      {path:"/motorcycles",priority:.9,lastModified:latestModelDate},
      {path:"/finder",priority:.84,lastModified:latestModelDate},
      {path:"/fitment",priority:.78,lastModified:latestModelDate},
    ] : []),
    ...(hasComparisons ? [{path:"/compare",priority:.82,lastModified:latestModelDate}] : []),
    {path:"/recommendations",priority:.8,lastModified:latestModelDate},
    {path:"/dealers",priority:.82,lastModified:latestSellerDate},
    {path:"/dealers/join",priority:.58,lastModified:RELEASE_DATE},
    {path:"/gear/helmets",priority:.85,lastModified:latestHelmetDate},
    {path:"/accessories",priority:.72,lastModified:latestAccessoryDate},
    {path:"/tools/electric-motorcycle-charging-cost",priority:.82,lastModified:latestElectricDate},
    {path:"/tools/electric-motorcycle-range-calculator",priority:.82,lastModified:latestElectricDate},
    {path:"/guides",priority:.74,lastModified:latestEditorialDate},
    {path:"/tires",priority:.75,lastModified:latestTireDate},
    {path:"/maintenance",priority:.78,lastModified:latestModelDate},
    {path:"/used-motorcycles/repo",priority:.82,lastModified:latestModelDate},
    {path:"/used-motorcycles/buying-checklist",priority:.74,lastModified:RELEASE_DATE},
    {path:"/tools",priority:.84,lastModified:RELEASE_DATE},
    {path:"/tools/motorcycle-loan-calculator",priority:.88,lastModified:RELEASE_DATE},
    {path:"/tools/lto-registration-fee-calculator",priority:.8,lastModified:RELEASE_DATE},
    {path:"/tools/motorcycle-insurance-calculator",priority:.8,lastModified:RELEASE_DATE},
    {path:"/ownership",priority:.72,lastModified:latestOwnershipDate},
    {path:"/ownership/cost-calculator",priority:.7,lastModified:latestOwnershipDate},
    {path:"/commute",priority:.86,lastModified:RELEASE_DATE},
    {path:"/commute/cost-calculator",priority:.82,lastModified:RELEASE_DATE},
    {path:"/commute/affordability",priority:.8,lastModified:RELEASE_DATE},
    {path:"/commute/rainy-season",priority:.72,lastModified:RELEASE_DATE},
    {path:"/about",priority:.45,lastModified:RELEASE_DATE},
    {path:"/authors/erwin-valles",priority:.5,lastModified:RELEASE_DATE},
    {path:"/methodology",priority:.52,lastModified:RELEASE_DATE},
    {path:"/data-sources",priority:.5,lastModified:RELEASE_DATE},
    {path:"/editorial-policy",priority:.42,lastModified:RELEASE_DATE},
    {path:"/privacy",priority:.4,lastModified:RELEASE_DATE},
    ...(process.env.NEXT_PUBLIC_CONTACT_EMAIL ? [{path:"/contact",priority:.35,lastModified:RELEASE_DATE}] : [])
  ];
  const ownership = ownershipGuides.map(g=>({url:`${SITE_URL}/ownership/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"yearly" as const,priority:.64}));
  const editorial = editorialGuides.map(g=>({url:`${SITE_URL}/guides/${g.slug}`,lastModified:g.lastChecked,changeFrequency:"monthly" as const,priority:.72}));
  const comps = comparisons.filter(c=>isIndexableComparison(c.slug)).map(c=>{const ms=motorcycles.filter(m=>m.id===c.a||m.id===c.b);return {url:`${SITE_URL}/compare/${c.slug}`,lastModified:newest(ms.map(modelCheckedAt)),changeFrequency:"monthly" as const,priority:.74};});
  return [...staticPaths.map(({path,priority,lastModified})=>({url:`${SITE_URL}${path==="/"?"":path}`,lastModified,changeFrequency:"monthly" as const,priority})),...editorial,...ownership,...comps];
}

export function motorcycleSitemapEntries(): Entry[] {
  const brands = [...new Set(motorcycles.map(m=>m.makeSlug))].flatMap(make=>{
    const list=motorcycles.filter(m=>m.makeSlug===make&&isIndexableModel(m));
    return list.length?[{url:`${SITE_URL}/motorcycles/${make}`,lastModified:newest(list.map(modelCheckedAt)),changeFrequency:"weekly" as const,priority:.82}]:[];
  });
  const families = modelFamilies.flatMap(f=>{
    const list=motorcycles.filter(m=>f.generationIds.includes(m.id));
    return list.some(isIndexableModel)?[{url:`${SITE_URL}/motorcycles/${f.makeSlug}/${f.slug}`,lastModified:newest(list.map(modelCheckedAt)),changeFrequency:"monthly" as const,priority:.84}]:[];
  });
  // Model-level price, specs, colors, installment, fitment, fuel, gear, maintenance and ownership stay on one canonical motorcycle page.
  const indexableModels = motorcycles.filter(isIndexableModel);
  const models = indexableModels.map(m=>({
    url:`${SITE_URL}/motorcycles/${m.makeSlug}/${m.slug}`,
    lastModified:iso(modelCheckedAt(m)),
    changeFrequency:m.marketStatus==="previous"||m.marketStatus==="uncertain"?"monthly" as const:"weekly" as const,
    priority:m.marketStatus==="previous"?.82:m.marketStatus==="uncertain"?.78:.92
  }));
  // Electric models are consolidated into one authoritative buying guide rather than separate thin URLs.
  const electricPages=[{url:`${SITE_URL}/motorcycles/electric`,lastModified:newest(electricMotorcycles.map(m=>m.checkedAt)),changeFrequency:"weekly" as const,priority:.9}];
  return [...brands,...families,...models,...electricPages];
}

export function gearSitemapEntries(): Entry[] {
  const verifiedHelmets=helmetProducts.filter(p=>p.status==="verified");
  const categories=["/gear/helmets/finder","/gear/helmets/compare"].map(path=>({url:`${SITE_URL}${path}`,lastModified:newest(verifiedHelmets.map(p=>iso(p.lastChecked))),changeFrequency:"monthly" as const,priority:.76}));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug)).map(h=>{const p=helmetProducts.filter(x=>x.brandSlug===h.slug&&x.status==="verified");return {url:`${SITE_URL}/gear/helmets/${h.slug}`,lastModified:newest(p.map(x=>iso(x.lastChecked))),changeFrequency:"monthly" as const,priority:.78};});
  const products=verifiedHelmets.map(p=>({url:`${SITE_URL}/gear/helmets/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.74}));
  const tires=tireProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/tires/${p.brandSlug}/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.68}));
  const boxes=topBoxProducts.filter(p=>p.status==="verified").map(p=>({url:`${SITE_URL}/accessories/top-box/${p.slug}`,lastModified:iso(p.lastChecked),changeFrequency:"monthly" as const,priority:.66}));
  const accessoryHubs=accessoryCategories.filter(a=>a.slug==="top-box").map(a=>({url:`${SITE_URL}/accessories/${a.slug}`,lastModified:newest(boxes.map(x=>x.lastModified)),changeFrequency:"monthly" as const,priority:.76}));
  return [...categories,...brands,...products,...tires,...boxes,...accessoryHubs];
}

export function commerceSitemapEntries(): Entry[] {
  const sellerUrls=publicSellers().map(s=>({url:`${SITE_URL}/sellers/${s.slug}`,lastModified:iso(s.lastChecked),changeFrequency:"weekly" as const,priority:.62}));
  const dealerUrls=publicDealerCities()
    .filter(city=>publicDealersByCity(citySlug(city)).length>=MIN_PUBLIC_DEALERS_PER_CITY)
    .map(city=>({url:`${SITE_URL}/dealers/${citySlug(city)}`,lastModified:newest(publicDealersByCity(citySlug(city)).map(s=>iso(s.lastChecked))),changeFrequency:"weekly" as const,priority:.62}));
  const pampangaDealers=publicSellersByType("dealer").filter(s=>s.province==="Pampanga");
  const provinceUrls=pampangaDealers.length>=5
    ? [{url:`${SITE_URL}/dealers/pampanga`,lastModified:newest(pampangaDealers.map(s=>iso(s.lastChecked))),changeFrequency:"weekly" as const,priority:.66}]
    : [];
  return [...sellerUrls,...dealerUrls,...provinceUrls];
}

export function sitemapXml(entries: Entry[]) {
  const body=entries.map(e=>`  <url><loc>${escapeXml(e.url)}</loc><lastmod>${e.lastModified}</lastmod>${e.changeFrequency?`<changefreq>${e.changeFrequency}</changefreq>`:""}${typeof e.priority==="number"?`<priority>${e.priority.toFixed(2)}</priority>`:""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
function escapeXml(value:string){return value.replace(/[<>&'\"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]!));}

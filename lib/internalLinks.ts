import { comparisons, motorcycles, isIndexableModel, isIndexableComparison } from "@/lib/data";
import { helmetProducts, getHelmetCategoryProducts, getTireSizeMatches, type HelmetCategorySlug } from "@/lib/catalog";
import type { HelmetProduct, Motorcycle, TireProduct, TopBoxProduct } from "@/lib/types";
import { getTopBoxFitmentsForProduct } from "@/lib/topBoxFitment";
import { observedMarketRange } from "@/lib/marketChecks";
import type { RelatedLink } from "@/components/RelatedLinks";

export function modelInternalLinks(model: Motorcycle): RelatedLink[] {
  const base = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const links: RelatedLink[] = [
    { href: `/motorcycles/${model.makeSlug}`, title: `${model.make} motorcycles`, eyebrow: "Brand", description: `Browse ${model.make} models and price references.` },
    { href: `${base}#specs`, title: `${model.model} specifications`, eyebrow: "Specs", description: `${model.engineCc} cc · ${model.powerHp} hp · ${model.seatHeightMm} mm seat · ${model.curbWeightKg} kg.` },
    ...(model.colors.length ? [{ href: `${base}#colors`, title: `${model.model} colors`, eyebrow: "Colors", description: `${model.colors.length} recorded color ${model.colors.length === 1 ? "option" : "options"} with source context.` }] : []),
    ...(/scooter/i.test(model.category) && ["honda","yamaha","suzuki"].includes(model.makeSlug) ? [{ href: `/motorcycles/${model.makeSlug}#scooters`, title: `${model.make} scooters`, eyebrow: "Scooter hub", description: `Compare ${model.make} scooter prices, engines, seat heights and weights.` }] : []),
    { href: `${base}#price`, title: `${model.model} price`, eyebrow: "Price", description: model.marketStatus === "previous" ? "Historical Philippine price context." : "Dated price sources, variants and market checks." },
    ...(model.marketStatus !== "previous" ? [{ href: `${base}#installment`, title: `${model.model} installment calculator`, eyebrow: "Financing", description: "Monthly payment planning on the canonical model page." }] : []),
    { href: `/tools/motorcycle-loan-calculator?price=${observedMarketRange(model).from}&model=${encodeURIComponent(`${model.make} ${model.model}`)}`, title: "Motorcycle loan calculator", eyebrow: "Calculator", description: `Open the standalone loan tool with ${model.model}'s price prefilled.` },
    { href: `${base}#tires-fitment`, title: `${model.model} tire size`, eyebrow: "Fitment", description: `${model.frontTire} front · ${model.rearTire} rear.` },
    { href: "/accessories", title: "Motorcycle accessories", eyebrow: "Gear", description: "Research top boxes, phone holders, intercoms and rain gear." },
    { href: `${base}#gear`, title: `${model.model} rider gear`, eyebrow: "Rider gear", description: "Helmet suggestions and model-specific tire or top-box fitment where available." },
    { href: `${base}#rider-fit`, title: `${model.model} rider fit`, eyebrow: "Fit", description: `${model.seatHeightMm} mm seat · ${model.curbWeightKg} kg curb weight.` },
    { href: `${base}#fuel`, title: `${model.model} fuel economy`, eyebrow: "Fuel", description: model.fuelConsumptionKmL ? `${model.fuelConsumptionKmL} km/L listed basis plus range planning.` : "Fuel-cost and range planning with a labeled estimate." },
    { href: `${base}#maintenance`, title: `${model.model} maintenance`, eyebrow: "Ownership", description: "Official service source and exact intervals where parsed." },
    { href: `${base}#safety`, title: `${model.model} safety campaigns`, eyebrow: "Safety", description: "Official recall/product-update/service-campaign resources." },
    { href: `${base}#used`, title: `Used ${model.model} value`, eyebrow: "Used", description: "Listing samples and depreciation planning on the same model page." },
    { href: `/commute/cost-calculator?bike=${model.id}`, title: `${model.model} commute cost`, eyebrow: "Commute", description: "Estimate daily fuel, maintenance reserve and parking for your route." }
  ];
  const comparisonLinks = comparisons.filter(c => (c.a === model.id || c.b === model.id) && isIndexableComparison(c.slug)).slice(0, 2).map(c => {
    const otherId = c.a === model.id ? c.b : c.a;
    const other = motorcycles.find(m => m.id === otherId)!;
    return { href: `/compare/${c.slug}`, title: `${model.model} vs ${other.model}`, eyebrow: "Compare", description: "Price, dimensions and specifications side by side." };
  });
  const alternatives = motorcycles.filter(m => m.id !== model.id && m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued" && m.category === model.category && isIndexableModel(m)).sort((a,b)=>Math.abs(a.srp-model.srp)-Math.abs(b.srp-model.srp)).slice(0,2).map(m=>({href:`/motorcycles/${m.makeSlug}/${m.slug}`,title:`${m.make} ${m.model}`,eyebrow:"Alternative",description:`${m.engineCc} cc · ${m.seatHeightMm} mm seat`}));
  return [...links, ...comparisonLinks, ...alternatives].slice(0, 16);
}

export function helmetProductInternalLinks(product: HelmetProduct): RelatedLink[] {
  const category: HelmetCategorySlug | undefined = product.helmetType === "Full face" ? "full-face" : product.helmetType === "Modular" ? "modular" : (product.helmetType === "Half face" || product.helmetType === "Open face") ? "half-face" : undefined;
  const categoryHref = category === "full-face" ? "/gear/helmets#full-face" : category === "modular" ? "/gear/helmets#modular" : category ? "/gear/helmets#open-face" : undefined;
  const comparisonLinks: RelatedLink[] = [
    ...(["kyt","ls2"].includes(product.brandSlug) ? [{ href:"/gear/helmets/compare/kyt-vs-ls2", title:"KYT vs LS2 helmets", eyebrow:"Brand comparison", description:"Compare verified KYT and LS2 model records." }] : []),
    ...(["evo","spyder"].includes(product.brandSlug) ? [{ href:"/gear/helmets/compare/evo-vs-spyder", title:"EVO vs Spyder helmets", eyebrow:"Brand comparison", description:"Compare verified EVO and Spyder model records." }] : []),
    ...(["Full face","Modular"].includes(product.helmetType) ? [{ href:"/gear/helmets/compare/full-face-vs-modular", title:"Full-face vs modular helmets", eyebrow:"Format comparison", description:"Compare coverage, convenience and equipment tradeoffs." }] : [])
  ];
  const isRoadHelmet = ["Full face", "Modular", "Half face", "Open face"].includes(product.helmetType);
  const hasEce2206 = /(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(product.certification || "");
  const sameBrand = helmetProducts.filter(p => p.status === "verified" && p.brandSlug === product.brandSlug && p.id !== product.id).slice(0, 2);
  return [
    { href: `/gear/helmets/${product.brandSlug}`, title: `${product.brand} helmets`, eyebrow: "Brand", description: `Compare the ${product.brand} models we have checked.` },
    ...(categoryHref ? [{ href: categoryHref, title: `${product.helmetType} helmets`, eyebrow: "Category", description: "Compare helmet models across brands." }] : []),
    ...(typeof product.priceFromPhp === "number" && product.priceFromPhp <= 3000 ? [{ href: "/gear/helmets#under-3000", title: "Helmets under ₱3,000", eyebrow: "Budget", description: "Compare verified helmets in the same entry-price range." }] : typeof product.priceFromPhp === "number" && product.priceFromPhp <= 5000 ? [{ href: "/gear/helmets#under-5000", title: "Helmets under ₱5,000", eyebrow: "Budget", description: "Compare verified helmets in the same budget range." }] : []),
    ...(hasEce2206 ? [{ href: "/gear/helmets#ece-22-06", title: "ECE 22.06 helmets", eyebrow: "Certification", description: "Compare models with explicit ECE 22.06 references." }] : []),
    ...(product.intercomReady ? [{ href: "/gear/helmets#intercom-ready", title: "Intercom-ready helmets", eyebrow: "Feature", description: "Compare models with recorded communication-system provision." }] : []),
    ...(isRoadHelmet ? [{ href: "/gear/helmets#commuting", title: "Helmets for commuting", eyebrow: "Use case", description: "Compare road-helmet formats for daily Philippine riding." }] : []),
    { href: "/guides/motorcycle-helmet-size-guide", title: "Helmet size guide", eyebrow: "Fit", description: "Measure your head and check model-specific fit." },
    { href: "/guides/motorcycle-helmet-certification-philippines", title: "Helmet certification guide", eyebrow: "Certification", description: "Understand PS, ICC and international certification references." },
    { href: "/gear/helmets/finder", title: "Helmet Finder", eyebrow: "Finder", description: "Filter verified helmets by budget, type, size and equipment." },
    { href: `/gear/helmets/compare?a=${encodeURIComponent(product.id)}`, title: "Compare this helmet", eyebrow: "Compare", description: "Put this helmet beside another verified model." },
    ...comparisonLinks,
    ...sameBrand.map(p => ({ href: `/gear/helmets/${p.brandSlug}/${p.slug}`, title: `${p.brand} ${p.model}`, eyebrow: "Same brand", description: `${p.helmetType}${p.priceFromPhp ? ` · observed from ₱${p.priceFromPhp.toLocaleString("en-PH")}` : ""}` }))
  ].slice(0, 14);
}

export function helmetBrandInternalLinks(brandSlug: string): RelatedLink[] {
  const products = helmetProducts.filter(p => p.status === "verified" && p.brandSlug === brandSlug);
  const types = [...new Set(products.map(p => p.helmetType))];
  const categoryLinks: RelatedLink[] = [];
  if (types.some(t => t === "Full face")) categoryLinks.push({href:"/gear/helmets#full-face",title:"Full-face helmets",eyebrow:"Category",description:"Compare full-face options across brands."});
  if (types.some(t => t === "Modular")) categoryLinks.push({href:"/gear/helmets#modular",title:"Modular helmets",eyebrow:"Category",description:"Compare flip-up helmets across brands."});
  if (types.some(t => t === "Half face" || t === "Open face")) categoryLinks.push({href:"/gear/helmets#open-face",title:"Half-face helmets",eyebrow:"Category",description:"Compare open-face and half-face options."});
  const hasBudgetModels = products.some(p => typeof p.priceFromPhp === "number" && p.priceFromPhp <= 5000);
  const seoCompare: RelatedLink[] = [
    ...(["kyt","ls2"].includes(brandSlug)?[{href:"/gear/helmets/compare/kyt-vs-ls2",title:"KYT vs LS2 helmets",eyebrow:"Brand comparison",description:"Compare verified KYT and LS2 records."}]:[]),
    ...(["evo","spyder"].includes(brandSlug)?[{href:"/gear/helmets/compare/evo-vs-spyder",title:"EVO vs Spyder helmets",eyebrow:"Brand comparison",description:"Compare verified EVO and Spyder records."}]:[])
  ];
  return [{href:"/gear/helmets/finder",title:"Helmet Finder",eyebrow:"Finder",description:"Filter verified helmets by budget, type, size and equipment."},{href:"/gear/helmets/compare",title:"Compare helmets",eyebrow:"Compare",description:"Compare two or three verified helmet models side by side."},...seoCompare,{href:"/guides/motorcycle-helmet-size-guide",title:"Helmet size guide",eyebrow:"Fit",description:"Measure your head and use the exact model chart."},{href:"/guides/motorcycle-helmet-certification-philippines",title:"Helmet certification guide",eyebrow:"Certification",description:"Understand PS, ICC and model-level certification references."}, ...(hasBudgetModels?[{href:"/gear/helmets#under-5000",title:"Helmets under ₱5,000",eyebrow:"Budget",description:"Compare checked models in the same price band."}]:[]), ...categoryLinks, ...products.slice(0,3).map(p=>({href:`/gear/helmets/${p.brandSlug}/${p.slug}`,title:`${p.brand} ${p.model}`,eyebrow:"Model",description:p.helmetType}))].slice(0,11);
}

export function helmetCategoryInternalLinks(slug: HelmetCategorySlug): RelatedLink[] {
  const products = getHelmetCategoryProducts(slug);
  const brands = [...new Set(products.map(p=>p.brandSlug))].slice(0,5);
  return [
    {href:"/gear/helmets",title:"Helmet guide",eyebrow:"Hub",description:"Browse brands, categories and checked models."},
    {href:"/gear/helmets/finder",title:"Helmet Finder",eyebrow:"Finder",description:"Filter by budget, use case, size and features."},
    {href:"/gear/helmets#under-5000",title:"Helmets under ₱5,000",eyebrow:"Budget",description:"Compare checked helmets by starting price."},
    {href:"/gear/helmets#commuting",title:"Helmets for commuting",eyebrow:"Use case",description:"Compare road-helmet tradeoffs for daily riding."},
    {href:"/guides/motorcycle-helmet-size-guide",title:"Helmet size guide",eyebrow:"Fit",description:"Measure your head and check model-specific sizing."},
    {href:"/guides/motorcycle-helmet-certification-philippines",title:"Helmet certification guide",eyebrow:"Certification",description:"Understand PS, ICC and certification references."},
    {href:"/gear/helmets/compare",title:"Compare helmets",eyebrow:"Compare",description:"Compare verified helmet models side by side."},
    ...brands.map(brand=>{const p=products.find(x=>x.brandSlug===brand)!;return {href:`/gear/helmets/${brand}`,title:`${p.brand} helmets`,eyebrow:"Brand",description:`See checked ${p.brand} models.`};})
  ].slice(0, 11);
}

export function tireProductInternalLinks(product: TireProduct): RelatedLink[] {
  const matches = getTireSizeMatches(product).filter(({motorcycle})=>isIndexableModel(motorcycle)).slice(0, 5);
  return [
    {href:"/tires",title:"Motorcycle tire finder",eyebrow:"Tires",description:"Browse stock sizes and tire families."},
    ...matches.map(({motorcycle})=>({href:`/motorcycles/${motorcycle.makeSlug}/${motorcycle.slug}#tires-fitment`,title:`${motorcycle.model} tire size`,eyebrow:"Size match",description:`${motorcycle.frontTire} front · ${motorcycle.rearTire} rear`}))
  ];
}

export function topBoxInternalLinks(product: TopBoxProduct): RelatedLink[] {
  const exact = getTopBoxFitmentsForProduct(product.id).map(fitment => motorcycles.find(m => m.id === fitment.modelId)).filter((m): m is Motorcycle => Boolean(m)).slice(0,5);
  return [
    {href:"/accessories/top-box",title:"Motorcycle top boxes",eyebrow:"Category",description:"Capacity, mounting and bracket research."},
    ...exact.map(m=>({href:`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`,title:`${m.model} fitment`,eyebrow:"Verified edge",description:`Open the stored rack and mounting context for ${m.model}.`}))
  ];
}

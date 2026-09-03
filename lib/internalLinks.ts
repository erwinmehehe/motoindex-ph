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
    { href: `${base}#price`, title: `${model.model} price`, eyebrow: "Price", description: model.marketStatus === "previous" ? "Historical Philippine price context." : "Dated price sources, variants and market checks." },
    ...(model.marketStatus !== "previous" ? [{ href: `${base}#installment`, title: `${model.model} installment calculator`, eyebrow: "Financing", description: "Monthly payment planning on the canonical model page." }] : []),
    { href: `/tools/motorcycle-loan-calculator?price=${observedMarketRange(model).from}&model=${encodeURIComponent(`${model.make} ${model.model}`)}`, title: "Motorcycle loan calculator", eyebrow: "Calculator", description: `Open the standalone loan tool with ${model.model}'s price prefilled.` },
    { href: `${base}#tires-fitment`, title: `${model.model} tire size`, eyebrow: "Fitment", description: `${model.frontTire} front · ${model.rearTire} rear.` },
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
  const alternatives = motorcycles.filter(m => m.id !== model.id && m.marketStatus !== "previous" && m.category === model.category && isIndexableModel(m)).sort((a,b)=>Math.abs(a.srp-model.srp)-Math.abs(b.srp-model.srp)).slice(0,2).map(m=>({href:`/motorcycles/${m.makeSlug}/${m.slug}`,title:`${m.make} ${m.model}`,eyebrow:"Alternative",description:`${m.engineCc} cc · ${m.seatHeightMm} mm seat`}));
  return [...links, ...comparisonLinks, ...alternatives].slice(0, 12);
}

export function helmetProductInternalLinks(product: HelmetProduct): RelatedLink[] {
  const category: HelmetCategorySlug | undefined = product.helmetType === "Full face" ? "full-face" : product.helmetType === "Modular" ? "modular" : (product.helmetType === "Half face" || product.helmetType === "Open face") ? "half-face" : undefined;
  const sameBrand = helmetProducts.filter(p => p.status === "verified" && p.brandSlug === product.brandSlug && p.id !== product.id).slice(0, 3);
  return [
    { href: `/gear/helmets/${product.brandSlug}`, title: `${product.brand} helmets`, eyebrow: "Brand", description: `Compare the ${product.brand} models we have checked.` },
    ...(category ? [{ href: `/gear/helmets/${category}`, title: `${product.helmetType} helmets`, eyebrow: "Category", description: "Compare helmet models across brands." }] : []),
    { href: "/gear/helmets/finder", title: "Helmet Finder", eyebrow: "Finder", description: "Filter verified helmets by budget, type, size and equipment." },
    { href: `/gear/helmets/compare?a=${encodeURIComponent(product.id)}`, title: "Compare this helmet", eyebrow: "Compare", description: "Put this helmet beside another verified model." },
    { href: "/gear/helmets/brands", title: "Compare helmet brands", eyebrow: "Brands", description: "See checked models, categories and observed price ranges." },
    ...sameBrand.map(p => ({ href: `/gear/helmets/${p.brandSlug}/${p.slug}`, title: `${p.brand} ${p.model}`, eyebrow: "Same brand", description: `${p.helmetType}${p.priceFromPhp ? ` · observed from ₱${p.priceFromPhp.toLocaleString("en-PH")}` : ""}` }))
  ];
}

export function helmetBrandInternalLinks(brandSlug: string): RelatedLink[] {
  const products = helmetProducts.filter(p => p.status === "verified" && p.brandSlug === brandSlug);
  const types = [...new Set(products.map(p => p.helmetType))];
  const categoryLinks: RelatedLink[] = [];
  if (types.some(t => t === "Full face")) categoryLinks.push({href:"/gear/helmets/full-face",title:"Full-face helmets",eyebrow:"Category",description:"Compare full-face options across brands."});
  if (types.some(t => t === "Modular")) categoryLinks.push({href:"/gear/helmets/modular",title:"Modular helmets",eyebrow:"Category",description:"Compare flip-up helmets across brands."});
  if (types.some(t => t === "Half face" || t === "Open face")) categoryLinks.push({href:"/gear/helmets/half-face",title:"Half-face helmets",eyebrow:"Category",description:"Compare open-face and half-face options."});
  return [{href:"/gear/helmets/finder",title:"Helmet Finder",eyebrow:"Finder",description:"Filter verified helmets by budget, type, size and equipment."},{href:"/gear/helmets/compare",title:"Compare helmets",eyebrow:"Compare",description:"Compare two or three verified helmet models side by side."},{href:"/gear/helmets/brands",title:"Helmet brands",eyebrow:"Compare",description:"Compare checked brands and price ranges."}, ...categoryLinks, ...products.slice(0,3).map(p=>({href:`/gear/helmets/${p.brandSlug}/${p.slug}`,title:`${p.brand} ${p.model}`,eyebrow:"Model",description:p.helmetType}))].slice(0,7);
}

export function helmetCategoryInternalLinks(slug: HelmetCategorySlug): RelatedLink[] {
  const products = getHelmetCategoryProducts(slug);
  const brands = [...new Set(products.map(p=>p.brandSlug))].slice(0,5);
  return [
    {href:"/gear/helmets",title:"Helmet guide",eyebrow:"Hub",description:"Browse brands, categories and checked models."},
    {href:"/gear/helmets/finder",title:"Helmet Finder",eyebrow:"Finder",description:"Filter by budget, use case, size and features."},
    {href:"/gear/helmets/compare",title:"Compare helmets",eyebrow:"Compare",description:"Compare verified helmet models side by side."},
    {href:"/gear/helmets/brands",title:"Helmet brands",eyebrow:"Compare",description:"Compare brand coverage and observed price ranges."},
    ...brands.map(brand=>{const p=products.find(x=>x.brandSlug===brand)!;return {href:`/gear/helmets/${brand}`,title:`${p.brand} helmets`,eyebrow:"Brand",description:`See checked ${p.brand} models.`};})
  ];
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

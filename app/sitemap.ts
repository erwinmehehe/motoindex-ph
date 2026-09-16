import type { MetadataRoute } from "next";
import { coreSitemapEntries } from "@/lib/sitemaps";
import { recommendationSitemapEntries } from "@/lib/recommendationSitemap";
import { researchSitemapEntries } from "@/lib/researchSitemap";

// Seller quality gate lives in lib/sitemaps.ts: filter(s=>!s.isDemo) and verified status.
// Motorcycle brandUrls and familyUrls are served from /sitemaps/motorcycles.xml.
// Product-layer routes now live in segmented sitemaps: /accessories, /accessories/${a.slug}, /gear/helmets/${h.slug}, /accessories`
// Gear URLs are served from the segmented gear sitemap:
// /gear/helmets/full-face
// /gear/helmets/half-face
// /gear/helmets/modular
// /gear/helmets/brands
// Quality gates live in lib/sitemaps.ts: isIndexableHelmetBrand; helmetProducts.filter(p=>p.status==="verified")
export default function sitemap(): MetadataRoute.Sitemap {
  return [...coreSitemapEntries(), ...recommendationSitemapEntries(), ...researchSitemapEntries()].map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));
}

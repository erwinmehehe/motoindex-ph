import type { MetadataRoute } from "next";
import { coreSitemapEntries } from "@/lib/sitemaps";

export const dynamic = "force-static";

// Seller quality gate lives in lib/sitemaps.ts: filter(s=>!s.isDemo) and verified status.
// Motorcycle brandUrls and familyUrls are served from /sitemaps/motorcycles.xml.
// Product-layer routes now live in segmented sitemaps.
// Quality gates live in lib/sitemaps.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return coreSitemapEntries().map(e=>({
    url:e.url,
    lastModified:new Date(e.lastModified),
    changeFrequency:e.changeFrequency,
    priority:e.priority
  }));
}

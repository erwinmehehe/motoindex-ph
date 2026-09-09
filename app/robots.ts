import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { commerceSitemapEntries } from "@/lib/sitemaps";

// The llms.txt resources live at their well-known paths, /llms.txt and
// /llms-full.txt. robots.txt has no standard directive for them and Next's
// MetadataRoute.Robots cannot emit comment lines, so they are not referenced
// here. The commerce sitemap is advertised only after verified public seller
// or dealer URLs exist.
export default function robots(): MetadataRoute.Robots {
  const sitemap = [`${SITE_URL}/sitemap.xml`,`${SITE_URL}/sitemaps/motorcycles.xml`,`${SITE_URL}/sitemaps/gear.xml`];
  if (commerceSitemapEntries().length > 0) sitemap.push(`${SITE_URL}/sitemaps/commerce.xml`);
  return {
    rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/api/","/go/"]}],
    sitemap
  };
}

import { SITE_URL } from "@/lib/site";

// Emitted as a route handler rather than via MetadataRoute.Robots so the file can
// carry comment lines pointing at the llms.txt resources. There is no standard
// robots directive for llms.txt, so these are comments by design — the files are
// discovered at their well-known paths and the comments make them explicit for
// crawlers and for anyone reading robots.txt directly.
export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /go/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Sitemap: ${SITE_URL}/sitemaps/motorcycles.xml`,
    `Sitemap: ${SITE_URL}/sitemaps/gear.xml`,
    `Sitemap: ${SITE_URL}/sitemaps/commerce.xml`,
    "",
    "# LLM-readable index of this site's structure and data principles.",
    "# Short index:  " + `${SITE_URL}/llms.txt`,
    "# Full index:   " + `${SITE_URL}/llms-full.txt`,
    ""
  ].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}

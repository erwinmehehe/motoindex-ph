import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "x-robots-tag": "noindex, follow",
    },
  });
}

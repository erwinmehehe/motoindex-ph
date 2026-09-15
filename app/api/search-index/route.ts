import { getSearchItems } from "@/lib/search";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return Response.json(getSearchItems(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

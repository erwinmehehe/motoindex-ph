import { researchPriceCsv } from "@/lib/researchData";

export const dynamic = "force-static";

export function GET() {
  return new Response(researchPriceCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="motoindex-ph-motorcycle-price-index.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}

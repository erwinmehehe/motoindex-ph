import { allCatalogProducts } from "@/lib/catalog";
import { sourcedRetailerProductListing, sourcedShopeeProductListing } from "@/lib/affiliateDestinations";
import { getAffiliateResearchCandidate } from "@/lib/affiliateResearch";

export const dynamic = "force-dynamic";

function csvCell(value: string): string {
  // Spreadsheet clients may evaluate values prefixed with formula operators.
  const safe = /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}

/**
 * Admin research export is deliberately not an affiliate activation import.
 * Includes unreviewed candidates AND still-unmatched catalog products.
 * Never exports an assumed tracking URL, stock level or commission result.
 */
export function GET() {
  const header = ["productId", "category", "brand", "model", "researchStatus", "candidateUrl", "researchDate", "nextAction"];
  const rows = allCatalogProducts()
    .filter((product) => !sourcedShopeeProductListing(product.id) && !sourcedRetailerProductListing(product.id))
    .map((product) => {
      const candidate = getAffiliateResearchCandidate(product.id);
      return [
        product.id,
        product.category,
        product.brand,
        product.model,
        candidate ? "candidate_pending_browser_qa" : "needs_exact_item_research",
        candidate?.sourceUrl || "",
        candidate?.researchedAt || "",
        candidate?.reviewNote || "Locate exact merchant item; document model/variant and manually test destination."
      ];
    });
  const csv = [header, ...rows].map((row) => row.map((value) => csvCell(String(value))).join(",")).join("\r\n") + "\r\n";
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="motoindex-affiliate-research-queue.csv"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}

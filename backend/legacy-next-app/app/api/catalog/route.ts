import { NextRequest, NextResponse } from "next/server";
import { allCatalogProducts } from "@/lib/catalog";

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category")?.toLowerCase();
  const brand = params.get("brand")?.toLowerCase();
  const q = params.get("q")?.toLowerCase();
  const items = allCatalogProducts().filter(item => item.status === "verified").filter(item => {
    if (category && item.category.toLowerCase() !== category) return false;
    if (brand && item.brand.toLowerCase() !== brand) return false;
    if (q && !`${item.brand} ${item.model} ${item.detail}`.toLowerCase().includes(q)) return false;
    return true;
  });
  return NextResponse.json({ count: items.length, items });
}

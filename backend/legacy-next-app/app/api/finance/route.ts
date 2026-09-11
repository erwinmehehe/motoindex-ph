import { NextRequest, NextResponse } from "next/server";
import { monthlyPayment } from "@/lib/utils";

const LIMITS = {
  minPrice: 1_000,
  maxPrice: 10_000_000,
  minDownPct: 0,
  maxDownPct: 95,
  minMonths: 1,
  maxMonths: 84,
  minRatePct: 0,
  maxRatePct: 60,
} as const;

function inRange(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const price = Number(p.get("price") || 0);
  const down = Number(p.get("down") || 20);
  const months = Number(p.get("months") || 36);
  const rate = Number(p.get("rate") || 12);

  const valid =
    inRange(price, LIMITS.minPrice, LIMITS.maxPrice) &&
    inRange(down, LIMITS.minDownPct, LIMITS.maxDownPct) &&
    Number.isInteger(months) && inRange(months, LIMITS.minMonths, LIMITS.maxMonths) &&
    inRange(rate, LIMITS.minRatePct, LIMITS.maxRatePct);

  if (!valid) {
    return NextResponse.json({
      error: "Invalid finance parameters",
      limits: LIMITS,
    }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json({
    price,
    downPaymentPct: down,
    months,
    annualRatePct: rate,
    estimatedMonthly: Math.round(monthlyPayment(price, down, months, rate)),
  }, { headers: { "Cache-Control": "no-store" } });
}

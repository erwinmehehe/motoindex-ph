import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

function csv(value:unknown){
  const text=value===null||value===undefined?"":String(value);
  return `"${text.replace(/"/g,'""')}"`;
}

export async function GET(){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});

  const leads=await prisma.dealerLead.findMany({
    orderBy:{createdAt:"desc"},
    take:2000,
    include:{deliveries:{orderBy:{createdAt:"asc"},include:{quoteResponse:true}}}
  });

  const header=[
    "lead_created_at","lead_status","make","model","variant","city_province","purchase_type","down_payment_budget",
    "buyer_name","buyer_mobile","buyer_email","matched_seller_slugs","source_path",
    "dealer_name","dealer_slug","dealer_email","handoff_status","handoff_shared_at","handoff_opened_at","handoff_expires_at",
    "quote_submitted_at","quote_cash_price","quote_down_payment","quote_monthly","quote_term_months","quote_availability","quote_valid_until","quote_note"
  ];

  const rows:string[]=[];
  for(const lead of leads){
    const deliveries=lead.deliveries.length?lead.deliveries:[null];
    for(const delivery of deliveries){
      const quote=delivery?.quoteResponse;
      rows.push([
        lead.createdAt.toISOString(),
        lead.status,
        lead.make,
        lead.model,
        lead.variant||"",
        lead.cityProvince,
        lead.purchaseType,
        lead.downPaymentBudget||"",
        lead.fullName,
        lead.mobile,
        lead.email||"",
        lead.matchedSellerSlugs.join("|"),
        lead.sourcePath,
        delivery?.sellerName||"",
        delivery?.sellerSlug||"",
        delivery?.dealerEmail||"",
        delivery?.status||"",
        delivery?.sharedAt?.toISOString()||"",
        delivery?.openedAt?.toISOString()||"",
        delivery?.expiresAt?.toISOString()||"",
        quote?.submittedAt?.toISOString()||"",
        quote?.cashPricePhp?Number(quote.cashPricePhp):"",
        quote?.downPaymentPhp?Number(quote.downPaymentPhp):"",
        quote?.monthlyPhp?Number(quote.monthlyPhp):"",
        quote?.termMonths||"",
        quote?.availability||"",
        quote?.validUntil?.toISOString()||"",
        quote?.dealerNote||""
      ].map(csv).join(","));
    }
  }

  const body=[header.map(csv).join(","),...rows].join("\n");
  const date=new Date().toISOString().slice(0,10);
  return new Response(body,{headers:{
    "Content-Type":"text/csv; charset=utf-8",
    "Content-Disposition":`attachment; filename="motoindex-dealer-leads-${date}.csv"`,
    "Cache-Control":"no-store",
    "X-Robots-Tag":"noindex, nofollow, noarchive"
  }});
}

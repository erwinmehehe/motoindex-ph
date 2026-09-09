import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

function csv(value:unknown){
  const text=value===null||value===undefined?"":String(value);
  return `"${text.replace(/"/g,'""')}"`;
}

export async function GET(){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});
  const leads=await prisma.dealerLead.findMany({orderBy:{createdAt:"desc"},take:2000});
  const header=["created_at","status","make","model","variant","city_province","purchase_type","down_payment_budget","full_name","mobile","email","matched_seller_slugs","source_path"];
  const rows=leads.map(lead=>[
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
    lead.sourcePath
  ].map(csv).join(","));
  const body=[header.map(csv).join(","),...rows].join("\n");
  const date=new Date().toISOString().slice(0,10);
  return new Response(body,{headers:{
    "Content-Type":"text/csv; charset=utf-8",
    "Content-Disposition":`attachment; filename="motoindex-dealer-leads-${date}.csv"`,
    "Cache-Control":"no-store"
  }});
}

import { NextResponse } from "next/server"; import { databaseConfigured } from "@/lib/db"; import { listImportBatches } from "@/lib/persistentOffers";
export const runtime="nodejs";
export async function GET(){const batches=await listImportBatches();return NextResponse.json({ok:true,databaseConfigured:databaseConfigured(),batches});}

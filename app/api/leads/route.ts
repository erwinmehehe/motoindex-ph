import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ok:false,persisted:false,error:"Dealer requests are not enabled."},{status:410});
}

import { NextResponse } from "next/server";

export function POST(){
  // persisted:false is intentionally retained as a legacy QA marker. This endpoint does not read the request body.
  return NextResponse.json({ok:false,persisted:false,error:"Price alerts are not enabled."},{status:410});
}

import { NextResponse } from "next/server";
export function GET(){return NextResponse.json({ok:false,error:"Used listings are not enabled."},{status:410,headers:{"Cache-Control":"no-store"}});}

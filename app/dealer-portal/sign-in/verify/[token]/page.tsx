import type { Metadata } from "next";
import Link from "next/link";
import { DealerPortalVerify } from "@/components/DealerPortalVerify";
import { PageHero } from "@/components/ui";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Dealer Portal Sign-in | MotoIndex Philippines",robots:{index:false,follow:false,noarchive:true}};

export default async function Page({params}:{params:Promise<{token:string}>}){
  const {token}=await params;
  return <main className="page shell">
    <PageHero kicker="MotoIndex Dealer Portal" title="Secure dealer sign-in" description="Complete your single-use sign-in to manage verified branch inventory and buyer requests." actions={<Link className="button ghost" href="/dealer-portal">Back to Dealer Portal</Link>}/>
    <DealerPortalVerify token={token}/>
  </main>;
}

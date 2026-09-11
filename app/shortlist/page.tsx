import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { ShortlistClient } from "@/components/ShortlistClient";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";

export const metadata:Metadata=pageMetadata({title:"Saved Motorcycle Shortlist",description:"Save Philippine motorcycles in your browser, share a shortlist URL and compare up to three current models.",path:"/shortlist",index:false});

export default function ShortlistPage(){return <section className="page shell"><div className="page-head"><h1>Save motorcycles without creating an account</h1><p>Your shortlist is stored in this browser. Shared URLs contain only motorcycle slugs—no account or personal profile is required.</p></div><ShortlistClient models={forClient(publicMotorcycles)}/></section>}

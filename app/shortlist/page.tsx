import type { Metadata } from "next";
import { ShortlistClient } from "@/components/ShortlistClient";
import { forClient } from "@/lib/competitors";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import styles from "./ShortlistPage.module.css";

export const dynamic="force-static";
export const metadata:Metadata=pageMetadata({title:"Saved Motorcycle Shortlist",description:"Save Philippine motorcycles in your browser, share a shortlist URL and compare up to three current models.",path:"/shortlist",index:false});

export default function ShortlistPage(){
  return <section className={styles.page}>
    <div className={styles.head}>
      <h1>Your saved motorcycles, in one place.</h1>
      <p>Keep the bikes you are seriously considering together, compare your strongest options and share the list when you need a second opinion. No account is required.</p>
    </div>
    <div className={styles.workspace}><ShortlistClient models={forClient(publicMotorcycles)}/></div>
  </section>
}

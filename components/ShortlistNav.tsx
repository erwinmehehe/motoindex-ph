"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";

function count(){try{return (JSON.parse(localStorage.getItem(SHORTLIST_KEY)||"[]") as string[]).length}catch{return 0}}

export function ShortlistNav(){
  const [n,setN]=useState(0);
  const pathname=usePathname()||"/";
  useEffect(()=>{
    const update=()=>setN(count());
    update();
    window.addEventListener("storage",update);
    window.addEventListener("motoindex-shortlist",update as EventListener);
    return()=>{window.removeEventListener("storage",update);window.removeEventListener("motoindex-shortlist",update as EventListener)}
  },[]);
  const active=pathname.startsWith("/shortlist");
  return <Link className={`shortlist-nav${active?" nav-current":""}`} aria-current={active?"page":undefined} aria-label={`Shortlist${n? ` (${n})`:""}`} href="/shortlist">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5h10a1 1 0 0 1 1 1v15l-6-3.8-6 3.8v-15a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
    {n>0&&<b>{n}</b>}
  </Link>
}

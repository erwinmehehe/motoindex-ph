"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";
function count(){try{return (JSON.parse(localStorage.getItem(SHORTLIST_KEY)||"[]") as string[]).length}catch{return 0}}
export function ShortlistNav(){const [n,setN]=useState(0);const pathname=usePathname()||"/";useEffect(()=>{const update=()=>setN(count());update();window.addEventListener("storage",update);window.addEventListener("motoindex-shortlist",update as EventListener);return()=>{window.removeEventListener("storage",update);window.removeEventListener("motoindex-shortlist",update as EventListener)}},[]);const active=pathname.startsWith("/shortlist");return <Link className={`shortlist-nav${active?" nav-current":""}`} aria-current={active?"page":undefined} href="/shortlist">Shortlist{n>0&&<b>{n}</b>}</Link>}

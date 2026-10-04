"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DealerPortalSignOut(){
  const router=useRouter();
  const [working,setWorking]=useState(false);
  async function signOut(){
    setWorking(true);
    await fetch("/api/dealer-portal/auth/sign-out",{method:"POST"}).catch(()=>{});
    router.replace("/dealer-portal");
    router.refresh();
  }
  return <button className="button ghost small" type="button" onClick={signOut} disabled={working}>{working?"Signing out…":"Sign out"}</button>;
}

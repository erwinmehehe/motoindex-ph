"use client";

import { useState } from "react";

export function PriceAlertRunButton({disabled=false}:{disabled?:boolean}){
  const [running,setRunning]=useState(false);
  const [message,setMessage]=useState("");

  async function run(){
    setRunning(true);setMessage("");
    try{
      const response=await fetch("/api/admin/price-alerts/run",{method:"POST"});
      const result=await response.json();
      if(!response.ok||!result.ok){
        setMessage(result.error||"Price alert check failed.");
        return;
      }
      setMessage(`Checked ${result.checked}; sent ${result.sent}; errors ${result.errors}.`);
    }catch{
      setMessage("Price alert check failed.");
    }finally{
      setRunning(false);
    }
  }

  return <div className="price-alert-admin-run">
    <button className="button small" type="button" disabled={disabled||running} onClick={run}>{running?"Running…":"Run alert check now"}</button>
    {message&&<small>{message}</small>}
  </div>;
}

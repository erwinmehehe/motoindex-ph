// @ts-nocheck
import type { Metadata } from "next";
import Link from "next/link";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { priceAlertConfigStatus } from "@/lib/priceAlerts";
import { php } from "@/lib/utils";
import { PriceAlertRunButton } from "@/components/PriceAlertRunButton";

export const metadata:Metadata={title:"Price Alerts",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

function maskEmail(email:string){
  const [name,domain]=email.split("@");
  if(!domain)return "hidden";
  const visible=name.slice(0,Math.min(2,name.length));
  return `${visible}${"*".repeat(Math.max(2,Math.min(6,name.length-visible.length)))}@${domain}`;
}

export default async function PriceAlertsAdmin(){
  const config=priceAlertConfigStatus();
  let databaseReady=databaseConfigured();
  let rows:Awaited<ReturnType<typeof prisma.priceAlertSubscription.findMany>>=[];

  if(databaseReady){
    try{
      rows=await prisma.priceAlertSubscription.findMany({orderBy:{updatedAt:"desc"},take:200});
    }catch{
      databaseReady=false;
    }
  }

  const active=rows.filter(row=>row.status==="active").length;
  const pending=rows.filter(row=>row.status==="pending").length;
  const unsubscribed=rows.filter(row=>row.status==="unsubscribed").length;
  const sent30=rows.filter(row=>row.lastSentAt&&row.lastSentAt>=new Date(Date.now()-30*24*60*60*1000)).length;

  return <section className="page shell">
    <div className="page-head">
      <h1>Price alert operations</h1>
      <p>Review confirmed threshold alerts and delivery health. Price alerts remain unavailable publicly unless database, email delivery and scheduled checking are all explicitly configured.</p>
      <div className="hero-actions"><Link className="button ghost small" href="/admin/growth">Growth dashboard</Link><Link className="button ghost small" href="/admin/data-health">Data health</Link><Link className="button ghost small" href="/price-alerts" target="_blank">Public alert page ↗</Link></div>
    </div>

    <div className="health-summary">
      <div><span>Ready</span><strong>{config.ready?"Yes":"No"}</strong><small>All production gates</small></div>
      <div><span>Active</span><strong>{active}</strong><small>Confirmed alerts</small></div>
      <div><span>Pending</span><strong>{pending}</strong><small>Awaiting email confirmation</small></div>
      <div><span>Unsubscribed</span><strong>{unsubscribed}</strong></div>
      <div><span>Sent · 30d</span><strong>{sent30}</strong></div>
    </div>

    <div className="note-box">
      <h2>Production configuration</h2>
      <div className="analytics-events">
        <span><b>Feature flag</b><small>{config.enabled?"On":"Off"}</small></span>
        <span><b>Database</b><small>{config.database?"Ready":"Missing"}</small></span>
        <span><b>Email API key</b><small>{config.resend?"Ready":"Missing"}</small></span>
        <span><b>From email</b><small>{config.fromEmail?"Ready":"Missing"}</small></span>
        <span><b>Cron secret</b><small>{config.cronSecret?"Ready":"Missing"}</small></span>
        <span><b>Scheduler confirmed</b><small>{config.cronConfigured?"Yes":"No"}</small></span>
      </div>
      <PriceAlertRunButton disabled={!config.ready}/>
    </div>

    {!databaseReady?<div className="note-box"><h2>Alert table is unavailable</h2><p>Apply the latest Prisma migrations to the configured production database before enabling this feature.</p></div>:
    rows.length===0?<div className="note-box"><h2>No price alerts yet</h2><p>Confirmed and pending subscriptions will appear here after the public feature is enabled.</p></div>:
    <div className="admin-table price-alert-admin-table">
      <div className="admin-row head"><span>Motorcycle / email</span><span>Target</span><span>Status</span><span>Last check</span><span>Last alert</span></div>
      {rows.map(row=>{const model=getModelById(row.entityId);return <div className="admin-row" key={row.id}>
        <span><b>{model?`${model.make} ${model.model}`:row.entityId}</b><small>{maskEmail(row.email)}</small></span>
        <span><b>{php(Number(row.targetPricePhp))}</b><small>{row.lastObservedPricePhp?`Last seen ${php(Number(row.lastObservedPricePhp))}`:"No check yet"}</small></span>
        <span><em className={`offer-status ${row.status}`}>{row.status}</em><small>{row.thresholdWasMet?"Threshold currently met":"Waiting above target"}</small></span>
        <span>{row.lastCheckedAt?row.lastCheckedAt.toISOString().slice(0,16).replace("T"," "):"—"}</span>
        <span>{row.lastSentAt?row.lastSentAt.toISOString().slice(0,16).replace("T"," "):"—"}</span>
      </div>})}
    </div>}
  </section>;
}

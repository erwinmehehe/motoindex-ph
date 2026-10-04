import type { Metadata } from "next";
import Link from "next/link";
import { MyAccountControls } from "@/components/MyAccountControls";
import { MyMotoIndexSignIn } from "@/components/MyMotoIndexSignIn";
import { MyNotificationPreferences } from "@/components/MyNotificationPreferences";
import { MyShortlistSync } from "@/components/MyShortlistSync";
import { PageHero } from "@/components/ui";
import { getModelById } from "@/lib/data";
import { databaseConfigured, prisma } from "@/lib/db";
import { parseGarageState } from "@/lib/garage";
import { getOwnerSession, ownerAuthConfigured } from "@/lib/ownerAuth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "My MotoIndex | Garage, Shortlist, Alerts & Quotes",
  description: "Your private MotoIndex dashboard for saved motorcycles, Garage ownership, price alerts, dealer quotes and reminders.",
  robots: { index: false, follow: false, noarchive: true },
};

function dueSoon(date: Date | null) {
  if (!date) return false;
  return date.getTime() <= Date.now() + 30 * 86400000;
}

export default async function MyMotoIndexPage() {
  const session = ownerAuthConfigured() ? await getOwnerSession() : null;
  if (!session || !databaseConfigured()) {
    return <main className="page shell">
      <PageHero kicker="My MotoIndex" title="Your motorcycles, shopping and ownership in one place." description="Sign in with the same passwordless account used by My Garage. MotoIndex stays useful without an account, but signing in lets you carry your shortlist and private account activity across devices." actions={<Link className="button ghost" href="/garage">Open My Garage</Link>} />
      <MyMotoIndexSignIn />
    </main>;
  }

  const [owner, shortlistRows, snapshot, alerts, leads, reminders] = await Promise.all([
    prisma.ownerAccount.findUnique({ where: { id: session.ownerId } }),
    prisma.ownerShortlistItem.findMany({ where: { ownerId: session.ownerId }, orderBy: { position: "asc" } }),
    prisma.garageSnapshot.findUnique({ where: { ownerId: session.ownerId } }),
    prisma.priceAlertSubscription.findMany({ where: { ownerId: session.ownerId, status: { in: ["pending", "active"] } }, orderBy: { updatedAt: "desc" } }),
    prisma.dealerLead.findMany({ where: { ownerId: session.ownerId }, include: { deliveries: { include: { quoteResponse: true } } }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.garageReminder.findMany({ where: { ownerId: session.ownerId, active: true }, orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }], take: 20 }),
  ]);
  if (!owner) return null;

  const garage = snapshot ? parseGarageState(JSON.stringify(snapshot.payload)) : null;
  const shortlist = shortlistRows.map(row => getModelById(row.modelId)).filter((model): model is NonNullable<ReturnType<typeof getModelById>> => Boolean(model));
  const quoteCount = leads.reduce((count, lead) => count + lead.deliveries.filter(delivery => Boolean(delivery.quoteResponse) && delivery.status !== "cancelled").length, 0);
  const recentOwnership = garage ? [...garage.records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6) : [];
  const upcoming = reminders.filter(item => item.dueDate ? dueSoon(item.dueDate) : item.dueKm !== null && item.currentOdometerKm !== null && item.dueKm - item.currentOdometerKm <= 1000).slice(0, 5);
  const nextActions = [
    !garage?.motorcycles.length ? { title: "Add your motorcycle", copy: "Start an ownership record for reminders, costs and resale history.", href: "/garage", cta: "Open Garage" } : null,
    shortlist.length < 2 ? { title: "Build a shortlist", copy: "Save at least two motorcycles to make the next comparison useful.", href: "/motorcycles", cta: "Browse motorcycles" } : null,
    alerts.length === 0 && shortlist[0] ? { title: "Watch a price", copy: `Set a target for ${shortlist[0].make} ${shortlist[0].model} or another saved motorcycle.`, href: `/motorcycles/${shortlist[0].makeSlug}/${shortlist[0].slug}`, cta: "Set price alert" } : null,
    leads.length === 0 && shortlist[0] ? { title: "Ask dealers for a quote", copy: "Move from research into a real dealer response when you are ready.", href: `/get-quote/${shortlist[0].makeSlug}/${shortlist[0].slug}`, cta: "Request quotes" } : null,
    upcoming[0] ? { title: upcoming[0].title, copy: `${upcoming[0].motorcycleLabel} has an upcoming ownership task.`, href: "/garage", cta: "Review reminder" } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 4);

  const settings = {
    notificationPriceDropEmail: owner.notificationPriceDropEmail,
    notificationQuoteEmail: owner.notificationQuoteEmail,
    notificationRegistrationEmail: owner.notificationRegistrationEmail,
    notificationInsuranceEmail: owner.notificationInsuranceEmail,
    notificationMaintenanceEmail: owner.notificationMaintenanceEmail,
    notificationDealerPromoEmail: owner.notificationDealerPromoEmail,
  };

  return <main className="page shell my-motoindex-page">
    <MyShortlistSync />
    <PageHero kicker="My MotoIndex" title="What should you do next?" description="One private home for motorcycles you are considering, dealer conversations and the motorcycles you already own." actions={<><Link className="button" href="/garage">My Garage</Link><Link className="button ghost" href="/shortlist">Shortlist</Link></>} />

    <section className="my-summary-grid" aria-label="MotoIndex account summary">
      <article><span>Garage</span><strong>{garage?.motorcycles.length || 0}</strong><small>{garage?.motorcycles.length === 1 ? "motorcycle" : "motorcycles"} in latest cloud copy</small></article>
      <article><span>Shortlist</span><strong>{shortlist.length}</strong><small>saved to your account</small></article>
      <article><span>Price alerts</span><strong>{alerts.filter(alert => alert.status === "active").length}</strong><small>{alerts.filter(alert => alert.status === "pending").length} awaiting confirmation</small></article>
      <article><span>Dealer quotes</span><strong>{quoteCount}</strong><small>across {leads.length} request{leads.length === 1 ? "" : "s"}</small></article>
      <article><span>Upcoming</span><strong>{upcoming.length}</strong><small>renewal or maintenance items near due</small></article>
    </section>

    <section className="my-next-actions">
      <div className="section-head compact"><div><span className="field-label">Next actions</span><h2>Keep the ownership cycle moving</h2></div></div>
      <div className="my-action-grid">{nextActions.map(item => <article className="info-card" key={item.title}><h3>{item.title}</h3><p>{item.copy}</p><Link className="button small" href={item.href}>{item.cta}</Link></article>)}</div>
    </section>

    <section className="info-card">
      <div className="section-head compact"><div><span className="field-label">Garage</span><h2>Your owned motorcycles</h2><p>The dashboard reads only the latest explicit cloud save. Device-only document files remain on that device.</p></div><Link className="button small ghost" href="/garage">Manage Garage</Link></div>
      {garage?.motorcycles.length ? <div className="my-list">{garage.motorcycles.slice(0, 4).map(bike => <div className="my-list-row" key={bike.id}><span><strong>{bike.make} {bike.model}</strong><small>{bike.odometerKm.toLocaleString()} km{bike.registrationExpiry ? ` · registration ${bike.registrationExpiry}` : ""}</small></span><Link href="/garage">Open</Link></div>)}</div> : <p className="muted-note">No cloud Garage motorcycle yet.</p>}
    </section>

    <section className="info-card">
      <div className="section-head compact"><div><span className="field-label">Recent ownership activity</span><h2>What changed in your Garage</h2><p>Recent fuel, service, odometer and ownership records from the latest cloud copy.</p></div><Link className="button small ghost" href="/garage">Open history</Link></div>
      {recentOwnership.length ? <div className="my-list">{recentOwnership.map(record => <div className="my-list-row" key={record.id}><span><strong>{record.title}</strong><small>{record.date} · {record.category}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}</small></span>{record.amountPhp !== undefined ? <strong>₱{record.amountPhp.toLocaleString("en-PH")}</strong> : <span>Logged</span>}</div>)}</div> : <p className="muted-note">No ownership activity has been cloud-synced yet.</p>}
    </section>

    <section className="info-card">
      <div className="section-head compact"><div><span className="field-label">Shortlist</span><h2>Motorcycles you are considering</h2><p>When signed in, your browser shortlist is merged into this account list while anonymous browsing continues to use local storage.</p></div><Link className="button small ghost" href="/shortlist">Open shortlist</Link></div>
      {shortlist.length ? <div className="my-list">{shortlist.map(model => <div className="my-list-row" key={model.id}><span><strong>{model.make} {model.model}</strong><small>{model.category} · from ₱{model.srp.toLocaleString("en-PH")}</small></span><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Research</Link></div>)}</div> : <p className="muted-note">Your account shortlist is empty. Saved browser motorcycles will merge here automatically on this page.</p>}
    </section>

    <section className="info-card">
      <div className="section-head compact"><div><span className="field-label">Shopping activity</span><h2>Alerts and dealer quote requests</h2></div></div>
      <div className="my-commerce-grid">
        <div><h3>Active price alerts</h3>{alerts.length ? alerts.slice(0, 6).map(alert => { const model = getModelById(alert.entityId); return <p key={alert.id}><strong>{model ? `${model.make} ${model.model}` : alert.entityId}</strong><br/><small>{alert.status} · target ₱{Number(alert.targetPricePhp).toLocaleString("en-PH")}</small></p>; }) : <p className="muted-note">No account-linked alerts yet.</p>}</div>
        <div><h3>Dealer requests</h3>{leads.length ? leads.slice(0, 6).map(lead => { const quotes = lead.deliveries.filter(delivery => Boolean(delivery.quoteResponse) && delivery.status !== "cancelled"); return <div className="my-quote-request" key={lead.id}><p><strong>{lead.make} {lead.model}</strong><br/><small>{lead.status} · {quotes.length} quote{quotes.length === 1 ? "" : "s"} received · {lead.cityProvince}</small></p>{quotes.map(delivery => { const quote = delivery.quoteResponse!; return <div className="my-quote-summary" key={delivery.id}><span><strong>{delivery.sellerName}</strong><small>{quote.availability}{quote.validUntil ? ` · valid until ${quote.validUntil.toISOString().slice(0,10)}` : ""}</small></span><strong>{quote.cashPricePhp ? `₱${Number(quote.cashPricePhp).toLocaleString("en-PH")}` : quote.monthlyPhp ? `₱${Number(quote.monthlyPhp).toLocaleString("en-PH")}/mo` : "Quote received"}</strong></div>; })}</div>; }) : <p className="muted-note">No account-linked quote requests yet.</p>}</div>
      </div>
    </section>

    <MyNotificationPreferences initial={settings} />
    <MyAccountControls />
    <p className="muted-note">Signed in as {owner.email}. MotoIndex does not expose your Garage, shortlist, alerts or dealer-request history publicly.</p>
  </main>;
}

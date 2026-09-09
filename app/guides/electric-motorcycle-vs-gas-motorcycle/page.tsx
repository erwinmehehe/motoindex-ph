import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";

export const metadata:Metadata=pageMetadata({
  title:"Electric vs Gas Motorcycle Philippines: Cost & Use",
  description:"Compare electric and gasoline motorcycles in the Philippines for energy cost, range, charging or refueling, registration, maintenance and daily use.",
  path:"/guides/electric-motorcycle-vs-gas-motorcycle"
});

export default function Page(){return <section className="page shell">
  <Breadcrumbs items={[{label:"Guides",href:"/guides"},{label:"Electric vs gas motorcycle"}]}/>
  <div className="page-head"><span className="entity-kicker">Electric ownership</span><h1>Electric motorcycle vs gas motorcycle in the Philippines</h1><p>The better choice depends on where you ride, where you can charge or refuel, your daily distance, purchase price and how much flexibility you need for longer trips.</p></div>

  <div className="guide-topic-grid">
    <article><h2>Energy cost</h2><p>Electric motorcycles replace gasoline with household or commercial electricity. Compare your actual electricity rate with your current motorcycle&apos;s km/L and local fuel price rather than assuming one is always cheaper.</p></article>
    <article><h2>Range</h2><p>Gas motorcycles can usually refuel quickly and continue. Electric range depends on usable battery capacity, riding conditions and access to charging, so daily route length matters more.</p></article>
    <article><h2>Charging vs refueling</h2><p>Home charging can be convenient when parking has a safe power source. Riders without dependable charging access may find gasoline refueling easier.</p></article>
    <article><h2>Maintenance</h2><p>Electric drivetrains remove engine-oil changes and some combustion-engine service items, but tires, brakes, suspension, bearings and battery-related checks still remain.</p></article>
    <article><h2>Registration</h2><p>Do not assume an electric two-wheeler is exempt from LTO requirements. Vehicle classification determines the registration and licensing rules that apply.</p></article>
    <article><h2>Long trips</h2><p>Before choosing electric for provincial or longer-distance travel, map realistic charging options and keep a reserve rather than planning around the full advertised range.</p></article>
  </div>

  <div className="cta-panel"><div><span className="section-kicker">Run your own numbers</span><h2>Compare range and electricity cost</h2><p>Use the current Philippine electric-motorcycle records with your own daily distance and electricity rate.</p></div><div className="hero-actions"><Link className="button" href="/tools/electric-motorcycle-range-calculator">Range calculator</Link><Link className="button secondary" href="/tools/electric-motorcycle-charging-cost">Charging cost</Link></div></div>

  <FaqSection title="Electric vs gas motorcycle questions" items={[
    {question:"Is an electric motorcycle always cheaper to run than a gas motorcycle?",answer:"No. Electricity cost per kilometer can be lower in many scenarios, but purchase price, battery plan, charging losses, maintenance, financing and resale also affect total ownership cost."},
    {question:"Is an electric motorcycle better for daily commuting?",answer:"It can be a strong fit when your daily distance is comfortably inside the practical range and you have dependable charging. A gas motorcycle can remain easier when routes change often or charging access is uncertain."},
    {question:"Do electric motorcycles need LTO registration?",answer:"Some do. Current Philippine L3 electric motorcycles follow motorcycle registration requirements. Check the exact vehicle classification before buying."}
  ]}/>
</section>;}

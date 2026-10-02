import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { currentMotorcycles, isIndexableModel } from "@/lib/data";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { siteStats } from "@/lib/siteStats";
import styles from "@/app/HomePage.module.css";

const priorityBrands = ["honda","yamaha","suzuki","kawasaki","ktm","cfmoto"] as const;
const categoryTiles = [
  ["scooter","Scooter","/motorcycles/scooters"],
  ["underbone","Underbone","/recommendations#commuting"],
  ["naked","Naked","/recommendations"],
  ["sports","Sports","/recommendations"],
  ["adventure","Adventure","/recommendations"],
  ["bigbike","Big Bike","/recommendations#400cc"],
  ["electric","Electric","/motorcycles/electric"],
] as const;

function CategoryIcon({kind}:{kind:string}) {
  if(kind==="electric") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h6l3-8h5l3 8M12 12h7M17 5l-4 8h5l-3 7"/></svg>;
  if(kind==="adventure") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h6l3-8h5l3 8M13 15l-3-5h7l4 5M4 9l5-5 4 5"/></svg>;
  if(kind==="sports") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h7l4-8h5l2 8M11 18l4-6h8l-4 6M15 12l-3-3"/></svg>;
  if(kind==="scooter") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h9l3-7h4l2 7M14 12h5v4h-7l-2 7M20 12l2-4"/></svg>;
  if(kind==="underbone") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h7l4-7h4l3 7M12 13h8l-3 5h-7M18 13l2-4"/></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="23" r="4"/><circle cx="24" cy="23" r="4"/><path d="M8 23h7l4-8h5l2 8M12 15h8l-3 4h-6M18 15l2-5"/></svg>;
}
const featureLinks = [
  ["⇄","Compare","up to 3 motorcycles","/compare"],
  ["◷","Latest Prices","updated for PH market","/price-list"],
  ["⌾","Detailed Specs","engine, features, dimensions","/motorcycles"],
  ["◎","Rider Guides","tips, reviews & more","/guides"],
] as const;

export function HomePageRedesign({ heading }: { heading: ReactNode }) {
  const models=currentMotorcycles.filter(isIndexableModel);
  const bySlug=(make:string, slugNeedle:string)=>models.find(m=>m.makeSlug===make&&m.slug.toLowerCase().includes(slugNeedle));
  const hero=bySlug("yamaha","aerox-v3")??bySlug("yamaha","aerox")??bySlug("yamaha","nmax")??models[0];
  const latest=[
    bySlug("yamaha","nmax"),
    bySlug("honda","adv-160"),
    bySlug("suzuki","burgman-street"),
    bySlug("kawasaki","ninja-500")
  ].filter((m):m is NonNullable<typeof m>=>Boolean(m));
  const brandMap=new Map<string,{name:string,count:number}>();
  for(const model of models){
    const prev=brandMap.get(model.makeSlug);
    brandMap.set(model.makeSlug,{name:model.make,count:(prev?.count||0)+1});
  }
  const brands=priorityBrands.flatMap((slug)=>{ const brand=brandMap.get(slug); return brand ? [{slug,...brand}] : []; });

  return <main className={styles.page}>
    <section className={styles.hero} data-home-hero aria-labelledby="mi-home-title">
      <div className={styles.heroScenery} aria-hidden="true"><i/><b/><em/></div>
      <div className={["shell",styles.heroInner].join(" ")} data-home-layout>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>The complete Philippine motorcycle guide</span>
          {heading}
          <p className={styles.lede}>Compare prices, specs, and features of motorcycles in the Philippines, from scooters to big bikes.</p>
        </div>
        {hero&&<div className={styles.heroBike} data-home-visual>
          <EntityMedia entityType="motorcycle" entityId={hero.id} className={styles.heroBikeMedia} priority showCredit={false} sizes="(max-width: 780px) 78vw, 42vw" fallback={<EntityVerificationFallback brand={hero.make} model={hero.model}/>} />
        </div>}
      </div>
      <div className={["shell",styles.heroTools].join(" ")}>
        <form className={styles.search} data-home-search action="/motorcycles" method="get" role="search">
          <label className="sr-only" htmlFor="home-bike-search">Search motorcycles</label>
          <span aria-hidden="true">⌕</span>
          <input id="home-bike-search" name="q" type="search" placeholder="Search motorcycles (e.g. NMAX, Click, ADV 160...)" />
          <button type="submit" aria-label="Search motorcycles">⌕</button>
        </form>
        <nav className={styles.categories} aria-label="Motorcycle categories">
          {categoryTiles.map(([kind,label,href])=><Link href={href} key={label}><span className={styles.categoryIcon}><CategoryIcon kind={kind}/></span><strong>{label}</strong></Link>)}
        </nav>
      </div>
    </section>

    <section className={styles.compactSection}>
      <div className="shell">
        <div className={styles.compactHead}><h2>Popular Brands</h2><Link href="/motorcycles">View all brands →</Link></div>
        <nav className={styles.brandGrid} aria-label="Popular motorcycle brands">
          {brands.map((brand)=><Link href={"/motorcycles/"+brand.slug} className={styles.brandCard} key={brand.slug}>
            <span className={styles.brandLogo}><Image src={"/brand/motorcycle/"+brand.slug+".svg"} alt="" width={96} height={32} unoptimized /></span>
            <strong>{brand.name}</strong><small>{brand.count} models</small>
          </Link>)}
        </nav>
      </div>
    </section>

    <section className={styles.compactSection}>
      <div className="shell">
        <div className={styles.compactHead}><h2>Latest Motorcycles</h2><Link href="/motorcycles">View all →</Link></div>
        <div className={styles.modelGrid}>{latest.map(model=><MotorcycleCard key={model.id} model={model} variant="standard" />)}</div>
      </div>
    </section>

    <section className={styles.featureStrip}>
      <div className={["shell",styles.featureGrid].join(" ")}>
        {featureLinks.map(([icon,title,copy,href])=><Link href={href} key={title}><span>{icon}</span><div><strong>{title}</strong><small>{copy}</small></div></Link>)}
      </div>
    </section>

    <p className={styles.indexNote}>{siteStats.currentMotorcycles} current motorcycles researched across MotoIndex PH. <Link href="/commute/affordability">Check affordability →</Link></p>
  </main>;
}

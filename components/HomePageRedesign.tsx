import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { currentMotorcycles, isIndexableModel } from "@/lib/data";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { siteStats } from "@/lib/siteStats";
import styles from "@/app/HomePage.module.css";

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];
const categories = [
  ["Scooter", "/motorcycles/scooters", "scooter"],
  ["Underbone", "/recommendations#commuting", "underbone"],
  ["Naked", "/recommendations", "naked"],
  ["Sports", "/recommendations", "sports"],
  ["Adventure", "/recommendations", "adventure"],
  ["Big Bike", "/recommendations#400cc", "big"],
  ["Electric", "/motorcycles/electric", "electric"],
] as const;
const featureLinks = [
  ["Compare", "up to 3 motorcycles", "/compare"],
  ["Latest Prices", "updated for PH market", "/price-list"],
  ["Detailed Specs", "engine, features, dimensions", "/motorcycles"],
  ["Rider Guides", "tips, reviews & more", "/guides"],
] as const;

function CategoryIcon({ kind }: { kind: string }) {
  if (kind === "electric") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M17 3 8 17h7l-2 12 11-16h-7V3Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>;
  return <svg viewBox="0 0 36 28" aria-hidden="true">
    <circle cx="9" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="28" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 20h8l4-8h5m-9 8-5-10m5 10 8-2m-9-7h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function HomePageRedesign({ heading }: { heading: ReactNode }) {
  const verified = currentMotorcycles.filter(isIndexableModel);
  const find = (...tokens: string[]) => verified.find((m) => tokens.every((token) => (m.makeSlug + " " + m.slug).toLowerCase().includes(token)));
  const preferred = [
    find("yamaha","nmax"),
    find("honda","adv"),
    find("suzuki","burgman"),
    find("kawasaki","ninja-500"),
  ].filter((m): m is (typeof verified)[number] => Boolean(m));
  const featured = [...preferred, ...verified.filter((m)=>!preferred.some((p)=>p.id===m.id))].slice(0,4);
  const heroModel = find("yamaha","nmax") ?? find("yamaha","aerox") ?? featured[0];

  const brandMap = new Map<string,{name:string;count:number}>();
  for (const model of verified) {
    const row=brandMap.get(model.makeSlug);
    brandMap.set(model.makeSlug,{name:model.make,count:(row?.count||0)+1});
  }
  const featuredBrands=brandPriority.map((slug)=>[slug,brandMap.get(slug)] as const).filter((row): row is readonly [string,{name:string;count:number}]=>Boolean(row[1]));

  return <div className={styles.page} data-mockup-home>
    <section className={styles.hero} data-home-hero aria-labelledby="mi-home-title">
      <div className={"shell "+styles.heroInner} data-home-layout>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>The complete Philippine motorcycle guide</span>
          {heading}
          <p className={styles.lede}>Compare prices, specs, and features of motorcycles in the Philippines, from scooters to big bikes.</p>
          <form className={styles.search} data-home-search action="/motorcycles" method="get" role="search">
            <label className="sr-only" htmlFor="mi-home-search">Search motorcycles</label>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <input id="mi-home-search" type="search" name="q" placeholder="Search motorcycles (e.g. NMAX, Click, ADV 160...)" />
            <button type="submit" aria-label="Search">⌕</button>
          </form>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.scenery} aria-hidden="true"><i/><b/><em/></div>
          {heroModel && <EntityMedia
            entityType="motorcycle"
            entityId={heroModel.id}
            className={styles.heroBike}
            priority
            showCredit={false}
            sizes="(max-width: 820px) 100vw, 44vw"
            fallback={<EntityVerificationFallback brand={heroModel.make} model={heroModel.model}/>}
          />}
        </div>
      </div>
    </section>

    <div className={"shell "+styles.categoryRail} aria-label="Motorcycle categories">
      {categories.map(([label,href,kind],index)=><Link href={href} key={label} className={styles.categoryTile} data-tone={index}>
        <span className={styles.categoryIcon}><CategoryIcon kind={kind}/></span><strong>{label}</strong>
      </Link>)}
    </div>

    <section className={"shell "+styles.section+" "+styles.compactSection}>
      <div className={styles.sectionHead}><h2>Popular Brands</h2><Link href="/motorcycles">View all brands →</Link></div>
      <div className={styles.brandGrid}>
        {featuredBrands.map(([slug,brand])=><Link className={styles.brandCard} href={"/motorcycles/"+slug} key={slug}>
          <span className={styles.brandLogo}><Image src={"/brand/motorcycle/"+slug+".svg"} alt={brand.name+" logo"} width={110} height={38} unoptimized/></span>
          <strong>{brand.name}</strong><small>{brand.count} models</small>
        </Link>)}
      </div>
    </section>

    <section className={"shell "+styles.section+" "+styles.compactSection}>
      <div className={styles.sectionHead}><h2>Latest Motorcycles</h2><Link href="/motorcycles">View all →</Link></div>
      <div className={styles.modelGrid}>{featured.map((model)=><MotorcycleCard key={model.id} model={model} variant="standard"/>)}</div>
    </section>

    <section className={styles.featureStrip} aria-label="MotoIndex research features">
      <div className={"shell "+styles.featureGrid}>
        {featureLinks.map(([title,copy,href],index)=><Link href={href} key={title}>
          <span className={styles.featureIcon}>{index===0?"⌘":index===1?"◷":index===2?"⌾":"◇"}</span>
          <div><strong>{title}</strong><small>{copy}</small></div>
        </Link>)}
      </div>
    </section>

    <section className={"shell "+styles.seoContinuation} aria-label="More motorcycle research">
      <div><strong>{siteStats.currentMotorcycles} current models</strong><span>Use the full catalog, Finder and ownership tools when you need deeper research.</span></div>
      <Link href="/finder">Find my motorcycle →</Link>
    </section>
  </div>;
}

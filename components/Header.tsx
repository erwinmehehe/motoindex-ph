import { HeaderContinuity } from "@/components/HeaderContinuity";
import Link from "next/link";
import { ShortlistNav } from "@/components/ShortlistNav";
import { MotoIndexLogo } from "@/components/MotoIndexLogo";
import { comparisons, publicMotorcycles, isIndexableComparison } from "@/lib/data";

const hasModels = publicMotorcycles.length > 0;
const hasComparisons = comparisons.some((comparison) => isIndexableComparison(comparison.slug));
const motorcycleBrands = [...new Map(publicMotorcycles.map((model) => [model.makeSlug, model.make])).entries()]
  .sort((a, b) => a[1].localeCompare(b[1]));

const navGuides = [
  ["Under ₱100K", "/recommendations#budget"] as const,
  ["Scooters", "/recommendations#scooters"] as const,
  ["Daily commuting", "/recommendations#commuting"] as const,
  ["Rider fit", "/recommendations#rider-fit"] as const,
  ["ABS & fuel", "/recommendations#safety-efficiency"] as const
] as const;

const gear = [
  ["Helmets", "/gear/helmets"] as const,
  ["Tires", "/tires"] as const,
  ["Accessories", "/accessories"] as const
] as const;

const more = [
  ["Ownership", "/ownership"] as const,
  ["Dealers", "/dealers"] as const,
  ["Seller offers", "/deals"] as const,
  ["Commute", "/commute"] as const,
  ["All tools", "/tools"] as const,
  ...(hasModels ? [["Fitment finder", "/fitment"] as const] : []),
  ["Maintenance", "/maintenance"] as const,
  ["Loan calculator", "/tools/motorcycle-loan-calculator"] as const,
  ["Registration calculator", "/tools/lto-registration-fee-calculator"] as const,
  ["Insurance calculator", "/tools/motorcycle-insurance-calculator"] as const
] as const;

export function Header() {
  return <>
    <header className="site-header">
      <HeaderContinuity />
      <div className="shell nav-wrap">
        <MotoIndexLogo />
        <nav className="nav-links" aria-label="Primary navigation">
          {hasModels && <details className="nav-more nav-motorcycles">
            <summary>Motorcycles <span>⌄</span></summary>
            <div className="nav-popover nav-popover-menu">
              <Link className="nav-popover-primary" href="/motorcycles">All motorcycles</Link>
              <Link className="nav-popover-secondary" href="/motorcycles/electric">Electric motorcycles</Link>
              <span className="nav-popover-label">Browse by brand</span>
              <div className="nav-brand-grid">
                {motorcycleBrands.map(([slug, label]) => <Link href={`/motorcycles/${slug}`} key={slug}>{label}</Link>)}
              </div>
            </div>
          </details>}
          {hasModels && <Link href="/finder">Finder</Link>}
          {hasComparisons && <Link href="/compare">Compare</Link>}
          <details className="nav-more nav-guides">
            <summary>Guides <span>⌄</span></summary>
            <div className="nav-popover nav-popover-menu nav-popover-guides">
              <Link className="nav-popover-primary" href="/recommendations">Motorcycle buying guide</Link>
              <Link href="/guides">Editorial guides</Link>
              {navGuides.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </div>
          </details>
          <details className="nav-more nav-gear"><summary>Gear <span>⌄</span></summary><div className="nav-popover">{gear.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div></details>
          <details className="nav-more nav-moremenu"><summary>More <span>⌄</span></summary><div className="nav-popover">{more.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div></details>
        </nav>
        <Link className="mobile-search" href="/search">Search</Link>
        <div className="nav-actions"><Link className="nav-search" href="/search">⌕ Search</Link><ShortlistNav /><Link className="nav-match" href="/finder">Find my match →</Link></div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <div className="mobile-menu-panel"><nav aria-label="Mobile navigation">
            {hasModels && <>
              <strong className="mobile-menu-heading">Motorcycles</strong>
              <div className="mobile-menu-featured">
                <Link href="/motorcycles">All motorcycles</Link>
                <Link href="/motorcycles/electric">Electric motorcycles</Link>
              </div>
              <span className="mobile-menu-label">Browse by brand</span>
              <div className="mobile-menu-brand-grid">
                {motorcycleBrands.map(([slug, label]) => <Link href={`/motorcycles/${slug}`} key={slug}>{label}</Link>)}
              </div>
            </>}
            {hasModels && <Link href="/finder">Finder</Link>}
            {hasComparisons && <Link href="/compare">Compare</Link>}
            <strong className="mobile-menu-heading">Guides</strong>
            <Link href="/recommendations">Motorcycle buying guide</Link>
            <Link href="/guides">Editorial guides</Link>
            {navGuides.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <strong className="mobile-menu-heading">Gear</strong>
            {gear.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <strong className="mobile-menu-heading">Ownership & tools</strong>
            {more.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <Link href="/shortlist">Shortlist</Link><Link href="/search">Search</Link>
          </nav></div>
        </details>
      </div>
    </header>
    <nav className="mobile-quick-tabs" aria-label="Mobile quick navigation">
      <Link href="/motorcycles"><b>⌕</b><span>Explore</span></Link>
      {hasComparisons && <Link href="/compare"><b>⇄</b><span>Compare</span></Link>}
      <Link href="/shortlist"><b>♡</b><span>Saved</span></Link>
      <Link href="/finder"><b>✦</b><span>Match</span></Link>
    </nav>
  </>;
}

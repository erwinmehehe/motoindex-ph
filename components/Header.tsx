import { HeaderContinuity } from "@/components/HeaderContinuity";
import Link from "next/link";
import { ShortlistNav } from "@/components/ShortlistNav";
import { MotoIndexLogo } from "@/components/MotoIndexLogo";
import { comparisons, publicMotorcycles, recommendationGuides, isIndexableComparison, isIndexableRecommendation } from "@/lib/data";

const hasModels = publicMotorcycles.length > 0;
const hasComparisons = comparisons.some(c => isIndexableComparison(c.slug));
const publicGuides = recommendationGuides.filter(g => isIndexableRecommendation(g.slug));
const hasGuides = publicGuides.length > 0;
const motorcycleBrands = [...new Map(publicMotorcycles.map(model => [model.makeSlug, model.make])).entries()]
  .sort((a,b)=>a[1].localeCompare(b[1]));

const gear = [
  ["Helmets", "/gear/helmets"] as const,
  ["Tires", "/tires"] as const,
  ["Accessories", "/accessories"] as const
] as const;

const more = [
  ["Ownership", "/ownership"] as const,
  ["Dealers", "/dealers"] as const,
  ["Commute", "/commute"] as const,
  ["All tools", "/tools"] as const,
  ...(hasModels ? [["Fitment finder", "/fitment"] as const] : []),
  ["Maintenance", "/maintenance"] as const,
  ["Loan calculator", "/tools/motorcycle-loan-calculator"] as const,
  ["Registration calculator", "/tools/lto-registration-fee-calculator"] as const,
  ["Insurance calculator", "/tools/motorcycle-insurance-calculator"] as const
] as const;

export function Header() {
  return <header className="site-header">
    <HeaderContinuity />
    <div className="shell nav-wrap">
      <MotoIndexLogo />
      <nav className="nav-links" aria-label="Primary navigation">
        {hasModels && <details className="nav-more nav-motorcycles"><summary>Motorcycles <span>⌄</span></summary><div className="nav-popover nav-popover-menu"><Link className="nav-popover-primary" href="/motorcycles">All motorcycles</Link>{motorcycleBrands.map(([slug,label])=><Link href={`/motorcycles/${slug}`} key={slug}>{label}</Link>)}</div></details>}
        {hasModels && <Link href="/finder">Finder</Link>}
        {hasComparisons && <Link href="/compare">Compare</Link>}
        {hasGuides && <details className="nav-more nav-guides"><summary>Guides <span>⌄</span></summary><div className="nav-popover nav-popover-menu nav-popover-guides"><Link className="nav-popover-primary" href="/recommendations">All buying guides</Link>{publicGuides.map(guide=><Link href={`/recommendations/${guide.slug}`} key={guide.slug}>{guide.title}</Link>)}</div></details>}
        <details className="nav-more nav-gear"><summary>Gear <span>⌄</span></summary><div className="nav-popover">{gear.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div></details>
        <details className="nav-more nav-moremenu"><summary>More <span>⌄</span></summary><div className="nav-popover">{more.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div></details>
      </nav>
      <Link className="mobile-search" href="/search">Search</Link>
      <div className="nav-actions"><ShortlistNav /><Link className="nav-search" href="/search">Search</Link></div>
      <details className="mobile-menu"><summary aria-label="Open navigation">Menu</summary><div className="mobile-menu-panel"><nav aria-label="Mobile navigation">
        {hasModels && <><strong className="mobile-menu-heading">Motorcycles</strong><Link href="/motorcycles">All motorcycles</Link>{motorcycleBrands.map(([slug,label])=><Link href={`/motorcycles/${slug}`} key={slug}>{label}</Link>)}</>}
        {hasModels && <Link href="/finder">Finder</Link>}
        {hasComparisons && <Link href="/compare">Compare</Link>}
        {hasGuides && <><strong className="mobile-menu-heading">Guides</strong><Link href="/recommendations">All buying guides</Link>{publicGuides.map(guide=><Link href={`/recommendations/${guide.slug}`} key={guide.slug}>{guide.title}</Link>)}</>}
        <strong className="mobile-menu-heading">Gear</strong>
        {gear.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        <strong className="mobile-menu-heading">Ownership & tools</strong>
        {more.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        <Link href="/shortlist">Shortlist</Link><Link href="/search">Search</Link>
      </nav></div></details>
    </div>
  </header>;
}

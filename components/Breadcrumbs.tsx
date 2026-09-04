import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  // Every breadcrumb trail starts at the homepage, so each page carries one
  // internal link back to the root and BreadcrumbList position 1 is always Home.
  // Callers that already pass their own Home crumb are left alone.
  const trail: Crumb[] = items[0]?.href === "/" ? items : [{ label: "Home", href: "/" }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined
    }))
  };
  return <>
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {trail.map((item, index) => <span className="breadcrumb-item" key={`${item.label}-${index}`}>
        {index > 0 && <span aria-hidden="true">/</span>}
        {item.href ? <Link href={item.href}>{item.label}</Link> : <b aria-current="page">{item.label}</b>}
      </span>)}
    </nav>
    <JsonLd data={schema} />
  </>;
}

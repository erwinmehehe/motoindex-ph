import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined
    }))
  };
  return <>
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => <span className="breadcrumb-item" key={`${item.label}-${index}`}>
        {index > 0 && <span aria-hidden="true">/</span>}
        {item.href ? <Link href={item.href}>{item.label}</Link> : <b aria-current="page">{item.label}</b>}
      </span>)}
    </nav>
    <JsonLd data={schema} />
  </>;
}

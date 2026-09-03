export type ProductEntityNavItem = { href: string; label: string };

export function ProductEntityNav({ items, ariaLabel = "On this page" }: { items: ProductEntityNavItem[]; ariaLabel?: string }) {
  return <nav className="product-entity-nav" aria-label={ariaLabel}>
    {items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
  </nav>;
}

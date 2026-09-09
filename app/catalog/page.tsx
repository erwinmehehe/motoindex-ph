import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { allCatalogProducts, helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";

export const metadata: Metadata = pageMetadata({ title: 'Motorcycle Gear & Parts Catalog Philippines', description: 'Search MotoIndex PH helmet, tire and top-box records with prices, sizes and compatibility notes.', path: '/catalog', index: false });
export default function CatalogPage(){
  const items=allCatalogProducts().filter(item=>item.status==="verified");
  return <section className="page shell"><div className="page-head"><h1>Helmets, tires and motorcycle accessories</h1><p>Search product records with current source links, price checks and fitment notes where available.</p><div className="proof on-white"><span><b>{helmetProducts.filter(p=>p.status==="verified").length}</b> helmets</span><span><b>{tireProducts.filter(p=>p.status==="verified").length}</b> tire families</span><span><b>{topBoxProducts.filter(p=>p.status==="verified").length}</b> top boxes</span></div></div><CatalogExplorer items={items}/><div className="catalog-callout" style={{marginTop:32}}><div><h2>Check products against your bike</h2><p>Open the fitment page to compare stock tire sizes and mounting requirements before choosing a product.</p></div><div className="hero-actions"><Link className="button" href="/fitment">Open fitment finder</Link><Link className="button ghost" href="/deals">Current seller offers</Link></div></div></section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description: "How MotoIndex PH uses affiliate links while keeping motorcycle and gear research independent.",
  path: "/affiliate-disclosure"
});

export default function AffiliateDisclosurePage() {
  return <section className="page shell policy-page">
    <div className="page-head"><h1>Affiliate disclosure</h1><p>MotoIndex PH may earn a commission when you follow a clearly identified affiliate link and complete an eligible purchase. This does not increase the price you pay.</p></div>
    <div className="policy-copy">
      <h2>How affiliate links are used</h2><p>Affiliate links are placed on product and fitment pages where a visitor is already evaluating gear or accessories. They are not used as evidence that a product is better, safer or more compatible than another product.</p>
      <h2>Recommendations remain independent</h2><p>Product rankings, fitment notes, safety checks and editorial conclusions are based on the data and sourcing described in our methodology. Whether a merchant or affiliate network pays a commission does not change those conclusions.</p>
      <h2>Marketplace prices and stock change</h2><p>MotoIndex does not present an affiliate link as proof of a live price or current inventory. Always confirm the exact seller, model, size, certification, compatibility, shipping terms and final price on the destination marketplace before purchasing.</p>
      <h2>Affiliate networks and routing</h2><p>A marketplace offer may use a direct merchant affiliate link or an approved tracking network such as Involve Asia. MotoIndex keeps the visible shopping action provider-neutral so the research experience does not depend on which network tracks the purchase.</p>
      <h2>How links are labeled</h2><p>Affiliate links are routed through MotoIndex so outbound clicks can be measured. They are marked as sponsored/nofollow links and the redirect routes are excluded from search crawling.</p>
      <p><Link className="text-link" href="/editorial-policy">Read the editorial policy →</Link> <Link className="text-link" href="/methodology">Read the research methodology →</Link></p>
    </div>
  </section>;
}

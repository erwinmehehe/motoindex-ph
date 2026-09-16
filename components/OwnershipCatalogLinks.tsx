import Link from "next/link";

export function OwnershipCatalogLinks({ hasHelmetGuide = false }: { hasHelmetGuide?: boolean }) {
  return <div className="entity-tool-grid ownership-catalog-links" aria-label="Continue ownership gear research">
    <Link href="/tires"><span>Need more tire options?</span><strong>Browse all motorcycle tires</strong><small>Compare verified tire records beyond the model-specific fitment cards shown here.</small></Link>
    <Link href="/accessories/top-box"><span>Need more luggage options?</span><strong>Browse all top boxes</strong><small>Compare capacities and product records, then confirm the rack and mounting hardware for your motorcycle.</small></Link>
    <Link href={hasHelmetGuide ? "#gear" : "/gear/helmets"}><span>Complete the rider setup</span><strong>{hasHelmetGuide ? "See helmet options for this rider profile" : "Browse motorcycle helmets"}</strong><small>Choose helmets by head fit, certification evidence and riding use, not motorcycle fitment.</small></Link>
  </div>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UsedListingInquiryForm } from "@/components/UsedListingInquiryForm";
import { CTAGroup, InfoPanel, PageHero, StatRow } from "@/components/ui";
import { getModelById } from "@/lib/data";
import { getVerifiedUsedListingById } from "@/lib/persistentUsedListings";
import { php } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Used Motorcycle Listing | MotoIndex Philippines",
  description: "View a moderated owner-submitted used motorcycle listing and contact the seller through MotoIndex.",
  robots: { index: false, follow: true, noarchive: true },
};

export default async function UsedListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getVerifiedUsedListingById(id);
  if (!listing || !listing.contactAvailable) notFound();

  const model = getModelById(listing.modelExternalId);
  const modelHref = model ? `/motorcycles/${model.makeSlug}/${model.slug}` : "/used-motorcycles";
  const posted = new Date(listing.postedAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });

  return <main className="page shell">
    <PageHero
      kicker="Owner-submitted used motorcycle"
      title={listing.title}
      description={`${listing.location} · ${listing.mileageKm.toLocaleString("en-PH")} km · ${listing.condition} condition`}
      actions={<CTAGroup><a className="button" href="#contact-seller">Contact seller</a><Link className="button secondary" href={modelHref}>Research this model</Link></CTAGroup>}
    />

    <StatRow items={[
      { label: "Asking price", value: php(listing.askingPricePhp), note: "Seller asking price, not an appraisal" },
      { label: "Mileage", value: `${listing.mileageKm.toLocaleString("en-PH")} km`, note: "Owner-submitted odometer reading" },
      { label: "Model year", value: String(listing.modelYear), note: `Listed ${posted}` },
    ]} />

    <InfoPanel>
      <h2>What MotoIndex reviewed</h2>
      <p>This listing passed MotoIndex publication review for required listing fields and a matched MotoIndex motorcycle model. MotoIndex does not certify ownership, identity, mileage, mechanical condition, service history or document authenticity. Inspect the motorcycle and original paperwork before paying or transferring money.</p>
    </InfoPanel>

    <section className="section">
      <div className="section-head">
        <div>
          <span className="field-label">Listing details</span>
          <h2>{listing.title}</h2>
          <p>Private owner · {listing.location}</p>
        </div>
      </div>
      <div className="spec-grid">
        <div><span>Asking price</span><strong>{php(listing.askingPricePhp)}</strong><small>Seller asking price</small></div>
        <div><span>Condition</span><strong>{listing.condition}</strong><small>Seller-selected condition</small></div>
        <div><span>Mileage</span><strong>{listing.mileageKm.toLocaleString("en-PH")} km</strong><small>Verify against the motorcycle and records</small></div>
        <div><span>Location</span><strong>{listing.location}</strong><small>Arrange inspection directly with the seller</small></div>
      </div>
    </section>

    <section className="section" id="contact-seller">
      <UsedListingInquiryForm listingId={listing.id} listingTitle={listing.title} />
    </section>

    <InfoPanel subtle>
      <h3>Before meeting or paying</h3>
      <p>Verify the seller&apos;s identity, original OR/CR and transfer documents, LTO registration details, frame and engine numbers, mileage, physical condition and service evidence. Do not send deposits only because a listing appears on MotoIndex.</p>
    </InfoPanel>
  </main>;
}

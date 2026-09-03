import { permanentRedirect } from "next/navigation";

export default async function ConsolidatedFitmentRoute({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  permanentRedirect(`/motorcycles/${make}/${slug}#tires-fitment`);
}

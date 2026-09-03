import { permanentRedirect } from "next/navigation";

export default async function ConsolidatedModelRoute({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  permanentRedirect(`/motorcycles/${make}/${slug}#ownership`);
}

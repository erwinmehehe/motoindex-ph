import { permanentRedirect } from "next/navigation";
import { getModel } from "@/lib/data";
import { isGlobalOnlyModel } from "@/lib/marketScope";

export default async function ConsolidatedModelRoute({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  const anchor = model && isGlobalOnlyModel(model) ? "" : "#price";
  permanentRedirect(`/motorcycles/${make}/${slug}${anchor}`);
}

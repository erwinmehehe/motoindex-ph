import { permanentRedirect } from "next/navigation";
import { getModel } from "@/lib/data";
import { getModelGearGuide } from "@/lib/modelGearGuides";

export default async function ConsolidatedModelRoute({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  const anchor = model && getModelGearGuide(model.id) ? "gear" : "tires-fitment";
  permanentRedirect(`/motorcycles/${make}/${slug}#${anchor}`);
}

import { permanentRedirect } from "next/navigation";

export default async function ConsolidatedBrandScooterRoute({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  permanentRedirect(`/motorcycles/${make}#scooters`);
}

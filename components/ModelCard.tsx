import type { Motorcycle } from "@/lib/types";
import { MotorcycleCard } from "@/components/MotorcycleCard";

export function ModelCard({ model }: { model: Motorcycle }) {
  return <MotorcycleCard model={model} variant="standard" />;
}

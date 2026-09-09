import { permanentRedirect } from "next/navigation";
import { recommendationGuides } from "@/lib/data";

export function generateStaticParams(){return recommendationGuides.map(g=>({slug:g.slug}));}

const sectionBySlug: Record<string,string> = {
  "motorcycles-under-100k":"budget",
  "automatic-motorcycles-under-100k":"budget",
  "motorcycles-100k-to-150k":"budget",
  "scooters-under-150k-philippines":"budget",
  "motorcycles-under-80k":"budget",
  "motorcycles-150k-to-250k":"budget",

  "best-scooters-philippines":"scooters",
  "maxi-scooters-philippines":"scooters",
  "125cc-scooters-philippines":"scooters",
  "150cc-scooters-philippines":"scooters",
  "160cc-scooters-philippines":"scooters",
  "automatic-motorcycles-philippines":"scooters",

  "best-motorcycles-for-daily-commute-philippines":"commuting",
  "beginner-friendly-motorcycles-philippines":"rider-fit",
  "best-motorcycles-for-short-riders":"rider-fit",
  "lightweight-motorcycles-philippines":"rider-fit",
  "best-motorcycles-for-long-rides":"long-rides",
  "fuel-efficient-motorcycles-philippines":"safety-efficiency",
  "motorcycles-with-abs-philippines":"safety-efficiency",
  "motorcycles-400cc-plus-philippines":"400cc",

  "best-underbone-motorcycles-philippines":"categories",
  "naked-motorcycles-philippines":"categories",
  "dual-sport-motorcycles-philippines":"categories",
  "adventure-touring-motorcycles-philippines":"categories",
  "sport-motorcycles-philippines":"categories",
  "motorcycles-under-400cc-philippines":"categories",
  "cafe-racer-motorcycles-philippines":"categories",

  "yamaha-scooters-philippines":"brands",
  "honda-scooters-philippines":"brands",
  "yamaha-mio-motorcycles-philippines":"brands",
  "kawasaki-ninja-motorcycles-philippines":"brands",
  "honda-adv-motorcycles-philippines":"brands",
  "suzuki-burgman-motorcycles-philippines":"brands",
  "suzuki-raider-motorcycles-philippines":"brands",
  "ktm-duke-motorcycles-philippines":"brands",
  "cfmoto-sr-motorcycles-philippines":"brands"
};

export default async function ConsolidatedRecommendationRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const section=sectionBySlug[slug]||"categories";
  permanentRedirect(`/recommendations#${section}`);
}

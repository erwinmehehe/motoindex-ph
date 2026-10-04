import type { SellerProfile } from "@/lib/types";

export type ServiceCapability =
  | "authorized-dealer"
  | "general-service"
  | "tires"
  | "batteries"
  | "suspension"
  | "detailing"
  | "accessories";

export const SERVICE_CAPABILITIES: Array<{ id: ServiceCapability; label: string; description: string }> = [
  { id:"authorized-dealer", label:"Authorized dealer / 3S", description:"Brand-linked dealer locations with a checked source and service/parts coverage." },
  { id:"general-service", label:"General service", description:"Maintenance or repair service explicitly present in the checked business record." },
  { id:"tires", label:"Tires", description:"Tire service or tire retail explicitly present in the checked record." },
  { id:"batteries", label:"Batteries", description:"Battery service or battery retail explicitly present in the checked record." },
  { id:"suspension", label:"Suspension", description:"Fork, shock or suspension work explicitly present in the checked record." },
  { id:"detailing", label:"Detailing", description:"Motorcycle detailing, wash, coating or related care explicitly present in the checked record." },
  { id:"accessories", label:"Accessories", description:"Motorcycle accessories explicitly present in the checked record." },
];

export type ServiceProviderProfile = SellerProfile & {
  capabilities: ServiceCapability[];
  providerKind: "Authorized dealer" | "Independent service shop" | "Specialty retailer";
};

function searchable(profile: SellerProfile) {
  return [
    profile.type,
    profile.name,
    profile.description,
    ...profile.categories,
    ...profile.brands,
  ].join(" ").toLowerCase();
}

export function serviceCapabilitiesForSeller(profile: SellerProfile): ServiceCapability[] {
  const text = searchable(profile);
  const capabilities: ServiceCapability[] = [];

  const serviceExplicit = /\b(service|servicing|maintenance|repair|repairs|mechanic|workshop|3s)\b/i.test(text);
  const partsExplicit = /\bparts?\b/i.test(text);

  if (profile.type === "dealer" && (serviceExplicit || partsExplicit)) capabilities.push("authorized-dealer");
  if (profile.type === "service" || serviceExplicit) capabilities.push("general-service");
  if (/\b(tire|tires|tyre|tyres)\b/i.test(text)) capabilities.push("tires");
  if (/\b(battery|batteries)\b/i.test(text)) capabilities.push("batteries");
  if (/\b(suspension|fork|forks|shock|shocks|damper|dampers)\b/i.test(text)) capabilities.push("suspension");
  if (/\b(detailing|detailer|wash|ceramic|coating)\b/i.test(text)) capabilities.push("detailing");
  if (/\b(accessory|accessories)\b/i.test(text)) capabilities.push("accessories");

  return [...new Set(capabilities)];
}

export function serviceProviderKind(profile: SellerProfile): ServiceProviderProfile["providerKind"] {
  if (profile.type === "dealer") return "Authorized dealer";
  if (profile.type === "service") return "Independent service shop";
  return "Specialty retailer";
}

export function toServiceProvider(profile: SellerProfile): ServiceProviderProfile | null {
  const capabilities = serviceCapabilitiesForSeller(profile);
  if (!capabilities.length) return null;
  return { ...profile, capabilities, providerKind: serviceProviderKind(profile) };
}

export function serviceCapabilityLabel(capability: ServiceCapability) {
  return SERVICE_CAPABILITIES.find(item => item.id === capability)?.label || capability;
}

export function serviceCoverageCounts(providers: ServiceProviderProfile[]) {
  return Object.fromEntries(
    SERVICE_CAPABILITIES.map(capability => [
      capability.id,
      providers.filter(provider => provider.capabilities.includes(capability.id)).length,
    ]),
  ) as Record<ServiceCapability, number>;
}

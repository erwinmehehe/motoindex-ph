import { allVerifiedServiceCandidates } from "@/lib/persistentSellers";
import { toServiceProvider } from "@/lib/serviceCenterPolicy";

export async function allVerifiedServiceProviders() {
  const candidates = await allVerifiedServiceCandidates();
  return candidates.flatMap(profile => {
    const provider = toServiceProvider(profile);
    return provider ? [provider] : [];
  });
}

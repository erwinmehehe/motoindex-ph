import { GuideInContentAd } from "@/components/GuideInContentAd";

/**
 * Reuses MotoIndex's already configured responsive manual AdSense unit.
 * The guide unit handles client-side initialization, publisher validation,
 * strict opt-in and duplicate-initialization prevention. A separate
 * Motorcycle ad-slot identifier can be added when provisioned in AdSense.
 */
export function MotorcycleInContentAd({ nonceReady = false }: { nonceReady?: boolean }) {
  return <GuideInContentAd nonceReady={nonceReady} />;
}

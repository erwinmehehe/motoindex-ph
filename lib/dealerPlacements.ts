export type DealerPlacement = {
  sellerSlug: string;
  citySlug: string;
  brand?: string;
  startsAt: string;
  endsAt: string;
};

// Paid placement is deliberately separate from dealer verification.
// Add an entry only after a commercial placement is approved and paid.
// Keeping this list empty guarantees that verification alone never grants
// sponsored visibility.
export const dealerPlacements: DealerPlacement[] = [];

export function featuredDealerSlugsForCity(city: string, at = new Date()) {
  const time = at.getTime();
  return new Set(
    dealerPlacements
      .filter((placement) => {
        if (placement.citySlug !== city) return false;
        const startsAt = new Date(placement.startsAt).getTime();
        const endsAt = new Date(placement.endsAt).getTime();
        return Number.isFinite(startsAt) && Number.isFinite(endsAt) && startsAt <= time && time <= endsAt;
      })
      .map((placement) => placement.sellerSlug)
  );
}

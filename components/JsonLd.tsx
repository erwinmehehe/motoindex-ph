function normalizeStructuredData(value: Record<string, unknown>) {
  if (value["@type"] !== "Product" || typeof value.category !== "string" || !value.category.startsWith("Motorcycle")) return value;
  const offers = value.offers;
  if (!offers || typeof offers !== "object" || Array.isArray(offers)) return value;
  const offer = offers as Record<string, unknown>;
  // MotoIndex can show a broad manufacturer/variant price range to readers, but
  // Google says AggregateOffer should represent multiple merchant offers rather
  // than product variants. Keep exact Offer markup, but omit an ambiguous range.
  if (offer["@type"] !== "AggregateOffer") return value;
  const { offers: _offers, ...productWithoutAmbiguousOffer } = value;
  return productWithoutAmbiguousOffer;
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const normalized = Array.isArray(data)
    ? data.map(normalizeStructuredData)
    : normalizeStructuredData(data);
  if (Array.isArray(normalized) && normalized.length === 0) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(normalized) }} />;
}

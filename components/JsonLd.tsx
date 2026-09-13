function isFaqPage(value: Record<string, unknown>) {
  return value["@type"] === "FAQPage";
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const filtered = Array.isArray(data) ? data.filter((item) => !isFaqPage(item)) : isFaqPage(data) ? null : data;
  if (!filtered || (Array.isArray(filtered) && filtered.length === 0)) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(filtered) }} />;
}

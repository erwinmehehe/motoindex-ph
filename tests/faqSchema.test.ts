import { describe, expect, it } from "vitest";
import { faqPageSchema } from "../lib/structuredData";

describe("FAQ structured data", () => {
  it("maps visible FAQ content to Schema.org FAQPage entities", () => {
    const schema = faqPageSchema([
      { question: "How do I choose a helmet size?", answer: "Measure your head and use the exact model chart." },
      { question: "What marking should I check?", answer: "Inspect the applicable PS or ICC marking on the unit." },
    ]);

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I choose a helmet size?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Measure your head and use the exact model chart.",
          },
        },
        {
          "@type": "Question",
          name: "What marking should I check?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Inspect the applicable PS or ICC marking on the unit.",
          },
        },
      ],
    });
  });
});

import { describe, expect, it } from "vitest";
import { editorialGuides } from "../lib/editorialGuides";
import { ownershipGuides } from "../lib/ownershipGuides";
import { recommendationGuides } from "../lib/data";
import {
  recommendationLeadQuestions,
  editorialLeadQuestions,
  ownershipLeadQuestions,
  ownershipLeadAnswers
} from "../lib/aeoContent";
import { faqPageSchema } from "../lib/structuredData";

describe("answer-first coverage of all canonical MotoIndex guide collections", () => {
  it("includes a relevant question for every recommendation guide", () => {
    expect(Object.keys(recommendationLeadQuestions).sort()).toEqual(recommendationGuides.map((guide) => guide.slug).sort());
    for (const guide of recommendationGuides) {
      expect(guide.directAnswer.trim().length).toBeGreaterThan(40);
      expect(recommendationLeadQuestions[guide.slug]).toMatch(/\?$/);
    }
  });

  it("covers every editorial article using its existing fact-checked intro", () => {
    expect(Object.keys(editorialLeadQuestions).sort()).toEqual(editorialGuides.map((guide) => guide.slug).sort());
    for (const guide of editorialGuides) {
      expect(guide.intro.trim().length).toBeGreaterThan(40);
      expect(guide.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.sources.length).toBeGreaterThan(0);
      expect(editorialLeadQuestions[guide.slug]).toMatch(/\?$/);
    }
  });

  it("provides source-dated answers for every ownership article", () => {
    expect(Object.keys(ownershipLeadQuestions).sort()).toEqual(ownershipGuides.map((guide) => guide.slug).sort());
    expect(Object.keys(ownershipLeadAnswers).sort()).toEqual(Object.keys(ownershipLeadQuestions).sort());
    for (const guide of ownershipGuides) {
      expect(ownershipLeadAnswers[guide.slug].trim().length).toBeGreaterThan(40);
      expect(guide.sources.length).toBeGreaterThan(0);
      expect(ownershipLeadQuestions[guide.slug]).toMatch(/\?$/);
    }
  });

  it("keeps schema answers identical to published FAQ answers", () => {
    for (const guide of editorialGuides) {
      const schema = faqPageSchema(guide.faqs);
      expect(schema.mainEntity.map((entry) => [entry.name, entry.acceptedAnswer.text]))
        .toEqual(guide.faqs.map((item) => [item.question, item.answer]));
    }
  });
});

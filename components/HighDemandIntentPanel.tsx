import type { Motorcycle } from "@/lib/types";
import { highDemandIntentProfile2026 } from "@/lib/highDemandIntentDepth2026";
import { highDemandIntentAnswers2026 } from "@/lib/highDemandIntentAnswers2026";
import { SectionHeader } from "@/components/ui";

export function HighDemandIntentPanel({ model }: { model: Motorcycle }) {
  const profile = highDemandIntentProfile2026(model.id);
  const answers = highDemandIntentAnswers2026(model);
  if (!profile || answers.length === 0) return null;

  return <section id="popular-searches" className="motorcycle-entity-section model-intent-depth">
    <SectionHeader
      kicker="Popular searches"
      title={`${model.make} ${model.model}: price, specs and key questions`}
      description="High-demand questions are answered on this canonical model page so pricing, specifications, colors and ownership research stay in one place."
    />
    <div className="entity-spec-table motorcycle-spec-table intent-answer-grid" role="list" aria-label={`${model.make} ${model.model} popular search answers`}>
      {answers.map((item) => <article role="listitem" key={item.kind}>
        <span>{item.title}</span>
        <p>{item.answer}</p>
      </article>)}
    </div>
  </section>;
}

import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import type { FaqItem } from "@/components/FaqSection";
import { QuickAnswer } from "@/components/QuickAnswer";
import { SourceRef } from "@/components/SourceRef";
import { latestPriceReference } from "@/lib/marketChecks";
import styles from "@/app/compare/[slug]/ComparisonDetailPage.module.css";

/** Server-only presentation of exactly the answers also used by FAQPage. */
export function PriorityComparisonAnswer({ items, a, b }: {
  items: FaqItem[];
  a: Motorcycle;
  b: Motorcycle;
}) {
  if (!items.length) return null;
  return <section className={styles.priorityAnswer} aria-label="Source-backed buying answers" data-priority-comparison-answer>
    <QuickAnswer variant="plain" question={items[0].question} answer={items[0].answer} />
    <div className={styles.priorityFollowups}>
      <h3>Price, equipment and variant questions</h3>
      {items.slice(1).map(item => <details key={item.question}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>)}
    </div>
    <div className={styles.prioritySources}>
      <h3>Check both model sources</h3>
      <p>Specification checks and market-price checks are different evidence types. Neither is a live dealer quote.</p>
      <ul>
        {[a, b].map(model => {
          const price = latestPriceReference(model);
          return <li key={model.id}>
            <strong>{model.make} {model.model}:</strong>{" "}
            model reference checked <time dateTime={model.verifiedAt}>{model.verifiedAt}</time>{" "}
            (<SourceRef url={model.sourceUrl} label="open source" />).
            {" "}{price.kind === "price-check"
              ? <>Latest recorded price-source check <time dateTime={price.date}>{price.date}</time>.</>
              : <>No separate dated price-source check is recorded.</>}
            {" "}<Link href={"/motorcycles/" + model.makeSlug + "/" + model.slug + "#price"}>Full price and trim sources →</Link>
          </li>;
        })}
      </ul>
    </div>
  </section>;
}

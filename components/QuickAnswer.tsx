import type { ReactNode } from "react";
import styles from "./QuickAnswer.module.css";

type Props = {
  question: string;
  answer: string;
  checkedAt?: string;
  variant?: "default" | "plain";
  children?: ReactNode;
};

/** Visible, server-rendered summary. No hidden text or schema-only claims. */
export function QuickAnswer({ question, answer, checkedAt, variant = "default", children }: Props) {
  return <section className={variant === "plain" ? styles.plain : styles.block} aria-label="Quick answer" data-aeo-quick-answer>
    <div className={styles.meta}>
      <span>Quick answer</span>
      {checkedAt && <small>Sources checked <time dateTime={checkedAt}>{checkedAt}</time></small>}
    </div>
    <h2 className={styles.question}>{question}</h2>
    <p className={styles.answer}>{answer}</p>
    {children}
  </section>;
}

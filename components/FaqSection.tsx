export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection({ title = "Frequently asked questions", items }: { title?: string; items: FaqItem[] }) {
  return <section className="faq-section" aria-labelledby="faq-heading">
    <div className="section-head compact"><div><h2 id="faq-heading">{title}</h2></div></div>
    <div className="faq-list">
      {items.map((item) => <details key={item.question}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>)}
    </div>
  </section>;
}

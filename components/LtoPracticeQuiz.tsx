"use client";
import { useState } from "react";
import { ltoPracticeQuestions } from "@/lib/ltoPracticeQuestions";
import styles from "./TransportGuideExtras.module.css";

export function LtoPracticeQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const total = ltoPracticeQuestions.length;
  const score = ltoPracticeQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  return <section className={styles.quizSection} aria-labelledby="lto-quiz-title" data-lto-practice-quiz>
    <div className="section-head compact"><div><span className="section-kicker">Interactive study tool</span>
      <h2 id="lto-quiz-title">LTO reviewer: 12 original practice questions</h2>
      <p>General rules and safe-driving scenarios, not the official LTO question bank. Your answers stay in this browser session.</p>
    </div></div>
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <p className={styles.progress} aria-live="polite">{answered} of {total} answered</p>
      <div className={styles.quizStack}>{ltoPracticeQuestions.map((q, index) => <fieldset className={styles.quizQuestion} key={q.id}>
        <legend><span>Question {index + 1}</span>{q.question}</legend>
        <div className={styles.quizOptions}>{q.options.map((option, i) => <label key={option} className={styles.quizOption}>
          <input type="radio" name={q.id} value={i} checked={answers[q.id] === i} onChange={() => { setAnswers((current) => ({ ...current, [q.id]: i })); setSubmitted(false); }} />
          <span>{option}</span>
        </label>)}</div>
        {submitted && <p className={answers[q.id] === q.correctIndex ? styles.correct : styles.incorrect} role="status">
          <strong>{answers[q.id] === undefined ? "Not answered" : answers[q.id] === q.correctIndex ? "Correct" : "Review this topic"}.</strong> {q.explanation}
        </p>}
      </fieldset>)}</div>
      <div className={styles.quizActions}>
        <button type="submit" className="button">Check answers</button>
        <button type="button" className="button secondary" onClick={() => { setAnswers({}); setSubmitted(false); }}>Try again</button>
      </div>
      {submitted && <p className={styles.quizResult} role="status" aria-live="polite">You answered {score} of {total} correctly. {answered < total ? `You skipped ${total - answered} questions. ` : ""}Review the explanations and official LTO lessons before your exam.</p>}
    </form>
  </section>;
}

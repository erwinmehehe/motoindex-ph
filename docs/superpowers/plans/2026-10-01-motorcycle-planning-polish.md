# Motorcycle Planning Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make financing follow-ups, rider fit, and ownership sections feel like one polished motorcycle decision system while stabilizing browser QA startup.

**Architecture:** Keep existing shared React components and calculations intact. Add scoped shared styles and browser assertions for every motorcycle detail page, then harden Chrome startup with diagnostic output and a longer condition-based readiness window.

**Tech Stack:** Next.js 15, React 19, CSS, Node.js CDP QA scripts, GitHub Actions.

**Spec:** User-approved direction in this conversation.

## Global Constraints

- Preserve calculator behavior, content, links, source notes, and responsive accessibility.
- Apply through shared motorcycle components, never a model-specific override.
- Stay within the 460 KB compiled CSS budget.
- Verify at 390, 768, 1024, and 1254/1440 widths.

## Review Focus

- Models with no dealer observations still render clean financing flow.
- One-variant and multi-variant models retain readable scenario cards.
- Rider-fit controls remain operable at 390 px with no horizontal overflow.
- Ownership cards stack without oversized empty regions.
- Chrome startup failure reports process exit and stderr rather than a generic timeout.

---

### Task 1: Shared planning-section visual system

**Files:**
- Modify: `app/styles/calculator-system.css`
- Modify: `app/globals.css`
- Modify: `scripts/priority-model-commercial-qa.mjs`
- Create: `scripts/validate-motorcycle-planning-sections.mjs`

**Interfaces:**
- Consumes: existing `.finance-scenario-section`, `[data-calculator="rider-fit"]`, and `.commute-snapshot` markup.
- Produces: consistent card hierarchy and responsive behavior across motorcycle detail pages.

- [ ] Write browser assertions for scenario-card surfaces, rider-fit stacking, ownership KPI cards, and overflow.
- [ ] Run the assertions against current production styles and confirm the intended failures.
- [ ] Add scoped shared styles without altering calculations or copy.
- [ ] Run browser assertions, design lint, typecheck, and CSS performance budget.
- [ ] Commit the visual system.

### Task 2: Chrome startup diagnostics and resilience

**Files:**
- Create: `scripts/chrome-debug.mjs`
- Modify: `scripts/visual-qa.mjs`
- Modify: browser-QA scripts using duplicated Chrome startup waits.
- Modify: `.github/workflows/visual-qa.yml`

**Interfaces:**
- Produces: `waitForChromeDebug({ browser, port, timeoutMs })` with early-exit diagnostics and condition-based polling.

- [ ] Add a failing unit-style script for early process exit and delayed readiness.
- [ ] Implement the shared startup helper and migrate visual QA entry points.
- [ ] Run the helper test and representative browser QA locally.
- [ ] Run lint, typecheck, build, and final regression checks.
- [ ] Commit the CI hardening.


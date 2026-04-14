---
name: teachback
description: "Use when the user wants a code-change walkthrough, diff review, or PR explanation. Covers reviewer-style summary, old vs new behavior, why each hunk exists, and concise engineer knowledge transfer."
targets: ["*"]
tags: [review, diff, teachback, knowledge-transfer]
contracts:
  requires:
    change_target: string
  produces:
    review_output: markdown
    residual_risks: markdown
    key_takeaways: markdown
argument-hint: "[--scope|--s staged|working|commit:<sha>|range:<base>..<head>|files:<paths...>] [--mode|--m review|teachback|combined] [--audience|--a engineer|approver|manager|onboarding] [--evidence|--e minimal|standard|strict] [--risk|--r brief|full|only] [--flow] [--idea-shifts on|off] [--line-refs|--lr on|off] [--brief|--deep] <review request>"
---

# Teachback

Explain a concrete change set so someone can both **review it** and **learn from it**.

## Purpose
- give an approver-friendly summary of what changed and why
- explain old behavior, new behavior, and why the change matters
- keep explanation grounded in the actual diff, nearby code, and tests

Default behavior:
- `--mode combined`
- `--audience engineer`
- `--scope staged`, then `working` if staged is empty
- `--evidence standard`
- `--risk brief`
- `--idea-shifts on`
- `--line-refs on` when references are available

## Trigger
Use this when the user asks for:
- a diff review, PR review, or change review
- a walkthrough of changed lines
- knowledge transfer on a bug fix or refactor
- explanation of old vs new behavior for a specific change set

## Exceptions
Do not use this when:
- the user only wants implementation
- there is no inspectable diff, file list, or change target
- the user wants a broad architecture deep dive unrelated to a specific change

If the user wants a **strict approval packet**, structured review artifact, or lead/reviewer gating output, escalate to `approver-packet`.

## Guidelines
- Start from the narrowest real source of truth: explicit files, staged diff, working diff, commit, or range.
- Explain only changed code plus the minimum nearby context needed.
- Distinguish **Fact** from **Inference** when intent or impact is uncertain.
- Use tests as proof when available.
- Prefer deterministic section ordering over free-form narration.
- Highlight idea-level changes, not just line-level edits, when a meaningful conceptual shift occurred.
- Treat **idea shifts** and **concepts** as related but distinct:
  - **idea shift** = what changed in the team's thinking or approach
  - **concept / design principle** = the reusable engineering principle behind that shift

## Feature flags

### `--scope` / `--s`
- `staged`
- `working`
- `commit:<sha>`
- `range:<base>..<head>`
- `files:<paths...>`

### `--mode` / `--m`
- `review` — reviewer-style diff review only
- `teachback` — learning-oriented walkthrough only
- `combined` — review first, then teachback

### `--audience` / `--a`
- `engineer`
- `approver`
- `manager`
- `onboarding`

### `--evidence` / `--e`
- `minimal`
- `standard`
- `strict`

### `--risk` / `--r`
- `brief`
- `full`
- `only`

### `--flow`
Add end-to-end runtime or state flow when the change touches behavior across layers.

### `--idea-shifts`
- `on` — explain conceptual or mental-model changes alongside code changes
- `off` — focus on code and behavior only

### `--line-refs` / `--lr`
- `on`
- `off`

## Core workflow

### 1. Ground the change
- identify changed files and hunks
- read enough surrounding code to explain intent
- separate behavior, tests, docs, and refactor-only edits

### 2. Explain the change
For each meaningful hunk, cover:
- what changed
- old behavior
- new behavior
- why this hunk exists
- what would break if removed

### 2.5 Explain the idea shift
When `--idea-shifts on` and a meaningful conceptual change exists, also cover:
- old mental model
- new mental model
- why the old idea failed or became insufficient
- what idea changed in the team's reasoning
- what concept or design principle the new approach reflects
- which lines or hunks embody that shift

### 3. Add proof and risk
When relevant, include:
- what tests prove
- why this layer was changed
- residual risk
- rollback impact
- follow-up work

### 4. Match requested flags
- shape the response by `--mode`, `--audience`, and `--risk`
- raise or lower proof detail with `--evidence`
- include flow only when requested or clearly helpful
- include references only when `--line-refs on`

## Canonical output shape
Prefer this order unless the user asks for something else:
1. Summary
2. Change scope
3. Review section
4. Teachback section
5. `## Idea shifts`
6. `## Concepts / principles`
7. Tests and evidence
8. Risks / rollback / follow-ups
9. Key takeaways

Mode adjustments:
- `review`: omit teachback section
- `teachback`: keep summary, teachback, evidence, takeaways
- `risk only`: output only risks, rollback, follow-ups

## Quick recipes

### Review
- summary
- changed files
- hunk notes
- risks / follow-ups

### Teachback
- big picture
- old vs new behavior by hunk
- what matters and what breaks if removed

### Idea shifts
- old idea / mental model
- new idea / mental model
- why the shift was necessary
- concept or design principle behind the shift
- lines or hunks that embody the shift

Make this distinction explicit for the user:
- **Idea shift** = what changed in our thinking
- **Concept / principle** = the general lesson or abstraction this change demonstrates

Preferred subsection labels:
- `## Idea shifts`
- `## Concepts / principles`

### Combined
- review first
- teachback second
- idea shifts third when applicable
- end with evidence and takeaways

## No-diff fallback
If no concrete change target is provided:
1. try staged diff
2. then working diff
3. then ask for explicit files, commit, or range
4. do not invent a teachback without inspectable source material

## Requires
- `change_target`: string — staged diff, working diff, commit, range, PR diff, or file list

## Produces
- `review_output`: markdown — review, teachback, or combined explanation
- `residual_risks`: markdown — risk and follow-up notes
- `key_takeaways`: markdown — concise engineering lessons

## Prompt templates
For reusable prompts, see:
- `references/prompt-templates.md`

## Final checklist
- [ ] Concrete change target identified
- [ ] Big-picture summary given
- [ ] Meaningful hunks explained
- [ ] Old vs new behavior described
- [ ] Tests used as evidence when available
- [ ] Risks / follow-ups called out

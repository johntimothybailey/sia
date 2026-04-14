---
name: approver-packet
description: "Use when the user wants a strict approval packet for a code change: recommendation, scope, evidence, residual risk, rollback impact, and required follow-ups in a compact reviewer-facing format."
targets: ["*"]
tags: [review, approval, risk, evidence, structured-output]
contracts:
  requires:
    change_target: string
  produces:
    approval_recommendation: string
    review_packet: markdown
    residual_risks: markdown
    structured_review: yaml
argument-hint: "[--scope|--s staged|working|commit:<sha>|range:<base>..<head>|files:<paths...>] [--audience|--a approver|manager|engineer] [--evidence|--e standard|strict] [--format prose|schema|both] [--risk|--r brief|full|only] [--line-refs|--lr on|off] <approval request>"
---

# Approver Packet

Produce a compact, decision-first review artifact for leads, approvers, or automated review handoffs.

## Purpose
- state whether the change should be approved, commented on, or sent back
- show what evidence supports that decision
- highlight residual risks, rollback impact, and missing proof
- preserve important idea shifts and concepts when they materially affect review confidence or future handoff quality
- optionally emit a machine-readable schema for downstream tooling

Default behavior:
- `--scope staged`, then `working` if staged is empty
- `--audience approver`
- `--evidence strict`
- `--format prose`
- `--risk full`
- `--line-refs on`

## Trigger
Use this when the user asks for:
- an approval packet
- a strict PR review
- a lead/reviewer signoff artifact
- recommendation + proof + rollback + follow-ups
- structured review output for tooling or gating

## Exceptions
Do not use this when:
- the user wants a broad walkthrough or pairing-style teachback without approval focus
- there is no inspectable change target

If the user mainly wants learning, explanation, or hunk-by-hunk teaching, use `teachback`.

## Guidelines
- be decision-first and concise
- separate **Fact** from **Inference**
- treat tests, logs, and static checks as evidence
- call out missing proof explicitly
- when relevant, capture:
  - **idea shift** = what changed in the author's/team's thinking
  - **concept / principle** = the broader engineering lesson behind the change
- do not pad the packet with long teachback prose unless asked

## Feature flags

### `--scope` / `--s`
- `staged`
- `working`
- `commit:<sha>`
- `range:<base>..<head>`
- `files:<paths...>`

### `--audience` / `--a`
- `approver`
- `manager`
- `engineer`

### `--evidence` / `--e`
- `standard`
- `strict`

### `--format`
- `prose` — reviewer-facing packet only
- `schema` — machine-readable packet only
- `both` — prose packet followed by schema

### `--risk` / `--r`
- `brief`
- `full`
- `only`

### `--line-refs` / `--lr`
- `on`
- `off`

## Core workflow

### 1. Ground the change
- identify the exact change target
- read the diff and only enough nearby context to justify the decision
- note tests, diagnostics, or missing coverage

### 2. Decide
Choose one:
- `approve`
- `request_changes`
- `comment`
- `n/a`

### 3. Build the packet
Always cover:
1. Recommendation
2. Scope
3. Evidence
4. Residual risks
5. Rollback impact
6. Required follow-ups or missing proof

When material to understanding or approval, also include:
7. Idea shifts
8. Concepts / principles

### 4. Emit schema when requested
If `--format schema` or `--format both`, map the packet into the output schema below.

## Canonical prose shape
1. Recommendation
2. Scope
3. Evidence
4. Risks
5. Rollback
6. Follow-ups / missing proof

If idea-level changes matter for approval or handoff clarity, add:
7. `## Idea shifts`
8. `## Concepts / principles`

Preferred subsection labels:
- `## Idea shifts`
- `## Concepts / principles`

If `--risk only`, output only risks, rollback, and follow-ups.

## Output schema

```yaml
recommendation: approve|request_changes|comment|n_a
scope:
  scope_mode: staged|working|commit|range|files
  target: string
  files: [string]
evidence:
  level: standard|strict
  facts: [string]
  tests: [string]
  diagnostics: [string]
  missing_proof: [string]
risks:
  residual_risks: [string]
  rollback_impact: string
  follow_ups: [string]
references:
  line_refs: [string]
handoff:
  idea_shifts: [string]
  concepts: [string]
```

## No-diff fallback
If no concrete change target is available:
1. try staged diff
2. then working diff
3. then ask for explicit files, commit, or range
4. do not emit an approval recommendation without inspectable source material

## Requires
- `change_target`: string — staged diff, working diff, commit, range, PR diff, or file list

## Produces
- `approval_recommendation`: string — approve, request changes, comment, or n/a
- `review_packet`: markdown — compact decision-first packet
- `residual_risks`: markdown — risks, rollback, follow-ups
- `structured_review`: yaml — schema output when requested

## Prompt templates
For reusable prompts, see:
- `references/prompt-templates.md`

## Final checklist
- [ ] Concrete change target identified
- [ ] Recommendation stated
- [ ] Evidence cited
- [ ] Risks and rollback covered
- [ ] Missing proof called out when applicable

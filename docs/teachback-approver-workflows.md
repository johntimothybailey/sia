# Teachback + Approver Packet Workflows

This document explains when to use `teachback`, when to use `approver-packet`, and how to use them together.

## Quick decision guide

Use **`teachback`** when you want:
- a diff review
- a PR walkthrough
- old vs new behavior explained
- knowledge transfer for engineers
- pairing-style explanation of a bug fix or refactor

Use **`approver-packet`** when you want:
- a strict approval recommendation
- evidence, residual risk, rollback impact, and follow-ups
- a compact reviewer artifact for leads or managers
- structured schema output for downstream tooling

Use **both together** when you want:
1. an engineer to understand the change deeply, and then
2. a lead or reviewer to decide whether it is ready for approval

---

## Separate workflows

### Workflow A — `teachback` only

Best for:
- engineers reviewing a change together
- onboarding and knowledge transfer
- explaining a bug fix end to end

Typical flow:
1. identify the change target (`staged`, `working`, commit, range, or files)
2. run `teachback`
3. review:
   - summary
   - hunk-level explanation
   - old vs new behavior
   - tests and evidence
   - residual risk

Example prompts:

```text
Use teachback on my current diff and give me both a reviewer-style diff review and a teachback walkthrough.
```

```text
Use teachback with --m teachback --flow --e strict on this bug fix and explain the old behavior, new behavior, and what the tests prove.
```

### Workflow B — `approver-packet` only

Best for:
- approval gates
- signoff reviews
- leads or managers who need a decision-first artifact
- tooling that wants schema output

Typical flow:
1. identify the change target
2. run `approver-packet`
3. review:
   - recommendation
   - scope
   - evidence
   - risks
   - rollback
   - follow-ups / missing proof

Example prompts:

```text
Use approver-packet on my staged diff and give me recommendation, scope, evidence, residual risk, rollback impact, and follow-ups.
```

```text
Use approver-packet with --format schema on my current diff and return only the documented schema.
```

---

## Combined workflow

### Workflow C — Understand first, approve second

This is the recommended sequence when a team wants both learning and rigor.

#### Step 1: run `teachback`
Use it to understand:
- what changed
- why it changed
- what would break if removed
- what the tests prove

Example:

```text
Use teachback with --s range:main..HEAD --m combined --e strict and review this branch for both approval and learning.
```

#### Step 2: run `approver-packet`
Use it after the walkthrough to compress the review into an approval artifact.

When handing off from `teachback`, preserve two distinct layers:
- **Idea shifts** — what changed in the team's thinking
- **Concepts / principles** — the reusable engineering lessons behind those shifts

Example:

```text
Use approver-packet with --s range:main..HEAD --e strict on the same branch and tell me whether it is ready for approval. Preserve the key idea shifts and concepts from the teachback in the packet.
```

This two-step flow works well when:
- an engineer needs understanding first
- a tech lead needs a final decision packet second
- the review may later be consumed by tooling or copied into a PR summary

---

## Handoff rules

### Escalate from `teachback` to `approver-packet` when:
- the user asks for a recommendation or signoff
- the review must be compact and decision-first
- rollback impact matters
- follow-ups and missing proof need explicit tracking
- the output must be machine-readable
- the idea shifts or concepts need to survive the handoff into a reviewer artifact

### Stay in `teachback` when:
- the user mainly wants explanation
- the main goal is learning or pairing
- the review should remain conversational and hunk-oriented

### Start directly with `approver-packet` when:
- the audience is an approver, manager, or reviewer
- the user already understands the change
- the output is meant for a gate, checklist, or structured handoff

---

## Suggested team patterns

### Engineer + lead
1. Engineer runs `teachback`
2. Lead runs `approver-packet`

### Author self-review
1. Run `teachback` to catch explanation gaps
2. Run `approver-packet` to pressure-test approval readiness

### PR prep
1. Run `teachback` for the narrative
2. Run `approver-packet --format both` for the signoff summary plus schema

---

## Summary

- `teachback` = understand the change
- `approver-packet` = decide whether the change is approval-ready
- together = strong engineer knowledge transfer plus strict reviewer output, with idea shifts and concepts preserved across the handoff

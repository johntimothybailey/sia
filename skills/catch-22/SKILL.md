---
name: catch-22
version: 1.1.0
author: johnbailey
tags: [review, correctness, prisma, security]
description: Reviews uncommitted changes and branch-vs-base diffs like a strict automated reviewer, focusing on the kinds of issues Cursor Bot or Greptile are likely to flag before CI/CD. Use when the user asks for early review, pre-CI feedback, uncommitted-change review, Greptile-style review, Cursor Bot-style review, or wants to catch issues before the pipeline does.
---

<!-- Modified: 2026-03-24 | Author: johnbailey | Rationale: Added count-include-mismatch and count-vs-collection-drift to catch discrepancies between count filters and included record filters (e.g., uploadCompleted: true in _count but missing in include), preventing UI/data-consistency bugs. Previous additions: parsing-precedence-shadowing, cache-key-desync, mutation-query-mapping, orphaned-duplicate-state, query-enabled leakage, post-success simulation, and unidirectional cleanup checks. -->

# Catch 22

## Purpose
Use this skill to pressure-test current changes before CI/CD or automated review catches them.

Default goal:
- find issues that Cursor Bot or Greptile would plausibly comment on
- prioritize correctness, regressions, contract drift, tests, and maintainability issues that increase merge risk
- recommend a concrete change for every issue
- ask for clarification only when missing context blocks a reliable review

## Canonical Review Prompt
Use this intent when running the skill:

> Review my current changes like a strict automated reviewer. Check both the branch-vs-base diff and the uncommitted/staged changes when available. Focus on issues Cursor Bot or Greptile are likely to catch, especially correctness bugs, regressions, missing tests, null or type-safety mistakes, API or schema drift, CI/CD breakage, and maintainability problems that obscure intent or create future risk. Be critical. For every issue, recommend a concrete change. Ask clarifying questions only when scope, baseline, or intended behavior is unclear.

## Review Scope
Prefer this order:

1. Review `branch-vs-base` diff to approximate what CI and automated review will see.
2. Review staged and unstaged changes to catch issues before commit.
3. If only one scope is available, proceed with that scope and state the limitation.

If a git baseline is unavailable, fall back to the working tree and explicitly say that branch-level CI risk may be under-sampled.

## Deterministic Gates First
Before leaning on judgment-heavy review, check for cheap, high-confidence failure signals when they are available.

Prioritize:
- typecheck or compiler errors
- lint failures with real correctness or merge-blocking impact
- build failures
- failing tests tied to changed behavior
- unresolved imports, renamed symbols, missing exports, or stale references after refactors

If command output, diagnostics, or CI logs are provided, treat them as primary evidence and surface them before more speculative findings.
If these gates are not available to run, inspect the diff specifically for refactor fallout such as orphaned references, renamed functions not updated at call sites, or deleted symbols still in use.

## Context Sources
Before reviewing, load any repo-specific review context that would change what these tools flag.

Check for:
- root or nested `.cursor/BUGBOT.md` files near changed files
- `greptile.json` or similar Greptile review configuration if present
- nearby tests, validators, schemas, contracts, and config files tied to the changed code

If no tool-specific rule files exist, continue without them and say nothing unless the absence creates meaningful uncertainty.

## Clarification Handshake
Ask at most one question at a time, and only if the answer would materially change the review quality.

Ask when:
- the repo or diff scope is unclear
- the base branch cannot be inferred for branch-vs-base review
- the intended behavior, contract, or migration expectation is ambiguous
- generated, vendored, or snapshot-heavy files dominate the diff and should possibly be excluded

Do not ask when:
- you can make a reasonable default assumption and state it
- the question is only about presentation style
- the missing detail does not affect whether something is a plausible issue

Preferred questions:
- `Which base branch should I compare against?`
- `What behavior is intended here?`
- `Should generated files be excluded from the review?`

## Primary Review Lens
Bias toward issues automated reviewers commonly flag:

- correctness bugs and behavioral regressions
- null, undefined, optional, or empty-state handling mistakes
- type, schema, API, or contract mismatches
- compiler-visible mistakes such as missing names, unresolved imports, stale exports, and refactor fallout
- missing validation, auth, authorization, or permission checks
- async, race, retry, timeout, or cleanup mistakes
- UI state bugs caused by partial async data, staged query resolution, memo recomputation, or reset-on-reload behavior
- stale ephemeral UI state that is consumed once but not cleared, causing hidden refetches, reinitialization, or drift after success
- query enabled-state leakage: check queries that are gated by local state (e.g., `enabled: !!id`). Ensure that state is cleared once the data is consumed, otherwise the query remains active, wasting resources and risking UI jumps during background refetches.
- data integrity and migration safety risks
- missing or insufficient test coverage for changed behavior
- dead code, unused logic, stale comments, and misleading naming
- maintainability issues that make the change hard to reason about or easy to break
- likely CI/CD failures such as lint, typecheck, build, test, or config regressions
- portability or semantic traps where SQL, ORM, driver, or framework behavior is correct only in the current environment
- mutation-query-mapping: for every changed mutation, identify the data entities it affects and ensure all corresponding fetching queries (especially those in sidebars, headers, or parent layouts) are invalidated or updated. Do not assume an existing invalidation call is correct if the underlying query procedure has been refactored.
- count-include-mismatch: for every entity that includes both a count (e.g., `_count`) and a list of related records, verify that filters (such as `where: { uploadCompleted: true }`, `deletedAt: null`, or `status: 'published'`) are consistent across both. Discrepancies cause UI flickering, incorrect progress indicators, and exposure of incomplete or private data.

Do not inflate weak style nits into findings unless they are likely to trigger an automated comment or meaningfully increase delivery risk.

Prefer findings that survive light adversarial checking:
- trace changed functions, types, queries, and config into immediate call sites or downstream usage
- look for inconsistencies between changed code and untouched helpers, schemas, tests, or docs that still encode the old behavior
- inspect query construction, interpolation, parameter binding, wildcard handling, and operator semantics instead of assuming passing tests prove the implementation is robust
- check whether edits introduced stale identifiers or references that a compiler or typechecker would reject immediately
- simulate partial-loading timelines: what happens when one async input resolves before another and derived state computes too early
- check whether temporary state, target IDs, selection seeds, or "pending navigation" flags are cleared after the success path, not only on failure or route change
- avoid duplicate findings or comments that only restate obvious lint output without additional insight

## Common Blind Spots To Counteract
Actively defend against these review failures:

- `pass-is-proof`: a passing test or successful local run does not prove the implementation is robust, portable, or semantically correct
- `architectural tunnel vision`: do not focus so hard on high-level design traps that you miss local correctness bugs in otherwise ordinary-looking code
- `syntactically valid but semantically brittle`: code can be valid TypeScript, SQL, or ORM usage while still depending on driver-specific, dialect-specific, or serialization-specific behavior
- `steady-state bias`: do not review only the final rendered state; inspect transient states while data loads, effects fire, and memoized values recompute
- `single-shot side effect loss`: when a highlight, scroll, focus, localStorage consume, or cursor seed is used once, check whether a later reset invalidates it without replaying the side effect
- `success-without-cleanup`: one-time intent state may be set correctly, consumed correctly, and still be buggy because it remains live after success
- `orphaned-duplicate-state`: when syncing a "one-shot" value from a global source (localStorage, URL, or Context) into a local `useState` or `useMemo`, verify that the cleanup path nullifies **both**. If the global key is cleared but the local state remains, the component stays in a "ghost" mode where queries or effects may re-trigger on subsequent renders.
- `parsing-precedence-shadowing`: in parsers, coercers, or serializers, check whether general rules (e.g., boolean or numeric coercion) are applied before more specific overrides (e.g., preserved keys, protected prefixes, or key-based type exceptions). Verify that the order of conditional branches preserves domain-specific data types.
- `count-vs-collection-drift`: do not assume that a `count` and a `list` on the same object are driven by the same implicit filters. Explicitly check the `where` clauses in both the `_count` and the `include` or `select` blocks to ensure they aren't drifting apart as new requirements are added.

When reviewing database code, string interpolation, or query builders:
- check whether wildcards, concatenation, coercion, escaping, and parameter placement happen in the application layer or in the target engine
- prefer engine-native or dialect-appropriate semantics over patterns that only appear to work in one adapter or test environment
- treat "works in SQLite/LibSQL" or similar local success as incomplete evidence unless the pattern is clearly portable by construction

When reviewing UI state derived from async data:
- check whether `useMemo`, derived props, or seed state should wait for all required inputs before becoming authoritative
- check whether recomputation changes pagination seeds, cursors, ordering, or selected IDs after initial mount
- check whether `useEffect` side effects depend on a first render state that may be invalidated by later async arrivals
- treat localStorage consumption, scroll-to-target, highlight clearing, and pagination reset as coupled behavior that can drift if executed in separate phases
- check whether enabling conditions for data fetching are tied to temporary state that should be unset after success
- check whether success clears the same state that failure paths or tab changes clear
- if a child component consumes a one-shot instruction, verify ownership of cleanup is explicit and that the parent cannot remain stuck in "targeting" mode
- `unidirectional cleanup failure`: if a child component is responsible for clearing a shared navigation intent (like a highlight), check if the parent component's local state is now out of sync. Prefer clearing state in the same component that owns the primary data-fetching logic.
- `cache-key-desync`: in mutation `onSuccess` or `onSettled` handlers, verify that the invalidated query keys (`utils.x.y.invalidate`) exactly match the query keys currently used by the UI. Specifically check for "internal" vs. "public" query variants or renamed procedures that may have left the invalidation targeting a "ghost" cache that no longer drives the UI.

## Output Contract
Present findings first, ordered by severity and likelihood of automated detection.

For every finding include:
- `title`
- `likely_reviewer`: `Cursor Bot`, `Greptile`, `Either`, or `Unclear`
- `severity`: `high`, `medium`, or `low`
- `why_it_matters`
- `evidence`
- `recommended_change`
- `confidence`: `high`, `medium`, or `low`

After findings, include:
- `Open questions` only if unresolved ambiguity remains
- `Residual risk` for anything not fully reviewable from the available diff

If there are no findings, say so explicitly and still note any coverage gaps.

## Review Behavior
- Be direct and critical.
- Prefer concrete defects over speculative architecture advice.
- Tie each recommendation to the changed code, not generic best practices.
- If multiple files contribute to one issue, consolidate them into one finding.
- If the same issue appears in several places, cite the strongest example and mention the spread.
- When a likely fix is obvious, recommend the minimal safe change.
- When confidence is limited, explain what evidence is missing instead of overstating certainty.
- If prior review comments are available, use them to avoid duplicate feedback and to refine unresolved risk.
- If tests pass but the implementation depends on brittle semantics, still raise the issue and explain why the current passing result is not sufficient proof.
- If a deterministic gate already proves the issue, do not bury it behind softer review commentary; lead with it.
- For async UI flows, reason through mount, first partial data arrival, second data arrival, and post-effect state rather than only reviewing the final steady state.
- For one-shot UI flows, reason through setup, success, cleanup, and later refetch/re-render behavior; do not stop once the happy-path action initially works.
- simulate the "10 seconds later" state: for one-shot actions (highlights, jumps, deep-links), explicitly trace what happens after the action succeeds. Is there any state left in the component tree that still thinks the action is "pending" or "active"?

## Likely Reviewer Heuristics
Use these as a bias, not a hard rule:

- `Cursor Bot`: logic bugs, edge cases, security issues, missing tests for risky behavior, and code quality problems that can lead to real defects
- `Greptile`: logic bugs, code that may not compile or run, dead or misleading code, complexity, unresolved symbols, cross-file inconsistencies, and subtle timing issues discovered by following state flow through related code
- `Either`: correctness regressions, contract drift, CI breakage, and maintainability issues with clear delivery risk
- `Unclear`: use only when the issue is real but tool attribution would be guesswork

## Output Template
Use this shape:

```markdown
## Findings

### 1. <title>
Likely reviewer: <Cursor Bot|Greptile|Either|Unclear>
Severity: <high|medium|low>
Why it matters: <impact>
Evidence: <diff-aware explanation>
Recommended change: <specific change>
Confidence: <high|medium|low>

## Open Questions
- <only if needed>

## Residual Risk
- <coverage gaps, baseline limits, or unreviewed areas>
```

## Good Defaults
If the user gives a short request like:
- `Review my uncommitted changes for anything Greptile would catch`
- `What would Cursor Bot complain about here?`
- `Give me a pre-CI review`

Then default to:
- reviewing both branch diff and working tree if possible
- surfacing only actionable findings
- recommending code changes, tests, or guardrails
- explicitly calling out missing context instead of guessing silently

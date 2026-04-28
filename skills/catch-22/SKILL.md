---
name: catch-22
version: 1.3.0
author: johnbailey
tags: [review, correctness, prisma, security, nextjs, react, typescript]
description: Reviews uncommitted changes and branch-vs-base diffs like a strict automated reviewer, focusing on the kinds of issues Cursor Bugbot, Greptile, and CodeRabbit are likely to flag before CI/CD. Use when the user asks for early review, pre-CI feedback, uncommitted-change review, or wants to catch issues before the pipeline does.
---

<!-- Modified: 2026-04-27 | Author: johnbailey | Rationale: Rewrote catch-22 as an explicit review pipeline with deterministic config/gate discovery, coverage reporting, validation rubric, and fixture-harness guidance. Qodo remains a heuristic lens only, not a parity target in pass one. -->

# Catch 22

## Purpose
Use this skill to pressure-test current changes before CI/CD or automated review catches them.

Default goal:
- emulate the local inputs and review shape that `Cursor Bugbot`, `Greptile`, and `CodeRabbit` rely on
- prioritize correctness, regressions, contract drift, tests, and maintainability issues that increase merge risk
- recommend a concrete change for every issue
- ask for clarification only when missing context blocks a reliable review

`Qodo` may still be used as a heuristic lens for race conditions, drift, and missing edge-case coverage, but pass one does **not** claim Qodo parity.

## Canonical Review Prompt
Use this intent when running the skill:

> Review my current changes like a strict automated reviewer. Check both the branch-vs-base diff and the uncommitted/staged changes when available. Follow the required catch-22 review procedure, load the applicable Cursor / Greptile / CodeRabbit review context, inspect deterministic gates when available, and validate every finding before reporting it. Focus on correctness bugs, regressions, missing tests, null or type-safety mistakes, API or schema drift, CI/CD breakage, and maintainability problems that obscure intent or create future risk. Be critical. For every issue, recommend a concrete change. Ask clarifying questions only when scope, baseline, or intended behavior is unclear.

## Required Review Procedure
Execute these steps in order. Do not skip a step silently.

1. **Detect the base branch and capture the branch-vs-base diff.** Prefer the repo's inferred default branch; if multiple plausible bases exist, ask one targeted question.
2. **Capture staged and unstaged working-tree diffs.** Review both when available; if only one exists, state the limitation.
3. **Classify changed files.** Tag file types and roles such as app code, tests, schemas, migrations, CI/workflows, configs, docs, generated artifacts, and fixtures.
4. **Load reviewer configuration.** Apply the Tool Config Discovery rules below for `Cursor Bugbot`, `Greptile`, and `CodeRabbit` before forming findings.
5. **Expand the context graph.** Trace the changed surface through imports, callers, nearby tests, schemas, routes, migrations, API/contracts, CI/workflows, and package scripts.
6. **Run deterministic gates when available.** Discover gates with the deterministic procedure below, then prefer gate-backed failures over speculation.
7. **Perform ordered review passes.** Review in this order: compile/type/runtime breakage, contract/schema drift, data/auth/security risks, async/state/cache risks, CI/config regressions, and test coverage gaps.
8. **Validate findings adversarially before reporting.** Apply the Finding Validation Rubric, remove duplicate or weak findings, and emit the required Coverage Matrix.

If a git baseline is unavailable, fall back to the working tree and explicitly say that branch-level CI risk may be under-sampled.

## Review Scope
Prefer this order:

1. Review `branch-vs-base` diff to approximate what CI and automated review will see.
2. Review staged and unstaged changes to catch issues before commit.
3. If only one scope is available, proceed with that scope and state the limitation.

## Tool Config Discovery
Load repo-specific review context that would materially change what automated reviewers flag.

Shared rules:
- Treat config discovery as deterministic input gathering, not guesswork.
- Record every config file discovered and whether it was loaded, skipped, or unavailable in the Coverage Matrix.
- Prefer the nearest config that actually governs a changed file, but preserve root-level rules that apply globally.
- If a config surface exists but cannot be interpreted locally without a live vendor integration, extract the deterministic parts and mark the rest as unavailable rather than inventing behavior.

### CodeRabbit Parity Checks
Inspect the root `.coderabbit.yaml` when present.

Required extraction targets:
- `reviews.profile`
- `reviews.path_filters`
- `reviews.path_instructions`
- `reviews.tools`
- `knowledge_base.code_guidelines`

Parity procedure:
- map `reviews.path_filters` and `reviews.path_instructions` against the changed-file set to determine which instructions apply
- use `reviews.profile` to tune strictness when the profile encodes review posture
- inspect `knowledge_base.code_guidelines` when present and treat them as repository review rules
- inspect configured `reviews.tools`, then load likely matching local config files for enabled static-analysis, security, or formatting tools when they exist
- likely companion configs include surfaces such as ESLint, TypeScript, markdownlint, GitHub Actions/actionlint, secret scanning, Prisma/schema tooling, or other tool-specific configs explicitly referenced by the repo
- if `.coderabbit.yaml` is absent, mark CodeRabbit config discovery as unavailable rather than substituting another file

### Greptile Parity Checks
Inspect Greptile config from the repo root downward.

Required discovery targets:
- `.greptile/config.json`
- `.greptile/rules.md`
- `.greptile/files.json`
- nested `.greptile/` folders relevant to changed files
- legacy `greptile.json`

Parity procedure:
- treat `.greptile/` as the preferred config surface
- for each changed file, walk upward to find applicable nested `.greptile/` folders and merge the relevant deterministic context
- if both `.greptile/` and same-directory `greptile.json` exist, `.greptile/` wins and `greptile.json` is fallback only
- use `.greptile/files.json` to understand explicit include/exclude scope when present
- use `.greptile/rules.md` as repo-specific review rules and `.greptile/config.json` as behavior/config metadata
- if neither `.greptile/` nor `greptile.json` exists for a path, record Greptile config as unavailable for that scope

### Cursor Bugbot Parity Checks
Inspect Bugbot rules for every changed file.

Required discovery targets:
- root `.cursor/BUGBOT.md`
- nested `.cursor/BUGBOT.md` files discovered by walking upward from each changed file
- prior local review context when it is explicitly available

Parity procedure:
- always load the root `.cursor/BUGBOT.md` when present
- for each changed file, walk upward toward the repo root and load each applicable nested `.cursor/BUGBOT.md`
- preserve cascade order from root to nearest file-specific rule so narrower guidance overrides broader guidance
- when prior review context is available locally (for example saved comments, review notes, or fixture artifacts), use it only to reduce duplicate findings and identify candidate learned rules
- when prior review context is not available, do **not** invent it; mark prior-review-context availability in the Coverage Matrix as `not available`
- this parity target is local/offline only; it does not require live Cursor service integration

## Deterministic Gate Command Discovery
Before leaning on judgment-heavy review, check for cheap, high-confidence failure signals when they are available.

Gate categories:
- `typecheck`
- `lint`
- `test`
- `build`
- `static/security`

Discovery order:
1. inspect root `package.json` scripts
2. inspect package-local `package.json` scripts for changed workspaces/packages
3. inspect workspace orchestrators or command wrappers already present in-repo (for example `turbo.json`, `mise.toml`, `Makefile`, or equivalent local command surfaces)
4. inspect nearby config files tied to the changed surface, such as TypeScript configs, ESLint configs, Prisma/schema files, GitHub Actions workflows, markdownlint config, test runner config, or security/static-analysis config
5. map discovered commands/configs to the gate categories above

Required behavior:
- discovery must be deterministic and explainable
- prefer explicit scripts over inferred shell commands
- if a gate is discoverable but not runnable in the current context, report `not run`
- if no gate is discoverable for a category, report `not available`
- never guess nonexistent commands
- if command output, diagnostics, or CI logs are provided, treat them as primary evidence and surface them before more speculative findings

Prioritize these failure signals when available:
- typecheck or compiler errors
- lint failures with real correctness or merge-blocking impact
- build failures
- failing tests tied to changed behavior
- unresolved imports, renamed symbols, missing exports, or stale references after refactors

If gates are unavailable, inspect the diff specifically for refactor fallout such as orphaned references, renamed functions not updated at call sites, or deleted symbols still in use.

## Coverage Matrix
Every review result must include a coverage matrix that shows what was actually inspected.

Required fields:
- `branch_diff_reviewed`: `yes` or `no`
- `base_branch`: detected branch name or `unknown`
- `working_tree_reviewed`: `yes` or `no`
- `changed_file_types`: list of classified file types/roles
- `config_files`: discovered/loaded/skipped/unavailable status for:
  - `.coderabbit.yaml`
  - `.greptile/config.json`
  - `.greptile/rules.md`
  - `.greptile/files.json`
  - nested `.greptile/` folders
  - `greptile.json`
  - root `.cursor/BUGBOT.md`
  - nested `.cursor/BUGBOT.md`
  - any relevant companion configs tied to enabled `reviews.tools`
- `deterministic_gates`: status per category using only `pass`, `fail`, `not run`, or `not available`
- `context_inspected`: whether each category was inspected:
  - imports
  - callers
  - tests
  - schemas
  - routes
  - migrations
  - API/contracts
  - CI
  - package scripts
- `prior_review_context`: `available`, `not available`, or a short deterministic description of what local artifact was used

Recommended shape:

```markdown
## Coverage Matrix
| Area | Status | Notes |
| --- | --- | --- |
| Branch diff reviewed | yes | `origin/main...HEAD` |
| Base branch | origin/main | inferred from repo default |
| Working tree reviewed | yes | staged + unstaged |
| Changed file types | yes | app code, tests, docs |
| `.coderabbit.yaml` | loaded | `reviews.tools`, `reviews.path_instructions` |
| `.greptile/config.json` | not available | no `.greptile/` in scope |
| Root `.cursor/BUGBOT.md` | loaded | repo-wide rules applied |
| Typecheck gate | pass | `bun run typecheck` |
| Test gate | not run | no deterministic changed-scope test command |
| Imports context | yes | traced direct imports |
| Migrations context | no | no schema/migration files changed |
| Prior review context | not available | no local comments artifact supplied |
```

## Finding Validation Rubric
Before reporting any finding, validate it against all of the following:

- **Concrete failure path:** explain how the bug or regression manifests, not just the smell
- **Exact file/line evidence:** cite the strongest file and line references available
- **Impact:** describe user, data, CI, or security impact
- **Gate/test catchability:** say whether an existing or discovered deterministic gate would catch it, would miss it, or was unavailable
- **Minimal recommended fix:** propose the narrowest safe change that addresses the defect

Drop or downgrade a finding when:
- it is only a style nit with no delivery risk
- it duplicates a stronger finding
- the evidence does not survive light adversarial checking through callers, tests, schemas, configs, or neighboring code
- the conclusion depends on unavailable context and cannot be bounded honestly

## Fixture-Based Regression Harness
Use the fixture harness to keep the review protocol repeatable.

Required fixture shape per scenario directory under `skills/catch-22/fixtures/`:
- `diff.patch`
- `expected-findings.md`
- `false-positive-traps.md`

Harness expectations:
- enumerate all fixture directories
- fail if any required file is missing
- validate that expected findings contain the Finding Validation Rubric fields
- validate that false-positive traps document what must **not** be reported
- validate Coverage Matrix presence and required keys
- validate deterministic gate discovery expectations against fixture metadata and local repo metadata
- remain local and deterministic; do **not** call live CodeRabbit, Greptile, or Cursor services

Harness command surface for this skill:
- `bun run --cwd skills/catch-22 test:docs`
- `bun run --cwd skills/catch-22 discover:gates`
- `bun run --cwd skills/catch-22 test:harness`

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
- stale-closure-capture: when event handlers, callbacks, or intervals are defined inside `useEffect` or `useCallback`, verify the dependency array includes every referenced state or prop. If `eslint-disable-next-line` suppresses the warning, treat the suppression as a finding. A callback that captures stale state will silently overwrite user input or ignore recent updates.
- revalidation-vs-redirect-race: in Next.js Server Actions, check whether `revalidatePath()` or `revalidateTag()` is called before `redirect()`. In production with ISR or caching enabled, the redirect can fire before the cache is purged, landing the user on a page showing stale data. Reorder so revalidation completes before redirect, or use `revalidatePath` after the redirect target renders.
- tenant-data-leakage: in multi-tenant applications, verify that every database query inside a Server Action, API route, or server-side function scopes results to the current authenticated user's `organizationId`, `tenantId`, or equivalent. A query that returns data without tenant scoping works correctly in single-tenant dev but silently exposes other tenants' data in production.
- implicit-any-propagation: when a function returns `any`, an untyped external library result, or uses a broad generic like `Record<string, any>`, trace the return value through its consumers. If `any` silently propagates through the call chain, TypeScript's type safety is defeated for every downstream consumer without producing a compiler error.
- optimistic-update-rollback-desync: for optimistic UI updates (e.g., TanStack Query `onMutate` cache writes, Convex optimistic updates), verify that the `onError` rollback restores the exact snapshot captured before the mutation, not a stale or default value. Also check whether a concurrent mutation that landed between `onMutate` and `onError` would be silently overwritten by the rollback.

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
- `works-in-dev-breaks-in-prod`: many Next.js and React patterns behave differently under development vs. production builds. Caching, ISR, middleware matching, and Server Action serialization boundaries are common divergence points. Do not treat local dev success as proof of correctness.
- `silent-type-erosion`: when `any` enters a typed call chain—through an untyped library, a JSON parse, or a broad generic—it silently disables compile-time checks for everything downstream. Trace the type through its consumers and flag when safety is no longer enforced.
- `stale-closure-trap`: closures in React effects and callbacks capture variable values at definition time. If the dependency array is incomplete or suppressed, the closure operates on stale data. The bug is invisible on first interaction and only manifests after state changes.
- `optimistic-rollback-collision`: optimistic updates assume the cache state at snapshot time is still valid at rollback time. If another mutation lands in between, the rollback silently overwrites the second mutation's result. Trace concurrent mutation paths, not just the happy path.
- `redirect-before-revalidation`: in Server Actions, the order of `revalidatePath()` and `redirect()` matters in production. A redirect that fires before cache purging completes sends the user to a stale page. This never happens in dev mode because there is no cache.

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
- `file`: the file path(s) where the issue was found
- `likely_reviewer`: `Cursor Bot`, `Greptile`, `CodeRabbit`, `Qodo`, `Either`, or `Unclear`
- `severity`: `high`, `medium`, or `low`
- `why_it_matters`
- `evidence`
- `recommended_change`
- `confidence`: `high`, `medium`, or `low`

After findings, include:
- `Coverage Matrix`
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
- `CodeRabbit`: logic and correctness issues, readability problems, performance inefficiencies (excessive I/O, unnecessary re-renders), and security vulnerabilities including insecure deserialization and improper authentication
- `Qodo`: race conditions, architectural drift, code duplication across repos, missing test coverage for edge cases, and validation of changes against acceptance criteria from project management tools
- `Either`: correctness regressions, contract drift, CI breakage, and maintainability issues with clear delivery risk
- `Unclear`: use only when the issue is real but tool attribution would be guesswork

## Output Template
Use this shape:

```markdown
## Findings

### 1. <title>
File: `<path/to/file>`
Likely reviewer: <Cursor Bot|Greptile|CodeRabbit|Qodo|Either|Unclear>
Severity: <high|medium|low>
Why it matters: <impact>
Evidence: <diff-aware explanation>
Recommended change: <specific change>
Confidence: <high|medium|low>

## Coverage Matrix
| Area | Status | Notes |
| --- | --- | --- |
| Branch diff reviewed | <yes|no> | <notes> |
| Base branch | <branch|unknown> | <notes> |
| Working tree reviewed | <yes|no> | <notes> |
| Changed file types | <status> | <notes> |
| `.coderabbit.yaml` | <loaded|skipped|not available> | <notes> |
| `.greptile/config.json` | <loaded|skipped|not available> | <notes> |
| `.greptile/rules.md` | <loaded|skipped|not available> | <notes> |
| `.greptile/files.json` | <loaded|skipped|not available> | <notes> |
| `greptile.json` | <loaded|skipped|not available> | <notes> |
| Root `.cursor/BUGBOT.md` | <loaded|skipped|not available> | <notes> |
| Nested `.cursor/BUGBOT.md` | <loaded|skipped|not available> | <notes> |
| Typecheck gate | <pass|fail|not run|not available> | <notes> |
| Lint gate | <pass|fail|not run|not available> | <notes> |
| Test gate | <pass|fail|not run|not available> | <notes> |
| Build gate | <pass|fail|not run|not available> | <notes> |
| Static/security gate | <pass|fail|not run|not available> | <notes> |
| Imports context | <yes|no> | <notes> |
| Callers context | <yes|no> | <notes> |
| Tests context | <yes|no> | <notes> |
| Schemas context | <yes|no> | <notes> |
| Routes context | <yes|no> | <notes> |
| Migrations context | <yes|no> | <notes> |
| API/contracts context | <yes|no> | <notes> |
| CI context | <yes|no> | <notes> |
| Package scripts context | <yes|no> | <notes> |
| Prior review context | <available|not available|other> | <notes> |

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

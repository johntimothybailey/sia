# Catch 22

`catch-22` is a pre-CI review skill with an explicit local review pipeline. It is designed to emulate the offline inputs and review shape that `Cursor Bugbot`, `Greptile`, and `CodeRabbit` rely on before CI or hosted review tools run.

## Pipeline Summary

The skill now follows a required procedure instead of a loose prompt:

1. detect the base branch and capture the branch-vs-base diff
2. capture staged and unstaged working-tree diffs
3. classify changed file types
4. load reviewer config from Cursor / Greptile / CodeRabbit surfaces
5. expand context through imports, callers, tests, schemas, routes, migrations, CI, and package scripts
6. discover and run deterministic gates when available
7. perform ordered review passes
8. validate findings adversarially and emit a coverage matrix

For the exact protocol, see `SKILL.md`.

## Parity Scope

Pass one parity is explicit and limited to these local/offline surfaces:

### CodeRabbit parity
- root `.coderabbit.yaml`
- `reviews.profile`
- `reviews.path_filters`
- `reviews.path_instructions`
- `reviews.tools`
- `knowledge_base.code_guidelines`
- likely companion configs for enabled static-analysis/security tools when those configs exist locally

### Greptile parity
- `.greptile/config.json`
- `.greptile/rules.md`
- `.greptile/files.json`
- nested `.greptile/` discovery for changed-file scope
- fallback to `greptile.json` only when `.greptile/` is absent for that scope

### Cursor Bugbot parity
- root `.cursor/BUGBOT.md`
- nested `.cursor/BUGBOT.md` files discovered by walking upward from changed files
- prior local review context when it is explicitly available

### Qodo status
`Qodo` remains a heuristic inspiration for issue categories and likely-reviewer labeling, but this first pass does **not** claim Qodo parity.

## What `catch-22` Produces

A good run should produce:
- high-signal findings ordered by severity and likely automated detection
- a coverage matrix showing what diff/config/gate/context surfaces were actually inspected
- explicit notes about unavailable reviewer context or gates instead of silent guessing
- minimal recommended fixes for each accepted finding

## Deterministic Gate Discovery

`catch-22` prefers deterministic proof over speculative commentary.

It discovers gates by inspecting:
- root `package.json` scripts
- package-local `package.json` scripts for changed workspaces
- existing in-repo command surfaces such as `turbo.json`, `mise.toml`, or similar wrappers
- nearby configs tied to typecheck, lint, test, build, or static/security checks

If a gate cannot be discovered, the result should be `not available`. If a gate is discoverable but not executed, the result should be `not run`.

## Fixture Harness Usage

The skill is paired with a catch-22-local regression harness and canonical fixture corpus under `skills/catch-22/fixtures/`.

Required files per fixture directory:
- `diff.patch`
- `expected-findings.md`
- `false-positive-traps.md`

The harness contract is:
- enumerate fixtures
- validate required fixture files
- validate expected findings and false-positive traps
- validate coverage-matrix presence/shape
- validate deterministic gate discovery behavior

Command surface:
- `bun run --cwd skills/catch-22 test:docs`
- `bun run --cwd skills/catch-22 discover:gates`
- `bun run --cwd skills/catch-22 test:harness`

## Non-Goals

This pass is intentionally scoped. `catch-22` does **not** attempt to provide:
- live CodeRabbit, Greptile, or Cursor service integration
- hosted PR API access
- repo-wide CI/workflow changes outside the catch-22 surface
- a generic shared harness for every skill in the repo
- proof that passing tests alone mean the change is semantically safe

## How To Use It

Invoke `catch-22` with a natural-language request for a strict pre-CI review. The best prompts mention review scope, intent, and any exclusions.

Good defaults:
- ask it to review both branch diff and working tree when possible
- mention `Cursor Bot`, `Greptile`, or `CodeRabbit` if you want that framing emphasized
- include intended behavior when a change is subtle or domain-specific
- mention whether generated files should be ignored

## Example Prompts

- `Use catch-22 to review my current changes like Cursor Bot, Greptile, or CodeRabbit would. Be critical and recommend a change for every issue.`
- `Run catch-22 on my uncommitted changes and tell me what is most likely to get caught in CI or automated review.`
- `Review this branch with catch-22 against origin/main and also check my working tree for anything risky.`
- `Use catch-22 and focus on correctness, missing tests, API drift, and maintainability problems that could block merge.`
- `Run catch-22 on these backend changes. The intended behavior is that empty input should return a 400, not silently succeed.`
- `Use catch-22 on this refactor and be especially critical about cross-file regressions, stale helpers, config mismatches, and missing gates.`

## When To Add More Context

Add a little extra context when:
- the intended behavior is not obvious from the diff
- there is a specific base branch the review should compare against
- generated files should be ignored
- you want the review biased toward a risk area like security, schema drift, or missing tests

Example:

```text
Use catch-22 to review these changes against origin/main.
Focus on what Cursor Bot, Greptile, or CodeRabbit would likely flag.
The intent is to reject invalid webhook payloads early and add retry safety.
Ignore generated client files.
Recommend a concrete fix for every issue.
```

## Why This Skill Is Tuned This Way

The skill is intentionally biased toward high-signal review behavior rather than generic code review commentary. Its procedure and heuristics were shaped by public documentation for the target tools.

Sources:
- [CodeRabbit configuration reference](https://docs.coderabbit.ai/reference/configuration)
- [CodeRabbit path instructions](https://docs.coderabbit.ai/configuration/path-instructions)
- [CodeRabbit tools reference](https://docs.coderabbit.ai/reference/tools-reference)
- [Greptile first PR review](https://www.greptile.com/docs/code-review/first-pr-review)
- [Greptile config docs](https://www.greptile.com/docs/code-review/greptile-config)
- [Cursor Bugbot docs](https://cursor.com/docs/bugbot)
- [Cursor Bugbot learned rules](https://cursor.com/blog/bugbot-learning/)

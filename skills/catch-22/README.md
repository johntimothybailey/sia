# Catch 22

`catch-22` is a pre-CI review skill designed to emulate the kinds of issues that `Cursor Bot` and `Greptile` are most likely to surface on current changes.

## Why This Skill Is Tuned This Way

The skill is intentionally biased toward high-signal review behavior rather than generic code review commentary. Its prompt and heuristics were shaped by the public documentation for both tools.

### Greptile Signals

Greptile emphasizes `logic`, `syntax`, and `style`, but its stronger value is codebase-aware review that follows call chains and finds cross-file inconsistencies, not just diff-local issues.

Sources:
- [Anatomy of a Review](https://www.greptile.com/docs/code-review/first-pr-review)
- [Greptile v3, an agentic approach to code review](https://www.greptile.com/blog/greptile-v3-agentic-code-review)

### Cursor Bugbot Signals

Cursor Bugbot emphasizes bugs, edge cases, security issues, and code quality. It also uses repo-specific `BUGBOT.md` rules plus existing PR comments to reduce duplicate feedback and make findings more context-aware.

Sources:
- [Bugbot docs](https://cursor.com/docs/bugbot)
- [Bugbot is out of beta](https://cursor.com/en/blog/bugbot-out-of-beta)

## What That Means For `catch-22`

Because of those signals, `catch-22` is optimized to:
- review both branch-level and uncommitted diffs when possible
- look beyond the immediate diff into nearby call paths, schemas, tests, and config
- load review-specific context like `.cursor/BUGBOT.md` or `greptile.json` when present
- prioritize actionable bugs, regressions, CI-risk, and maintainability issues over weak style nits
- avoid duplicate or low-value findings when prior review context already exists

## How To Use It

Invoke `catch-22` with a natural-language request for a strict pre-CI review. The most effective prompts mention the current scope and the kind of feedback you want.

Good defaults:
- ask it to review current or uncommitted changes
- mention `Cursor Bot` or `Greptile` if you want that framing emphasized
- ask for concrete recommended changes, not just issue spotting
- include intended behavior when a change is subtle or domain-specific

## Example Prompts

- `Use catch-22 to review my current changes like Cursor Bot or Greptile would. Be critical and recommend a change for every issue.`
- `Run catch-22 on my uncommitted changes and tell me what is most likely to get caught in CI or automated review.`
- `Review this branch with catch-22 against the base branch and also check my working tree for anything risky.`
- `Use catch-22 and focus on correctness, missing tests, API drift, and maintainability problems that could block merge.`
- `Run catch-22 on these backend changes. The intended behavior is that empty input should return a 400, not silently succeed.`
- `Use catch-22 on this refactor and be especially critical about cross-file regressions, stale helpers, and config mismatches.`

## When To Add More Context

Add a little extra context when:
- the intended behavior is not obvious from the diff
- there is a specific base branch the review should compare against
- generated files should be ignored
- you want the review biased toward a risk area like security, schema drift, or missing tests

Example:

```text
Use catch-22 to review these changes against origin/main.
Focus on what Cursor Bot or Greptile would likely flag.
The intent is to reject invalid webhook payloads early and add retry safety.
Ignore generated client files.
Recommend a concrete fix for every issue.
```

If you want the exact operating instructions, see `SKILL.md`.

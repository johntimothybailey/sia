# react-stale-closure-suppressed-deps

## Findings

```json
[
  {
    "title": "Suppressed effect dependency captures stale query text",
    "file": "app/components/SearchBox.tsx",
    "line": 15,
    "failure_path": "The interval callback closes over the initial query value because the effect intentionally suppresses exhaustive-deps, so later keystrokes never reach the debounced fetch.",
    "impact": "Search requests lag behind user input and can overwrite newer results.",
    "tests_or_gates": "Lint warnings were manually suppressed, so the review needs to treat the suppression as a correctness finding.",
    "minimal_fix": "Include query in the dependency array or move the debounced callback into a ref-safe utility."
  }
]
```

## Coverage Matrix

```json
{
  "branch_diff_reviewed": true,
  "base_branch": "origin/main",
  "working_tree_reviewed": true,
  "changed_file_types": [
    "tsx"
  ],
  "config_coverage": {
    ".cursor/BUGBOT.md": "unavailable",
    ".greptile/*": "unavailable",
    "greptile.json": "unavailable",
    ".coderabbit.yaml": "unavailable"
  },
  "deterministic_gates": {
    "typecheck": "not available",
    "lint": "not available",
    "tests": "not available",
    "build": "not available",
    "static/security": "not available"
  },
  "context_inspected": [
    "imports",
    "callers",
    "tests",
    "schemas",
    "routes",
    "migrations",
    "API/contracts",
    "CI",
    "package scripts"
  ],
  "prior_review_context": "not available"
}
```

## Gate Discovery Expectations

```json
{
  "packageJsons": [],
  "categories": {
    "typecheck": {
      "status": "not available",
      "packageScripts": []
    },
    "lint": {
      "status": "not available",
      "packageScripts": []
    },
    "tests": {
      "status": "not available",
      "packageScripts": []
    },
    "build": {
      "status": "not available",
      "packageScripts": []
    },
    "static/security": {
      "status": "not available",
      "packageScripts": []
    }
  }
}
```

## Config Discovery Expectations

```json
{
  "coderabbit": {
    "exists": false
  },
  "greptile": [],
  "cursor": {
    "bugbotFiles": [],
    "priorReviewContext": null
  }
}
```

# mutable-default-shared-object-leak

## Findings

```json
[
  {
    "title": "Shared mutable default object leaks state between requests",
    "file": "src/config/defaultSession.js",
    "line": 1,
    "failure_path": "The module-level defaultSession object is mutated in place and reused across callers, so one request can persist flags into the next.",
    "impact": "Cross-request data leakage produces nondeterministic auth and feature-flag behavior.",
    "tests_or_gates": "This usually survives lint and unit smoke tests, so the review needs to catch the mutation hazard.",
    "minimal_fix": "Return a fresh object per call, or deep-clone the default shape before mutating it."
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
    "js"
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

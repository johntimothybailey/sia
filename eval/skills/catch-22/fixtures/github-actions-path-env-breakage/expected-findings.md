# github-actions-path-env-breakage

## Findings

```json
[
  {
    "title": "Workflow appends an undefined variable into PATH during release setup",
    "file": ".github/workflows/release.yml",
    "line": 24,
    "failure_path": "The workflow echoes \"$BIN_DIR\" into $GITHUB_PATH before BIN_DIR is exported, so later steps cannot find the release helper on clean runners.",
    "impact": "Release automation fails only in CI, blocking deploys after merge.",
    "tests_or_gates": "An actionlint/security gate can catch this when configured; otherwise review should trace environment setup step-by-step.",
    "minimal_fix": "Export BIN_DIR before appending it to GITHUB_PATH, or write the absolute path directly."
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
    "github-actions"
  ],
  "config_coverage": {
    ".cursor/BUGBOT.md": "unavailable",
    ".greptile/*": "unavailable",
    "greptile.json": "unavailable",
    ".coderabbit.yaml": "unavailable"
  },
  "deterministic_gates": {
    "typecheck": "not available",
    "lint": "not run",
    "tests": "not run",
    "build": "not available",
    "static/security": "not run"
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
  "packageJsons": [
    "package.json"
  ],
  "categories": {
    "typecheck": {
      "status": "not available",
      "packageScripts": []
    },
    "lint": {
      "status": "not run",
      "packageScripts": [
        "package.json#lint:actions"
      ]
    },
    "tests": {
      "status": "not run",
      "packageScripts": [
        "package.json#test"
      ]
    },
    "build": {
      "status": "not available",
      "packageScripts": []
    },
    "static/security": {
      "status": "not run",
      "packageScripts": [
        "package.json#security:actions"
      ]
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

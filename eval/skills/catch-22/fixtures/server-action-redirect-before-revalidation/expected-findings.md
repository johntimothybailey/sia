# server-action-redirect-before-revalidation

## Findings

```json
[
  {
    "title": "Server action redirects before cache revalidation completes",
    "file": "app/projects/actions.ts",
    "line": 11,
    "failure_path": "The action calls redirect() immediately after the mutation and never reaches revalidatePath(), so the destination page can render stale cached data in production.",
    "impact": "Users land on outdated project pages after successful writes.",
    "tests_or_gates": "Dev mode often hides this, so review should flag the redirect/revalidation ordering and request a production-like test.",
    "minimal_fix": "Call revalidatePath() before redirect(), or move invalidation to the destination render path."
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
    "ts"
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

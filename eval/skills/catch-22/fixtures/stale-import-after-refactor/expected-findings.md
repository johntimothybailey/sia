# stale-import-after-refactor

## Findings

```json
[
  {
    "title": "Refactor removed export but consumer still imports the old helper",
    "file": "src/renderProfile.ts",
    "line": 1,
    "failure_path": "The branch diff renames formatDisplayName to formatUserName, but renderProfile still imports the deleted symbol and fails module resolution.",
    "impact": "Typecheck and build fail before review feedback can be addressed.",
    "tests_or_gates": "typecheck would catch this if available; otherwise the review should flag the stale import directly.",
    "minimal_fix": "Update the import and call site to use formatUserName, or keep a compatibility re-export until all consumers are migrated."
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

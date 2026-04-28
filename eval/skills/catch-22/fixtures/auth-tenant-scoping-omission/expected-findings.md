# auth-tenant-scoping-omission

## Findings

```json
[
  {
    "title": "Tenant-scoped route drops organization filter on user lookup",
    "file": "apps/api/routes/users.ts",
    "line": 18,
    "failure_path": "The new listUsers query reads all active users without constraining organizationId from the authenticated session.",
    "impact": "Production tenants can see each other's users even though local single-tenant development still appears correct.",
    "tests_or_gates": "Existing lint/typecheck gates stay green; the review should flag the missing auth scope and request a targeted test.",
    "minimal_fix": "Thread session.organizationId into the where clause and add a test that proves cross-tenant rows are excluded."
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
    ".cursor/BUGBOT.md": "loaded",
    ".greptile/*": "unavailable",
    "greptile.json": "unavailable",
    ".coderabbit.yaml": "loaded"
  },
  "deterministic_gates": {
    "typecheck": "not run",
    "lint": "not run",
    "tests": "not run",
    "build": "not run",
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
  "prior_review_context": "available"
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
      "status": "not run",
      "packageScripts": [
        "package.json#typecheck"
      ]
    },
    "lint": {
      "status": "not run",
      "packageScripts": [
        "package.json#lint"
      ]
    },
    "tests": {
      "status": "not run",
      "packageScripts": [
        "package.json#test"
      ]
    },
    "build": {
      "status": "not run",
      "packageScripts": [
        "package.json#build"
      ]
    },
    "static/security": {
      "status": "not run",
      "packageScripts": [
        "package.json#security"
      ]
    }
  }
}
```

## Config Discovery Expectations

```json
{
  "coderabbit": {
    "exists": true,
    "reviews": {
      "profile": true,
      "path_filters": true,
      "path_instructions": true,
      "tools": true
    },
    "knowledge_base": {
      "code_guidelines": true
    },
    "toolConfigs": [
      {
        "tool": "eslint",
        "matchedConfig": ".eslintrc.json"
      }
    ]
  },
  "greptile": [],
  "cursor": {
    "bugbotFiles": [
      ".cursor/BUGBOT.md",
      "apps/api/.cursor/BUGBOT.md"
    ],
    "priorReviewContext": "prior-review-comments.md"
  }
}
```

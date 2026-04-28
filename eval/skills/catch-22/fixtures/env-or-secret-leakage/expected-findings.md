# env-or-secret-leakage

## Findings

```json
[
  {
    "title": "Client env publisher now serializes a server-only secret into the browser payload",
    "file": "src/config/publishClientEnv.ts",
    "line": 9,
    "failure_path": "The new return object includes process.env.SERVICE_API_KEY alongside public values, so the secret is embedded into client-rendered HTML.",
    "impact": "Credentials leak to every browser session and downstream log sink.",
    "tests_or_gates": "Static security scanners may catch this when configured; otherwise review should inspect env object construction carefully.",
    "minimal_fix": "Keep server-only secrets on the server and only serialize NEXT_PUBLIC or explicitly allowlisted keys."
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

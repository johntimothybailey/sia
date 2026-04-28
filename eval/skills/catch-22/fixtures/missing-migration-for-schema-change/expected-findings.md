# missing-migration-for-schema-change

## Findings

```json
[
  {
    "title": "Schema adds required status column without a matching migration artifact",
    "file": "prisma/schema.prisma",
    "line": 22,
    "failure_path": "The schema change introduces a non-null project.status field, but the branch diff contains no migration, so deploys fail when Prisma validates against existing databases.",
    "impact": "Production migrations break and app code reads a column that does not yet exist.",
    "tests_or_gates": "Prisma validation or migration checks would catch this if wired; otherwise the review must compare schema edits against migration files.",
    "minimal_fix": "Add the generated migration (or document a deliberate squash migration) before merging the schema change."
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
    "prisma",
    "tsx"
  ],
  "config_coverage": {
    ".cursor/BUGBOT.md": "unavailable",
    ".greptile/*": "loaded",
    "greptile.json": "skipped",
    ".coderabbit.yaml": "unavailable"
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
        "package.json#prisma:validate"
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
  "greptile": [
    {
      "dir": ".",
      "hasDotGreptile": true,
      "files": [
        ".greptile/config.json",
        ".greptile/rules.md",
        ".greptile/files.json"
      ],
      "hasLegacy": true,
      "precedence": ".greptile"
    },
    {
      "dir": "apps/web",
      "hasDotGreptile": true,
      "files": [
        ".greptile/config.json"
      ],
      "hasLegacy": false,
      "precedence": ".greptile"
    }
  ],
  "cursor": {
    "bugbotFiles": [],
    "priorReviewContext": null
  }
}
```

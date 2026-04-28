# Contributing

## Catch-22 contributor workflow

`skills/catch-22/` is the consumer-facing skill surface.

- Runtime/consumer files live under `skills/catch-22/`
- Maintainer-only evaluation assets live under `eval/skills/catch-22/`

Use the eval tree when you are changing Catch-22 itself and need to re-run the offline proof surface.

### Catch-22 eval commands

```bash
bun run --cwd eval/skills/catch-22 test:docs
bun run --cwd eval/skills/catch-22 discover:gates
bun run --cwd eval/skills/catch-22 test:harness
```

### Catch-22 eval asset layout

```text
eval/skills/catch-22/
  package.json
  scripts/
  fixtures/
```

The fixture corpus is maintainer-only and exists to regression-test the skill contract without live vendor integrations.

Each fixture directory contains:
- `diff.patch`
- `expected-findings.md`
- `false-positive-traps.md`

Optional fixture-local context files may exist when config discovery or gate discovery needs a simulated repo surface.

# stale-import-after-refactor

## Must not report
- Do not report the renamed helper implementation itself as dead code; the real issue is the stale consumer import.
- Do not claim a runtime bug in formatting logic when the deterministic failure is a missing export.

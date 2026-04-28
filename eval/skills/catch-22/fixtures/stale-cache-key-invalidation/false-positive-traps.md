# stale-cache-key-invalidation

## Must not report
- Do not suggest removing optimistic updates entirely; the defect is mismatched invalidation keys.
- Do not report the query hook rename itself as a bug when all call sites except invalidation were updated.

# optimistic-rollback-overwrites-concurrent-mutation

## Must not report
- Do not recommend removing optimistic updates altogether; fix the rollback granularity instead.
- Do not flag the mutation hook as too complex without tying it to the stale snapshot collision.

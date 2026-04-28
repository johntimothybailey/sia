# prisma-count-include-filter-drift

## Must not report
- Do not flag the new relation include as overfetching when the primary regression is inconsistent filters.
- Do not ask for raw SQL unless Prisma cannot express the shared where clause.

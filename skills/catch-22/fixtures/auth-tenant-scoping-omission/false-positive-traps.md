# auth-tenant-scoping-omission

## Must not report
- Do not report the added role include as excessive eager loading; the material regression is missing tenant scoping.
- Do not suggest a generic auth middleware rewrite when the minimal fix is a where-clause constraint plus a test.

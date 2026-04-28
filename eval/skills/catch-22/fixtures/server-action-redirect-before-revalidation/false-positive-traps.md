# server-action-redirect-before-revalidation

## Must not report
- Do not report the server action as missing try/catch unless the diff also changes error handling.
- Do not suggest removing redirect() when the issue is ordering relative to revalidation.

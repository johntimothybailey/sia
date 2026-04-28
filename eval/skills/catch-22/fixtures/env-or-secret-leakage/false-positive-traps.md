# env-or-secret-leakage

## Must not report
- Do not recommend hiding the value with string masking in the client payload; the fix is to omit it entirely.
- Do not complain about process.env usage generally when the defect is leaking a specific secret to the browser.

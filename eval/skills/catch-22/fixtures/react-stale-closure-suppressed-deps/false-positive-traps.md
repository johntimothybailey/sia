# react-stale-closure-suppressed-deps

## Must not report
- Do not complain about useEffect presence alone; the defect is stale closure capture plus suppression.
- Do not suggest useMemo as a replacement when the stale callback still needs current state.

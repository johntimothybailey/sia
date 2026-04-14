# Approver Packet Prompt Templates

Use these prompts when you need a strict approval artifact rather than a broad teachback.

## Default strict packet
`Use approver-packet on my staged diff and give me recommendation, scope, evidence, residual risk, rollback impact, and follow-ups.`

## Structured schema only
`Use approver-packet with --format schema on my current diff and return only the documented schema.`

## Prose plus schema
`Use approver-packet with --format both --e strict on my staged diff and give me a reviewer packet followed by the schema version.`

## Preserve teachback handoff context
`Use approver-packet on the same change and preserve the important idea shifts and concepts from the teachback so the approval packet carries both decision context and engineering rationale.`

## Risk-only packet
`Use approver-packet with --r only on my current diff and tell me what could break, how rollback would work, and what proof is missing.`

## Commit-range signoff
`Use approver-packet with --s range:main..HEAD on this branch and tell me whether it is ready for approval.`

# Teachback Prompt Templates

Use these prompts for everyday review and knowledge-transfer workflows.

## Default combined review
`Use teachback on my current diff and give me both a reviewer-style diff review and a teachback walkthrough.`

## PR review only
`Use teachback with --m review on my current diff and give me summary, changed files, hunk notes, and risks.`

## Teachback only
`Use teachback with --m teachback on my current diff and walk me through the old behavior, new behavior, and what would break if the change were removed.`

## File-scoped review
`Use teachback with --s files:<paths...> and give me both a diff review and a teachback walkthrough.`

## Bug-fix flow
`Use teachback with --flow --e strict on this bug fix and explain where the bug came from, why this layer changed, what the tests prove, and any residual risk.`

## Idea-shift walkthrough
`Use teachback with --idea-shifts on --m combined on my current diff and explain both the line changes and the mental-model or design-principle shifts behind them.`

## Ideas vs concepts walkthrough
`Use teachback with --idea-shifts on and clearly separate idea shifts from concepts: tell me what changed in the team's thinking, what engineering principle it now reflects, and which hunks embody that shift.`

## Approver-friendly review
`Use teachback with --m review --a approver on my staged diff and give me a concise approval-oriented review.`

## Range review
`Use teachback with --s range:main..HEAD --m combined --e strict and review everything in this branch for both approval and learning.`

## Compact alias invocation
`Use teachback with --s staged --m combined --a engineer --e strict --r brief on my current changes.`

## Need stricter review output?
`If I need a decision-first approval packet, structured schema output, or stricter reviewer gating, use approver-packet instead.`

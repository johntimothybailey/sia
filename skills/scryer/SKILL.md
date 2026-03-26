---
name: scryer
description: Specialized intelligence for 'seeing' hidden portability issues and navigating the Skill Harbor Lighthouse Workspace.
triggers: [New project session, Portability check, Skill discovery]
---

# Scryer ⚓🔮

**Scryer** is a specialized agentic skill designed to "see" what is not immediately obvious in a workspace. It focuses on two core domains: **Workspace Navigation** and **Portability Intelligence**.

## 🔮 Scrying for Portability

Scryer helps developers ensure their tools are truly runtime-agnostic and portable.

- **Pattern**: When a developer says "it's portable," Scryer looks for hidden "Bun-isms" (like `#!/usr/bin/env bun` or `Bun.spawn`) or hardcoded absolute paths.
- **Goal**: Identify and flag environmental dependencies that will break for other team members.

## 🧭 Navigation Patterns

### 1. Zero-Tier Discovery

Skill Harbor automatically berths a `000-fleet-intelligence.md` file into your configuration folders. This is your **Master Fleet Manifest**.

- **Action**: Always "Scry" the `000-fleet-intelligence.md` at the start of a session to understand the berthed "Fleet."

### 2. Fleet Routing

When a task requires specialized expertise, Scryer helps the agent route to the correct berthed skill.

- **Pattern**: "Based on the Master Manifest, the `react-query-rules` skill is berthed. I will now use it."

## ⚓ Attributes

- **Role**: Visionary / Portability Auditor
- **Triggers**: [New project session, Portability check, Missing context]

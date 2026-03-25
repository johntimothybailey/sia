# Next.js Agentic Skills: Ecosystem Analysis & Proposals

## 1. Ecosystem Evaluation

I evaluated the two primary skill repositories for AI coding agents:
- **[Skills.sh](https://skills.sh) (by Vercel)**: Focuses heavily on broad framework best practices. Its Next.js skills act as "documentation injectors," giving agents context on React Server Components, Server Actions, and App Router conventions.
- **Skillfish**: Focuses on overarching agent personas (e.g., "Next.js 16 Expert") and specific library integrations (e.g., Clerk Auth integration, Turbopack usage).

## 2. The Gap: Passive Knowledge vs. Active Enforcement

The vast majority of existing skills in the community are **passive knowledge injectors**. They teach an agent *how* to use a tool (giving it documentation), but they don't give the agent a specific, highly-targeted job to do.

The community is lacking **Active Structural Enforcers**—skills like Sia's `hook-ascender` (which actively refactors architecture) and `catch-22` (which actively polices specific edge-case bugs). When agents are given broad rules ("write good React code"), they often fail. When given specific protocols ("ascend hooks over this threshold"), they excel.

## 3. Recommended New Skills for Sia

To fill this huge community gap, Sia should become the premier forge for **active, enforcer protocols**. Here are three high-value skills we should consider building:

### 🛡 `action-shield`
**The Problem**: Next.js Server Actions are essentially public API endpoints, but developers and AI agents frequently write them without proper authorization checks or input validation, leading to massive security vulnerabilities.
**The Skill**: A specialized review protocol triggered on any modified Server Action. It actively scans for missing session verifications (e.g., `auth()`), insists on Zod input validation, and checks for unsafe direct database queries that leak tenant data.

### 🏝 `rsc-boundary-guard`
**The Problem**: A common anti-pattern is slapping `"use client"` at the top of a page because one small button needs a click handler, destroying the performance benefits of Server Components for the entire tree.
**The Skill**: A structural refactoring protocol. When an agent adds state (`useState`, `onClick`) to a Server Component, this skill intercepts the change, forces the agent to extract the interactive piece into a "Client Island" leaf component, and keeps the parent as a pure Server Component.

### ♿️ `aria-weaver`
**The Problem**: AI agents are terrible at accessibility. They generate Tailwind/Shadcn HTML that completely ignores ARIA roles, `tabindex`, keyboard navigation, and screen reader announcements.
**The Skill**: An active post-processing skill triggered when new UI components are created. It audits the DOM structure and forces the injection of appropriate `aria-` labels, Shadcn/Radix accessibility primitives, and focus management.

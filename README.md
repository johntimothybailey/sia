<div align="center">
  <img src="./sia-icon.png" alt="Sia Logo" width="164" />
  <p>
    <em>"Sia carries the sacred scroll of knowledge."</em> <br/>
    <em>“The keeper of discernment, where perception meets action.”</em><br/>
    <em>“Perception is the heart of wisdom; Sia is the mind that shapes it.”</em>
  </p>
</div>

Sia is an **Agentic Skill Forge** that provides the context and guardrails for AI agents to build and maintain web applications. 

---

## ⚡️ The Skills

The primary purpose of this repository is to host and maintain official Agentic Skills for your AI assistants. These skills are independently managed and designed to be "moored" directly into your own projects using [Skill-Harbor](https://github.com/johntimothybailey/skill-harbor).

### How to Integrate

To use any of the skills below in your project, simply add them to your `harbor-manifest.json`:

```json
{
  "skills": {
    "catch-22": "johntimothybailey/sia/skills/catch-22",
    "hook-ascender": "johntimothybailey/sia/skills/hook-ascender"
  }
}
```

Then run `skill-harbor up` in your terminal to moor them into your local `.harbor` directory.

---

### 🎣 Hook-Ascender
**Status**: `Official` | **Tags**: `react`, `refactor`, `hooks`, `typescript`

`Hook-Ascender` is a specialized skill that enforces presentation-first React components. It monitors React component complexity to prevent UI code from becoming bloated with business logic.

**How to use it:**
Apply this skill whenever you or an AI agent create or edit a React component. 

**What it does:**
When a component accumulates more than two standard hooks (like `useState` or `useEffect`) or introduces complex async queries (like TanStack Query or Convex hooks), Hook-Ascender will trigger a refactor protocol to:
1. Create a dedicated `use[DomainName].ts` hook file beside the component.
2. "Ascend" all stateful logic, effects, and async mutations into this newly created custom hook.
3. Return a minimal typed interface to the component, keeping the UI strictly focused on presentation and rendering.

**Example Intent:**
> *"Read this Linear ticket and implement the React change while applying Hook-Ascender."*

### 🔎 Catch-22 
**Status**: `Official` | **Tags**: `review`, `correctness`, `prisma`, `security`

`Catch-22` acts as a strict, automated pre-CI reviewer. It pressure-tests current branch changes before CI/CD pipelines run, focusing on the kinds of subtle correctness bugs that AI auto-reviewers like Cursor Bot or Greptile are likely to flag.

**How to use it:**
Use this skill when you want an early review or pre-CI feedback on uncommitted or staged changes.

**What it catches:**
Instead of generic style nits, Catch-22 looks for specific, high-risk anti-patterns such as:
- **Count-Include Mismatch**: Discrepancies between count filters and included record filters (e.g., `uploadCompleted: true` in `_count` but missing in `include`), preventing UI flickering and data-consistency bugs.
- **Orphaned Duplicate State**: Failure to clean up both global sync keys and local state simultaneously.
- **Query-Enabled Leakage**: Leaving queries active after the required local state has already been consumed.
- **Cache-Key Desync**: Mutations invalidating query keys that do not exactly match the keys currently driving the UI.

**Example Intent:**
> *"Review my uncommitted changes like a strict automated reviewer. Focus on issues Cursor Bot or Greptile are likely to catch. Be critical and recommend a concrete change for every issue."*

---

## 🏛 Why Sia?

Named after the Egyptian deity of perception and wisdom, **Sia** embodies the intelligence required to discern truth and codify knowledge—the core mission of our Agentic Skills.

## 🏗 Architecture

Under the hood, Sia leverages a robust monorepo structure to ensure these skills are portable, testable, and reliable.

*   **Skills Directory (`skills/`)**: Dedicated folder for granular, self-contained agentic skills. Each skill includes a `SKILL.md` (prompts/instructions) and a `references/` directory (ground truth examples for testing).
*   **Monorepo Strategy**: Uses **Turborepo** and **Bun** workspaces to manage both the skills and the independent local evaluators that validate them.
*   **Local Evaluators**: We use Promptfoo (`sia-promptfoo`) and DeepEval (`sia-deepeval`) to rigorously test our skills with real LLMs before they are published to the wider ecosystem.

---

## 🚀 Contributing / Getting Started

If you want to contribute to Sia or run the skill evaluators locally:

1. **Clone the repository**
2. **Install dependencies**: `bun install`
3. **Run builds**: `bun turbo run build`
4. **Run evaluations**: `bun turbo run test`

---

## 🛠 Tech Stack

- **Testing / Evaluation**: [DeepEval](https://github.com/confident-ai/deepeval), [Promptfoo](https://promptfoo.dev/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Target Stack**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)

---

*“Guardians of the digital grain, ensuring every line serves the harvest.”*

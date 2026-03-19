<div align="center">
  <img src="./sia-icon.png" alt="Sia Logo" width="164" />
  <p>
    <em>"Sia carries the sacred scroll of knowledge."</em> <br/>
    <em>“The keeper of discernment, where perception meets action.”</em><br/>
    <em>“Perception is the heart of wisdom; Sia is the mind that shapes it.”</em>
  </p>
</div>

Sia is an **Agentic Skill Forge** for building web applications using the Next.js, Vercel, Tailwind, and Shadcn/ARIA stack. It provides the context and guardrails for AI agents to build and maintain web applications.

---

## 🏛 Why Sia?

Named after the Egyptian deity of perception and wisdom, **Sia** embodies the intelligence required to discern truth and codify knowledge—the core mission of our Agentic Skills.

<br/>

## 🏗 Architecture

Sia leverages **Turborepo** for ultra-fast builds and task orchestration, combined with **Changesets** for independent versioning and publishing of individual skills.

*   **Monorepo Strategy**: Single source of truth for all skills, providing rich cross-component context for AI agents.
*   **Agentic-Ready**: Every skill is designed with an "agent-first" mindset—structured for easy discovery and reliable execution.
*   **Quality Guardrails**: Built-in mechanisms to prevent hook bloat, enforce complexity thresholds, and maintain architectural integrity.

---

## ⚡️ Skills

Skills in Sia are independently managed and can be installed via [Agent Skill Porter](https://www.npmjs.com/package/agent-skill-porter) or [Uberskills](https://uberskills.dev/).

| Name | Purpose | Status |
| :--- | :--- | :--- |
| `Hook-Ascender` | Enforces presentation-first React components by moving logic to custom hooks. | `Official` |

### Example: Hook-Ascender
`Hook-Ascender` is a specialized skill that monitors React component complexity. It prevents components from becoming bloated by ensuring non-trivial hook logic (queries, mutations, derived state) is ascended into domain-named custom hooks, keeping the UI focused on presentation.

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `bun install`
3. **Run builds**: `bun turbo run build`

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI**: [Shadcn UI](https://ui.shadcn.com/) / [React Aria](https://react-spectrum.adobe.com/react-aria/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Publishing**: [Changesets](https://github.com/changesets/changesets)
- **Deployment**: [Vercel](https://vercel.com/)

---

*“Guardians of the digital grain, ensuring every line serves the harvest.”*

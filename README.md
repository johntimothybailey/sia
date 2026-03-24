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

Sia focuses on **Agentic-Ready** skill distribution. It uses a specialized directory structure and tooling to ensure skills are portable and reliable.

*   **Skills Directory (`skills/`)**: Dedicated folder for granular, self-contained agentic skills. Each skill includes a `SKILL.md` (prompts/instructions) and a `references/` directory (ground truth examples).
*   **Monorepo Strategy**: Uses **Turborepo** and **Bun** workspaces to manage both the skills and the local evaluators (`sia-deepeval`, `sia-promptfoo`) that validate them.
*   **Skill-Harbor Ready**: Fully compatible with [Skill-Harbor](https://github.com/johntimothybailey/skill-harbor) for seamless synchronization ("mooring") into `.harbor` environments.

---

## ⚡️ Skills

Sia skills are independently managed and can be "moored" into your project using `skill-harbor` or `skillfish`.

| Name | Purpose | Status |
| :--- | :--- | :--- |
| `Hook-Ascender` | Enforces presentation-first React components. | `Official` |
| `Catch-22` | Strict pre-CI automated reviewer for correctness. | `Official` |

### Skill Integration

To use these skills in your project, add them to your `harbor-manifest.json`:

```json
{
  "skills": {
    "catch-22": "johntimothybailey/sia/skills/catch-22"
  }
}
```

Then run `skill-harbor up` to moor them into your local environment.

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

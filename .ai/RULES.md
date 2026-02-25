# SOM Standard — Universal AI & Development Rules

> **Last Updated**: 2026-02-18
> **Applies To**: All developers, all LLMs, all IDEs
> **Canonical Source**: This file is the single source of truth.

---

## 0. Golden Rules

1. **NEVER commit secrets.** API keys, tokens, passwords → environment variables ONLY. Use `import.meta.env.VITE_*`.
2. **NEVER use `any`.** Use `unknown`, proper generics, or specific types. Add a `// TODO: type this` if escaping.
3. **NEVER use `console.log`.** Import and use `DiagnosticLogger` (or project equivalent) for structured logging.
4. **NEVER hardcode colors or font sizes.** Use theme tokens or defined constants.
5. **ALWAYS write at least one test** for new utilities, hooks, or data transformations.
6. **ALWAYS register new modules** in the appropriate registry (e.g., `MarketplaceProvider`).

---

## 1. Modular Rules Directory

For detailed standards, refer to the specific rule file:

| Domain | Rule File | What's Inside |
|--------|-----------|---------------|
| **Coding** | [.ai/rules/CODING.md](./rules/CODING.md) | Naming, TypeScript, React, Patterns, Styling |
| **C#** | [.ai/rules/CSHARP.md](./rules/CSHARP.md) | Rhino/GH plugin standards, Namespaces, Bridge |
| **Quality** | [.ai/rules/QUALITY.md](./rules/QUALITY.md) | Testing, Performance, Accessibility, Checks |
| **Infra** | [.ai/rules/INFRA.md](./rules/INFRA.md) | Build, Deploy, Dependencies, Maintenance |
| **Git** | [.ai/rules/GIT.md](./rules/GIT.md) | Git Flow, PRs, Commits, Branching |
| **Platform** | [.ai/rules/WORKSPACE.md](./rules/WORKSPACE.md) | Google Workspace, AI Execution, Safety |

---

## 2. LLM Token Efficiency (Tiered Reading)

LLM sessions have finite context windows. Do NOT read all governance docs. Use this priority system:

**Always read (every session):**
- `.ai/sessions/` — latest handoff file (critical context)
- `.cursorrules` / `.windsurfrules` / `copilot-instructions.md` — auto-loaded by IDE

**Read when relevant to the task:**

| Task Type | Read These | Skip These |
|-----------|-----------|------------|
| New module | `MODULE_CONTRACT.md`, [CODING.md](./rules/CODING.md) | `ARCHITECTURE.md`, `GOVERNANCE.md` |
| Bug fix | `LESSONS_LEARNED.md`, latest session, source files | All other `.ai/` docs |
| Styling/UI | `DESIGN_TOKENS.md`, [CODING.md](./rules/CODING.md) | `ARCHITECTURE.md`, `MODULE_CONTRACT.md` |
| Architecture | `ARCHITECTURE.md`, `RULES.md`, `GOVERNANCE.md` | `DESIGN_TOKENS.md` |
| Build/deploy | `BUILD_PROCESS.md`, [INFRA.md](./rules/INFRA.md) | `DESIGN_TOKENS.md` |
| C# work | [CSHARP.md](./rules/CSHARP.md), `LESSONS_LEARNED.md` | React-specific docs |

---

## 3. Deviation Process
If you must violate a rule:
1. **Annotate** the code with `// DEVIATION: DEV-XXX`
2. **Register** it in [.ai/DEVIATIONS.md](./DEVIATIONS.md)
3. **Get Approval** via PR review

# SOM Standard — Documentation Governance & LLM Session Protocol

> **Last Updated**: 2026-02-18
> **Owner**: Tech Lead
> **See Also**: `RULES.md`, `ARCHITECTURE.md`, `MODULE_CONTRACT.md`

---

## 1. Markdown Maintenance Standards

### The Document Inventory

Every governance document has an **owner**, a **lifecycle moment**, and a **freshness check** schedule.

| Document | When to Update | Lifecycle Moment |
|----------|---------------|------------------|
| `RULES.md` | After a new pattern is **adopted and merged** | **Post-merge** |
| `.ai/rules/*.md`| When a **domain-specific standard** changes | **Mid-conversation** |
| `ARCHITECTURE.md` | After a new service/layer/project is **merged** | **Post-merge** |
| `MODULE_CONTRACT.md` | When the module interface **changes** | **Post-merge** |
| `DESIGN_TOKENS.md` | When theme token values **change** | **Post-merge** |
| `GOVERNANCE.md` | When a **process change** is agreed upon | **Post-decision** |
| `DEVIATIONS.md` | When a deviation is **proposed** | **During the PR** |
| `LESSONS_LEARNED.md` | When a quirk is **discovered** | **Mid-conversation** |
| `CHANGELOG.md` | When a feature/fix is **complete** | **Pre-merge** |

### Key Principle: Don't Update Standards During Experimentation

```
❌ "I'm trying a new pattern" → immediately update RULES.md
✅ "I tried a new pattern, it worked, it's merged" → now update RULES.md
```

### Update Protocol

When you update a `.ai/` governance file:
1. **Update the `Last Updated` date**
2. **Update IDE config files** if `RULES.md` changed
3. **Add a `docs:` commit**
4. **Announce in PR description**

---

## 2. Changelog Standards

### Format

```markdown
## vX.Y.Z - YYYY-MM-DD

### Added
- **Feature Name**: Brief description

### Changed
- **Component**: What changed and why

### Fixed
- **Bug Title**: What was wrong, what was fixed
```

### Rules
1. **Every merge to `main` must update CHANGELOG.md**
2. **Use semantic versioning**: `MAJOR.MINOR.PATCH`
3. **List all modified files**

---

## 3. LLM Session Handoff Protocol

### The Problem
Every LLM session starts with zero context.

### The Solution: Session Handoff Files
After significant work sessions (>1 hour or >5 files), create a handoff in `.ai/sessions/`:

```markdown
# Session Handoff: [Title]
> **Date**: YYYY-MM-DD
> **LLM**: [Model Name]

## What Was Done
- [Bullet list]

## Key Decisions Made
- [Decision]: [Rationale]

## Files Modified
- `path/to/file.ts`

## In Progress / Not Finished
- [Unfinished work]

## Recommended Next Steps
1. [Action item]
```

### Session Start Checklist
Start every session with this context check:
1. **Read** the latest handoff in `.ai/sessions/`
2. **Read** `.cursorrules` / `.windsurfrules`
3. **Identify** task type and read relevant `.ai/` docs

---

## 4. Bug Tracking Standards

**Primary**: GitHub Issues
**Secondary**: `.ai/LESSONS_LEARNED.md`

---

## 5. Archive Protocol

Archive a document when it is superseded or stale (6+ months).
Move to `archive/` folder and add a deprecation note.

---

## 6. Automated Guardrails (CI/CD Checks)

Recommended `package.json` scripts:
```json
{
    "scripts": {
        "lint": "eslint src/ --ext .ts,.tsx",
        "typecheck": "tsc --noEmit",
        "pre-commit": "npm run lint && npm run typecheck"
    }
}
```

---

## 7. Document Health Dashboard

Run this checklist quarterly:
- [ ] `RULES.md` — Reflects current patterns?
- [ ] `ARCHITECTURE.md` — Matches current code?
- [ ] `GOVERNANCE.md` — Inventory complete?
- [ ] `DEVIATIONS.md` — Review temporary entries.
- [ ] `CHANGELOG.md` — Up to date?
- [ ] `.ai/sessions/` — Purge old handoffs (>30 days).

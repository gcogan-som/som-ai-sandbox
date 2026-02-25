# SOM Shared Libraries Governance

> **Last Updated**: 2026-02-18
> **See Also**: `.ai/RULES.md`

---

## The Ecosystem
We consume and contribute to shared libraries (e.g., `@som/ui`, `som-rhino-core`).

## Consumption Rules
1. **Prefer Shared**: If it exists in the library, use it.
2. **Version Pinning**: Pin dependencies.
3. **Linking**: Use `npm link` or relative paths for local dev.

## Contribution Protocol
1. **Incubate** locally in `src/components`.
2. **Propose** via `DEVIATIONS.md` if needed.
3. **Generalize** (remove app logic).
4. **Migrate** to shared repo via PR.

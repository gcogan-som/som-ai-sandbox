# SOM Standard — Infrastructure & Multi-Platform

> **Last Updated**: 2026-02-18
> **Applies To**: Build, Deployment, Dependencies

---

## Build & Deployment
- Standardize build scripts (e.g., `build.ps1` or `npm run build`).
- Environments must use `.env` (never commit keys).

## Dependency Hygiene
- **Rule**: Avoid overlapping libraries.
- **Audit**: Run `npm ls` quarterly. Pin major versions.

## Documentation Maintenance
| File | Owner | Update Trigger |
|------|-------|---------------|
| `.ai/RULES.md` | Tech Lead | Standards change |
| `CHANGELOG.md` | Developer | Every release |

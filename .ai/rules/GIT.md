# SOM Standard — Git & GitHub Standards

> **Last Updated**: 2026-02-18
> **Applies To**: Git Flow, PRs, Commits

---

## Git Standards

### Conventions
| Type | Standard | Example |
|------|----------|---------|
| **Branch** | `type/short-description` | `feat/login-page` |
| **Commit** | `type: imperative description` | `feat: add login page` |
| **PR Title** | `type: description` | `feat: add login page` |

### Types
`feat`, `fix`, `refactor`, `docs`, `test`, `build`, `chore`.

### Hard Rules
1. **Atomic commits**: One logical change per commit.
2. **No Squash Merges**: Use `gh pr merge --merge` or rebase, preserve history structure if meaningful, or squash if "WIP". (Project preference: Merge Commits for preservation).
3. **Tags**: Semantic versioning `vX.Y.Z` on `main`.

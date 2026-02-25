# SOM Standard — Quality & Testing Standards

> **Last Updated**: 2026-02-18
> **Applies To**: Testing, Performance, Accessibility

---

## Testing Standards

### Framework Recommendation
- **Vitest** for unit/integration.
- **@testing-library/react** for components.
- **Playwright** for E2E.

### Regression Priority
| Priority | What |
|----------|------|
| Critical | Data transformations & Adapters |
| Critical | Type guards / Schemas |
| High | Custom hooks |
| High | Critical User Flows (E2E) |

### Test Pathing
Tests should live in `__tests__` next to the implementation or in `src/tests/`.

---

## Performance Checklist
- [ ] Data transformations wrapped in `useMemo`.
- [ ] Event handlers wrapped in `useCallback`.
- [ ] Large lists virtualized.
- [ ] No inline object creation in render path.

---

## Accessibility Minimum
- [ ] Interactive elements have `aria-label` or text.
- [ ] Color is not the only state indicator.
- [ ] Focus states are visible.
- [ ] Form fields have labels.

# SOM Standard — Design Token Reference

> **Last Updated**: 2026-02-18
> **Source of Truth**: Theme Configuration (e.g., `@som/ui`, `src/theme/`)

---

## Rule: NEVER Hardcode, ALWAYS Use Tokens

```typescript
// ❌ BANNED
sx={{ color: '#757575', fontSize: '12px' }}

// ✅ REQUIRED
sx={{ color: 'text.secondary', typography: 'caption' }}
```

---

## Color Palette (Standard MUI)
- `primary.main`: Brand accent
- `text.primary`: Main content
- `text.secondary`: Labels, descriptions
- `background.paper`: Cards/Surfaces
- `divider`: Borders

## Spacing (8px Grid)
`1 unit = 8px`.
- `p: 1` = 8px
- `p: 2` = 16px
- `gap: 2` = 16px

## Typography
Use variants: `h1`, `h2`, `body1`, `caption`.
Do not set explicit font sizes or families.

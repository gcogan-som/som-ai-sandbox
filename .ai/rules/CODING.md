# SOM Standard — Coding Standards

> **Last Updated**: 2026-02-18
> **Applies To**: TypeScript, React, CSS, Naming
> **See Also**: `.ai/RULES.md` (Golden Rules), `.ai/DESIGN_TOKENS.md`

---

## 1. Naming Conventions

### File Naming
| Category | Convention | Example |
|----------|-----------|---------|
| React Components | `PascalCase.tsx` | `GridCanvas.tsx` |
| Hooks | `use<Name>.ts` | `useChartData.ts` |
| Services | `PascalCase.ts` | `AuthService.ts` |
| Utilities | `camelCase.ts` | `dataTransform.ts` |
| Types | `PascalCase.ts` | `User.ts` |
| Constants | `camelCase.ts` | `canvasStyles.ts` |
| Atoms (Jotai) | `<domain>Atoms.ts` | `canvasAtoms.ts` |
| CSS | `PascalCase.css` | `GridCanvas.css` |
| Interfaces | Prefix with `I` | `IBridge.ts` |

### Variable & Function Naming
| Category | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase | `const FilterPanel: React.FC` |
| Hooks | camelCase with `use` | `const useData = ()` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Functions | camelCase | `handleClick()` |
| Types/Interfaces | PascalCase | `UserData` |

---

## 2. TypeScript Standards

### Strict Mode & Import Order
- **Rule**: strict mode enabled. No implicit `any`.
- **Import Order**: React → 3rd Party → Internal Aliases (`@/`) → Relative (`./`) → Styles.

```typescript
// ✅ ALWAYS use proper interfaces
const data: DataPacket = response.data;

// ✅ USE React Patterns
const chartData = useMemo(() => prepareData(raw), [raw]);
const handleClick = useCallback(() => setOpen(true), []);
```

---

## 3. Schema-First Development (Zod)

### Rule: Validate at the Boundary
All external data (API, Files, User Input) MUST be validated using Zod.

```typescript
import { z } from 'zod';
const UserSchema = z.object({ id: z.string() });
const result = UserSchema.safeParse(data);
if (!result.success) {
  // Handle error
}
```

---

## 4. Styling Standards

### Rule: Use Theme Tokens
Never hardcode colors or magic numbers.

```typescript
// ❌ NEVER
sx={{ color: '#757575', p: '16px' }}

// ✅ ALWAYS
sx={{ color: 'text.secondary', p: 2 }}
```

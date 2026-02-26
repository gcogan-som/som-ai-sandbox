# Lessons Learned

> **Purpose**: A collaborative memory of platform quirks, debugging discoveries, and "gotchas".
> **When to Update**: Immediately upon discovering a tricky issue or solution.

---

## Format
```markdown
### [Bug/Quirk Title]
- **Context**: [Environment, version]
- **Issue**: [What happened]
- **Solution**: [How we fixed it]
- **Tags**: #webview2 #rhino #react
```

---

## Knowledge Base

### Confusion over MUI `Grid` vs `Grid2`
- **Context**: Updating to MUI v5.x components in `@som/ui`.
- **Issue**: Standardizing on `Grid` but accidentally using `Grid2` imports in shared templates caused "module not found" or "failed to compile" errors depending on the consuming project's MUI version.
- **Solution**: Explicitly use `import { Grid } from '@mui/material'` in foundation libraries to maintain maximum compatibility with internal tools that may have pinned dependencies.
- **Tags**: #mui #react #build

### Tier 3 Promotion Pattern (Layouts/Templates)
- **Context**: Moving from atomic atoms/molecules to full page layouts.
- **Issue**: Highly specific application logic (e.g., "Mainland China timeout logic") was scattered across root `App.tsx` files.
- **Solution**: Encapsulate complex but common initialization flows into Tier 3 "Templates" (e.g., `StandardAppLoader`). This keeps the consumer code declarative and ensures firm-wide consistency for splash screens and connectivity failure handling.
- **Tags**: #architecture #standardization

### MUI Runtime Error #130 & Deep Import Conflict
- **Context**: Mixing MUI v7 (Grid2) with existing MUI v5/v6 patterns in a multi-repo setup.
- **Issue**: Deep imports like `import Box from '@mui/material/Box'` caused "Minified React error #130" (Element type is invalid) during production builds when certain components were bundled into a library (`@som/ui`) and consumed by an app. This happened because different import paths reached the same component symbol via different internal routes, confusing React's element detection.
- **Solution**: Standardize on **top-level imports** from `@mui/material` (e.g., `import { Box, Grid } from '@mui/material'`). This ensures the bundler treats them as the same module and allows for better tree-shaking in modern Vite/Rollup environments.
- **Tags**: #mui #react #build #debugging

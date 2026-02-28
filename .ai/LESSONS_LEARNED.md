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

### Firebase Storage "Unauthorized" Quirk
- **Context**: Enabling Firebase Storage on an existing project.
- **Issue**: Even after upgrading to the Blaze plan, uploads return `storage/unauthorized` if the bucket hasn't been explicitly provisioned via the "Get Started" button in the Firebase Console. Additionally, security rules must be published *after* provisioning to allow authenticated writes.
- **Solution**: 1. Manually click "Get Started" in Firebase Storage console. 2. Deploy rules via CLI (`firebase deploy --only storage`) or console to ensure `request.auth != null` is enforced. 3. Ensure client-side compression is used to keep files under 100KB to prevent quota overflow.
- **Tags**: #firebase #storage #security

### TypeScript Index Signature Error (TS7053)
- **Context**: Accessing a `Record<K, V>` with a string variable in Strict Mode.
- **Issue**: Attempting to use `CAT_SHORT_INFO[form.type]` failed with TS7053 because `form.type` was typed as `string`, but the Record keys were a specific union of `CategoryName`.
- **Solution**: Explicitly cast the index key to the expected type (e.g., `CAT_SHORT_INFO[form.type as CategoryName]`) or ensure the state variable is strictly typed from the start. This is common when binding MUI Select components to a state that defaults to an empty string.
- **Tags**: #typescript #react #debugging

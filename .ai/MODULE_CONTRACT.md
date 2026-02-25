# SOM Standard — Module Development Contract

> **Last Updated**: 2026-02-18
> **See Also**: `RULES.md`, `ARCHITECTURE.md`

---

## What is a Module?

A **Module** is a self-contained feature, tool, or view that plugs into the application. Modules should be loosely coupled and registered in a central registry.

---

## Step-by-Step: Creating a New Module

### Step 1: Create the Directory
```
src/modules/<ModuleName>/
├── <ModuleName>Module.tsx     ← Main component
├── types.ts                   ← Module-specific types
├── index.ts                   ← Barrel export
└── __tests__/
    └── <ModuleName>Module.test.tsx
```

### Step 2: Define Types
Define your data contracts in `types.ts`.

### Step 3: Implement
Use standard UI components and tokens.

### Step 4: Register
Add your module to the application's registry (e.g., `MarketplaceProvider` or `ModuleRegistry`).

---

## Module Checklist
- [ ] Lives in `src/modules/<Name>/`
- [ ] Has strict types (no `any`)
- [ ] Uses theme tokens (no hardcoded styles)
- [ ] Has tests
- [ ] Registered in system

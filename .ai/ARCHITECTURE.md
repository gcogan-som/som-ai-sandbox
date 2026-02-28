# [Project Name] — Architecture & System Design

> **Last Updated**: 2026-02-18
> **Scope**: High-level system design, data flow, key patterns.

---

## 1. System Overview
[Diagram or description of the system]

## 2. Core Components
- **Frontend**: React / Vite
- **Backend/Identity**: Firebase Auth
- **Data**: Cloud Firestore (NoSQL) & Firebase Storage (Assets)

## 3. Data Flow
[Describe how data moves, e.g., Rhino -> Bridge -> React -> State]

## 4. Key Decisions & Standards
- Use **Jotai** for global state management.
- Use **@som/ui** for all UI components, specifically adhering to the **Atomic Design** hierarchy.
- **Template-First Layouts**: High-level page structures (T3 - Templates) like `StandardAppLoader` and `StandardCollectionGrid` are preferred over raw MUI implementations to ensure cross-tool visual and behavioral consistency.
- **Initialization State**: Application initialization (auth/firebase sync) must be wrapped in `StandardAppLoader` to provide branded feedback and fallback connectivity paths.

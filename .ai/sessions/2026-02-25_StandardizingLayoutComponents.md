# Session: Standardizing Layout Components
> **Date**: 2026-02-25

## Status
Completed the comprehensive standardization and promotion of high-level layout and template components from the `som-ai-sandbox` to the `som-ui` foundation library. This fulfills the Tier 3 (Layout/Template) portion of the UI Audit pipeline.

## Key Changes
- **StandardAppLoader (som-ui)**: Created a robust application initialization shell.
  - Standardized branding (Logo + App Name/Subtitle).
  - Built-in connection timeout logic (5s default).
  - Integrated "Offline Mode" bypass mechanism for regional connectivity issues.
- **StandardSectionHeader (som-ui)**: Promoted and generalized from the sandbox `SecHead`.
  - Added support for item counts in a monospace subtitle format.
  - Added configurable divider visibility (`showDivider`).
  - Standardized font weights and baseline alignment for "nested" section titles.
- **StandardCollectionGrid (som-ui)**: Created a canonical template for list/grid layouts.
  - Standardized grid columns (`xs:12`, `sm:6`, `md:4`) and spacing (`10px` for items).
  - Integrated a standardized empty state (∅ symbol).
  - Combined `useItems` and `learnItems` grid logic into a single reusable component in `som-ai-sandbox`.
- **StandardActionGroup (som-ui)**: Formalized the "Action Cluster" pattern.
  - Manages spacing and optional vertical dividers for header/toolbar icons.
- **StandardBlurOverlay (som-ui)**: Formalized the blurred UI pattern.
  - Handles grayscale, scale effects, and backdrop filters for gating application states.
- **Premium Auth Refinement**:
  - `StandardAuthGate`: Refactored with high-index backdrop blur (30px), refined typography (uppercase thin h1), and high-contrast Google Sign-In button.
- **Sandbox Refactoring**:
  - `App.tsx`: Replaced ~100 lines of manual loading code with `<StandardAppLoader>`.
  - `App.tsx`: Standardized header actions using `<StandardIconButton>` and `Refresh` icons.
  - `AILibraryPage.tsx`: Standardized all section headers and grids using the new templates.
  - `FacetPanel.tsx`: Replaced remaining MUI components with library standard `StandardChip` (density="compact") and `StandardButton` (size="legacy").

## Outstanding Items
- **FilterableList Pattern**: Consider further abstracting `StandardCollectionGrid` into a `FilterableList` that binds to search/facet state directly.
- **Storybook Updates**: The new templates in `som-ui` need corresponding story files for documentation.
- **ARCHITECTURE.md**: Update the library architecture doc to include these Tier 3 templates as canonical choices for new tools.

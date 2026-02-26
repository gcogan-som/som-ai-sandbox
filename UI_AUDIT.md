# SOM Deep Quality UI Audit: `som-ai-sandbox` vs. `som-ui`

*Audit Standard Version: 1.0 (Ref: `.agents/workflows/ui-deep-audit.md`)*

This document applies the rigorous **SOM Deep Quality UI Audit Standard** to the `som-ai-sandbox` repository, evaluating it against the authoritative `som-ui` foundation library. 

This audit explicitly determines structural disparity, enforces zero-diff variant mapping, and critically assesses the *quality* of bespoke components—recommending whether the application should submit to the foundation, or if the foundation should bend to incorporate the application's innovations.

---

## 1. Atomic Structural Bypasses (The Technical Debt) - ✅ COMPLETED

| Raw MUI Primitive Used | Status | Action Taken |
| :--- | :--- | :--- |
| `<Button>` & `<IconButton>` | ✅ Fixed | Refactored `AuthButton`, `StarRating`, `FacetPanel`, `HeroSection`, `ContributeModal`, `RequestModal`, `FeedbackModal` to use `StandardButton` and `StandardIconButton`. |
| `<Chip>` | ✅ Fixed | Refactored `FacetPanel`, `AboutPanel`, `ResourceCard` to use `StandardChip` with `density="compact"`. |
| `<Avatar>` | ✅ Fixed | Refactored `AuthButton` and `ResourceCard` to use `StandardAvatar` with size presets. |
| `<Box sx={{...}}>` | ✅ Resolved | Layout gap tokens in `som-ui` now support granular props. Refactored app layouts. |

---

## 2. Commonality & Qualitative Assessment Chart - ✅ COMPLETED

| Sandbox Component | Status | Action Taken |
| :--- | :--- | :--- |
| **`LibraryFilterBar`** | ✅ Promoted | **OVERWROTE Foundation (`som-ui`)**. Replaced basic filter bar with the generalized sandbox version. Added `renderExtra` support. |
| **`AuthButton`** | ✅ Promoted | **Added to `som-ui`** as `StandardProfileMenu`. Decoupled from Firebase and local atoms. |
| **`StarRating`** | ✅ Promoted | **Added to `som-ui`** as `StandardStarRating`. Supports interactive and read-only modes. |
| **`TagInput`** | ✅ Promoted | **Added to `som-ui`** as `StandardTagInput`. Generalized for firmwide use. |
| **`VerifiedBadge`** | ✅ Promoted | **Added to `som-ui`** as `StandardVerifiedBadge`. |
| **`ResourceCard`** | ✅ Refactored | Refactored internal atoms to use `som-ui`. Maintained domain-specific composition. |
| **`FacetPanel`** | ✅ Refactored | Refactored to consume `StandardChip` and `StandardButton`. |

---

## 3. Deployment & Storybook Standardization Pipeline - ✅ COMPLETED

1. **The Overwrite:** ✅ `som-ui/StandardFilterBar` replaced with the generalized version.
2. **Enrich Variants (Zero-Diff):** ✅ Added `StandardAvatar(size="medium")`, `StandardChip(density="compact")`, and `StandardButton(size="legacy")` to foundation.
3. **Promote Atoms:** ✅ `StandardStarRating`, `StandardTagInput`, and `StandardVerifiedBadge` promoted to `som-ui`.
4. **Abstract Molecules:** ✅ `AuthButton` abstracted to generic `StandardProfileMenu`.
5. **Resolve Sandbox Debt:** ✅ Refactored all sandbox components to consume foundation library. Zero visual shift achieved.

**Audit Closeout Date:** 2026-02-25
**Final Status:** 100% Alignment with `som-ui` v1.1.0 (Audit Passed)

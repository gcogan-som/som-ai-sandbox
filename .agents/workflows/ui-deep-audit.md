---
description: Perform a Deep Quality UI Audit (Parity, Structure, Variants, and Qualitative Assessment)
---

# SOM Deep Quality UI Audit Standard

When requested to audit a specific application against a foundational UI library (e.g., `som-ui`), you must execute the following rigorous methodology. This standard is designed to eliminate technical debt, identify missing components, enforce zero-diff aesthetic shifts, and actively improve the foundation library based on real-world product innovations.

## Step 1: Atomic Structural Parity Check (Grep Analysis)
You must scrutinize the raw source code of the application to identify where developers have bypassed the foundation library.
1. Use `grep_search` to find imports of raw UI primitives (e.g., `@mui/material`'s `<Button>`, `<Box>`, `<Chip>`, `<Avatar>`).
2. Map every instance of a raw primitive bypass to its intended foundational counterpart (e.g., raw `<Button>` -> `StandardButton`).
3. **Goal:** Identify the structural debt where local styling (`sx` props) is overriding global tokens.

## Step 2: Missing Elements & Composition Scrutiny
Analyze the bespoke molecules, organisms, and templates created in the application.
1. **Identify Missing Atoms/Molecules:** Did the application build a bespoke component (e.g., `StarRating`) because the foundation library is missing it?
2. **Deconstruct Organisms:** If the application built a complex `ResourceCard`, determine if it is correctly composing foundation atoms (e.g., `StandardAvatar`, `StandardBadge`), or if it is built from scratch.

## Step 3: Commonality vs. Variant Discernment (The Zero-Diff Rule)
When you find a structural bypass (e.g., a locally styled `<Avatar sx={{ width: 28 }} />`), you must determine the path to standardization that results in **zero visual shifts/diffs** for the application.
1. **The Singular Standard:** Does the app's styling perfectly match the foundation? If yes, propose a simple 1:1 replacement.
2. **The Variant Strategy:** Does the app legitimately require a permutation not natively supported by the foundation (e.g., an Avatar at 28px instead of 24px/32px)? 
   - **DO NOT** propose forcing the app to change its design (breaking the layout).
   - **DO NOT** propose keeping the raw primitive with inline styles (technical debt).
   - **PROPOSE A VARIANT:** Add the new permutation directly to the foundation library's API (e.g., add `size="medium"` to `StandardAvatar`) and update the foundation's Storybook to showcase this new approved permutation.

## Step 4: Qualitative Assessment (Bidirectional Improvement)
An audit is not just about forcing a downstream app to comply; it is about assessing if the downstream app has built something *better* than the foundation.
1. **UX/UI Quality Comparison:** Compare bespoke application components against foundation equivalents. 
2. **Foundation Overwrite Request:** If the application has developed a cleaner, more accessible, or more feature-complete pattern (e.g., a `LibraryFilterBar` that performs better than the old `som-ui/StandardFilterBar`), explicitly propose overwriting the foundation component with the application's upgraded version.
3. **Domain-Specific Flagging:** If a component is highly unique to the app's domain (e.g., an AI `CatIcon` mapper), explicitly flag it to be kept bespoke so it does not bloat the foundation library.

## Output Format
Your final output should be a detailed Markdown artifact (`UI_AUDIT.md`) containing:
1. Executive Summary of Structural Debt.
2. A Data Table detailing: `Component`, `Foundation Equivalent`, `Proposed Action`, and `Qualitative Assessment / Expected Visual Impact`.
3. Clear Action Items for the Foundation Library Maintainers (what new variants/components need to be added to Storybook).

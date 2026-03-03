# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **App Category**: Added a new platform category allowing `.html`, `.jsx`, `.js`, and `.tsx` app uploads with an automated pending state.
- **Admin Approval Engine**: Added an approval workflow restricting visibility and execution of pending apps until explicitly reviewed and approved by an Admin.
- **Preview Images**: Allowed optional standard preview images for all general categories beyond Viz Prompts.
- **User Avatar Resolution**: Added logic to parse user emails on contribution to securely link user avatars to their uploads without exposing Admin metadata.
- **Single Rating Per User**: Implemented individual user rating tracking in Firestore to prevent duplicate vote inflation.
- **Empty State**: Added a "No Results Found" friendly state with filter reset in `AILibraryPage.tsx`.
- **Visual Feedback**: Added "Rating recorded!" visual confirmation in `ResourceDetailModal.tsx`.

### Changed
- **AILibrary UI**: Updated the Hero copy and added a functional feedback footer indicating author ownership.
- **SOM UI Alerts**: Replaced custom pending notices with standard SOM UI `<Alert />` components for visual consistency.
- **Modal Responsiveness**: Updated `ContributeModal` and `ResourceDetailModal` with adaptive widths/heights for mobile and tablet views.
- **Metadata Centralization**: Centralized `CAT_SHORT_INFO` in `categories.ts` for unified tooltips and dropdown descriptions.
- **Mock Data**: Synchronized `mockItems.ts` with the latest rating and category typings.

### Fixed
- **TypeScript index signature (TS7053)**: Resolved item-type indexing issue in `ContributeModal.tsx`.

### Added (Previous)
- **Card Scaling Engine**: Implemented min-height reservation and footer pinning for all Resource Cards.
- **Responsive Viz Prompts**: Added breakpoints for image/text ratios in horizontal layouts.
- **Deployment Pipeline**: Verified build and deploy workflow via Firebase.

### Changed (Previous)
- **ResourceCard**: Improved title and description clamping for better grid alignment.
- **ResourceDetailModal**: Fixed "Open in Gemini" and Clipboard actions (from previous session).

## [0.1.0] - 2026-02-26

### Added
- Initial project structure with SOM UI integration.
- Firebase Hosting, Firestore, and Storage configurations.
- Category-based resource library with filtering.

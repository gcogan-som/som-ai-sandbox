# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Single Rating Per User**: Implemented individual user rating tracking in Firestore to prevent duplicate vote inflation.
- **Empty State**: Added a "No Results Found" friendly state with filter reset in `AILibraryPage.tsx`.
- **Visual Feedback**: Added "Rating recorded!" visual confirmation in `ResourceDetailModal.tsx`.

### Changed
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

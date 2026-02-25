---
description: Standard Protocol for Closing an AI Session
---
This workflow ensures every session is properly documented and handed off, preventing context loss for the next agent session. Run this workflow immediately before concluding a major task or ending a session.

1.  **Generate Session Summary**:
    - Create a new markdown file in `.ai/sessions/` named `YYYY-MM-DD_[Topic].md`
    - Use the following format:
      ```markdown
      # Session: [Topic]
      > **Date**: YYYY-MM-DD
      
      ## Status
      [Brief overview of what was accomplished]
      
      ## Key Changes
      - [Feature/Fix 1] (e.g., Extracted logic into modular core utility)
      - [Feature/Fix 2] (e.g., Added unit tests for X component)
      
      ## Outstanding Items
      - [Task 1 that still needs doing]
      - [Task 2 that was blocked]
      ```

2.  **Update Changelog**:
    - [ ] `view_file` `CHANGELOG.md` (if it exists)
    - [ ] Use `multi_replace_file_content` to prepend the 'Key Changes' from the session into the appropriate section (`Added`, `Changed`, `Fixed`) under the 'Unreleased' or current version header.

3.  **Governance & Bloat Audit**:
    - [ ] Did you introduce a new pattern? Update `.ai/RULES.md`
    - [ ] Did you learn a quirk? Update `.ai/LESSONS_LEARNED.md`
    - [ ] **Bloat Check**: Are there task-scoped scratchpads or stale work plans in `.ai/`? **Delete or Archive them.** keeps context windows clean.
    - [ ] Did you restructure directories? Update `.ai/ARCHITECTURE.md`

4.  **Confirm Quality & Integration Safeguards**:
    - [ ] **Unit Tests**: Have tests been written or updated for any logic changes?
    - [ ] **Host Integrations**: If this integrates with a host application (e.g., Rhino, web browser), have the cross-boundary impacts been documented?
    - [ ] **Build Process**: Have you validated the build process locally?

5.  **Confirm Git Workflow Safeguards**:
    - [ ] Did you modify any shared utility files? Verify their "Blast Radius" is explicitly documented.
    - [ ] **Do NOT merge directly to `main` unless explicitly instructed.** 
    - [ ] Ensure all edits are committed to an isolated feature or fix branch.
    - [ ] Stage and commit the work as a safely restorable `savepoint` or finalized feature.
    - [ ] Ask the user to submit a Pull Request and have the team test integration impacts.

6.  **Final Handoff**:
    - [ ] Send a summary to the user: "Session documented in `.ai/sessions/[file].md`. Context loop closed. Changes committed to branch. Core dependencies flagged. Ready to hand off for review."

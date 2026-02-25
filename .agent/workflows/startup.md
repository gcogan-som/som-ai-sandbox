---
description: Standard Startup Protocol to Enforce .ai Governance
---

This workflow ensures every session begins with the **comprehensive** reading of ALL governance documents and a check for model efficiency. 

0.  **Step 0: Model Suitability Check**:
    - [ ] Run the `/model-selection` protocol.
    - [ ] If the current task is mechanical/bulk, notify the user if a switch to a "Flash" model is recommended.

1.  **Foundation & Knowledge Check**:
    - [ ] `view_file` `SOM_PLATFORM_BIBLE.md` (if it exists) — The single source of truth for architecture and state.
    - [ ] **Check Knowledge Item (KI) Summaries** — Read relevant artifacts from KIs *before* doing fresh research.

2.  **Read Core Governance (Only if not in Bible/KI)**:
    - [ ] `view_file` `.ai/REPO_MAP.md` — Verify your current location in the ecosystem.
    - [ ] `view_file` `.ai/RULES.md`
    - [ ] `view_file` `.ai/GOVERNANCE.md`

2.  **Read Design & Learning**:
    - [ ] `view_file` `.ai/DESIGN_TOKENS.md`
    - [ ] `view_file` `.ai/LESSONS_LEARNED.md`
    - [ ] `view_file` `.ai/DEVIATIONS.md`

3.  **Read Domain-Specific Rules (ALL)**:
    - [ ] `view_file` `.ai/rules/CODING.md`
    - [ ] `view_file` `.ai/rules/QUALITY.md`
    - [ ] `view_file` `.ai/rules/INFRA.md`
    - [ ] `view_file` `.ai/rules/GIT.md`
    - [ ] `view_file` `.ai/rules/WORKSPACE.md`
    - *(Note: Read other relevant tech-stack rules in this folder like CSHARP.md, PYTHON.md, REACT.md if they align with the project's stack).*

4.  **Read Session Context**:
    - [ ] `list_dir` `.ai/sessions/`
    - [ ] `view_file` the latest session file found in `.ai/sessions/`.

5.  **Review System Boundaries & Architecture**:
    - [ ] **Modularity**: Does this new code belong in a core, platform-agnostic library or a host-specific integration (e.g., Rhino plugin, web frontend)?
    - [ ] **Tooling & Building**: Has the build system or infrastructure been consulted for these changes? Will this component require new unit tests?
    - [ ] **Context Loop**: Are we starting the loop fully informed by the previous session's context, and planning to add new context upon wrap-up?

6.  **Acknowledge**:
    - [ ] State clearly: "I have read ALL governance rules, reviewed system boundaries, and read the latest session context. I am ready to proceed."

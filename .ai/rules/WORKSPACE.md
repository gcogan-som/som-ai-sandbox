# SOM Standard — Platform & Execution Guardrails

> **Last Updated**: 2026-02-18
> **Applies To**: Google Workspace, AI Agent Behavior

---

## Google Workspace Protocol
- **Least Privilege**: Request narrowest scopes possible.
- **Data Integrity**: Verify row counts/headers before writing.
- **Safety Valve**: Destructive actions require user confirmation.

## AI Agent Execution Guardrails
1. **HITL**: Proposed action summary required for file modifications.
2. **No Recursion**: Banned from writing self-calling loops to external APIs.
3. **Traceability**: Log decisions and rationale in `logs/` or session handoffs.
4. **Token Sensitivity**: Proactively recommend switching to a lower-tier/Flash model for mechanical or bulk-editing tasks to preserve budget/context health. Refer to `/model-selection` workflow.

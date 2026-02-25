---
description: Proactive Model Selection for Token Efficiency
---

This workflow ensures we use the most cost-effective and token-efficient model for the task at hand. Run this check **immediately after receiving a task** and **before starting a task_boundary**.

## 1. Suitability Matrix

| Task Type | Complexity | Recommended Model |
|-----------|------------|-------------------|
| **Mechanical** | Multi-file search/replace, logging refactors, boilerplate | `Gemini 2.0 Flash` |
| **Documentation** | Scaffolding `.md` docs, updating changelogs, summarizing | `Gemini 1.5 Flash` |
| **Standard Feature** | Local component logic, well-defined unit tests | `Pro Models (Gemini Pro / 3.5 Sonnet)` |
| **Complex Reasoning** | Architecture design, cross-repo dependency logic, hard bugs | `High-end (Ultra / 3.1 Opus)` |
| **High Context** | Researching >20 files without focal points | `Gemini 1.5 Pro (Flash for speed)` |

## 2. Selection Protocol

1.  **Analyze the prompt**: Is this a mechanical heavy-lift or a nuanced logic problem?
2.  **Estimate "Mental Surface Area"**: Does the solution require holding 5+ files in active memory simultaneously?
3.  **Check Current Model**: What am I using now? 
4.  **Recommend & Confirm**: If the task is primarily mechanical, notify the user:
    - *"I can handle this task using Gemini [Flash/Mini] for better token efficiency. Shall I proceed here or do you want to switch models?"*
5.  **Pivot**: If use confirms, let them switch, or proceed if the current model is already the "best fit".

## 3. Reporting

State clearly in the Planning phase:
- "Task classified as [Mechanical/Logical]. Recommended model: [Model Name]."

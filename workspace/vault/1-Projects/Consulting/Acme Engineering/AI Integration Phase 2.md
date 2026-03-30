---
title: AI Integration Phase 2
type: project
client: Acme Engineering
contact: Sarah Chen
status: planning
start_date: 2026-04-01
tags: [project/acme-engineering, consulting, ai-agents, mastra]
---

# AI Integration Phase 2 — Acme Engineering

**Client:** Acme Engineering ([[Sarah Chen]], VP Engineering)
**Status:** Planning
**Scope:** Rearchitect agent layer with persistent state, file system access, and skills

## Goals

1. Replace context-stuffing with file-system-based agent state
2. Introduce Mastra as the agent framework
3. Implement workspace pattern — agents get persistent, searchable storage
4. Build reusable skills for common agent behaviors
5. Deploy with proper sandboxing (E2B or Daytona for production)

## Architecture Direction

```
Agent Request
  → Check workspace for prior context (qmd search)
  → Load relevant skills (SKILL.md)
  → Process request with full context
  → Write results back to workspace
  → Respond to user
```

The key shift: agents don't need everything in context. They need to know how to find things. Same pattern Claude Code uses for codebases.

## Open Questions

- [ ] Which cloud sandbox provider? E2B vs Daytona — need to evaluate pricing
- [ ] How to handle multi-tenant workspaces? Each customer gets isolated storage?
- [ ] Migration path from current hand-rolled agents to Mastra
- [ ] Budget confirmation from James (Sarah handling)

## Dependencies

- [[AI Integration Phase 1]] must complete first
- Sarah needs budget approval
- Damian needs to finalize proposal and SOW

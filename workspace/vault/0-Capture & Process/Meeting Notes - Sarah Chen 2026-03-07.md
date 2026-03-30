---
title: Meeting Notes - Sarah Chen 2026-03-07
date: 2026-03-07
type: meeting-notes
attendees: [Damian Galarza, Sarah Chen]
company: Acme Engineering
tags: [meeting, project/acme-engineering, consulting]
---

# Meeting Notes — Sarah Chen (March 7, 2026)

**Attendees:** Damian Galarza, [[Sarah Chen]]
**Duration:** 45 minutes
**Context:** Deep dive on Acme Engineering's current agent architecture

## Summary

Sarah walked me through their current AI integration. They have three agents in production: a customer support chatbot, a document summarizer, and an internal search tool. All are stateless — every request starts from scratch. The support chatbot is the biggest pain point because customers expect it to remember previous conversations.

## Key Decisions

- Agreed that their agents need persistent state, not just longer context windows
- Will evaluate file-system-based approaches vs. vector DB for agent memory
- Phase 1 (current) wraps up end of March — focused on stabilizing what they have
- Phase 2 starts April — this is where we rearchitect the agent layer

## Architecture Notes

- Current stack: Node.js, Express, PostgreSQL, deployed on AWS ECS
- Using OpenAI GPT-4o for all three agents
- No framework — hand-rolled agent loops with function calling
- Context window stuffing is their current "memory" approach — hitting token limits
- No file system access for any agent

## Action Items

- [ ] Damian: Send writeup on file-system-based agent state patterns
- [ ] Damian: Draft Phase 2 scope and proposal
- [ ] Sarah: Get budget approval for Phase 2 from James (CTO)
- [ ] Sarah: Share their current agent code for architecture review

## Quotes

> "Every morning our support agent wakes up with amnesia. Customers are frustrated." — Sarah

> "We tried making the context window bigger. It helped for a week, then we hit the same wall with more data." — Sarah

## Follow-up

Next call scheduled when Phase 1 wraps. Sarah will book via Cal.com.

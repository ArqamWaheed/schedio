# AGENTS.md — Master Plan for Schedio

## Project Overview
**App:** Schedio (Chrome Extension)
**Goal:** Highlight text to Google Calendar event in < 5 seconds.
**Stack:** Plasmo (React 18 + TS), Gemini 1.5 Flash, Chrome Identity API, Tailwind/Shadcn UI.
**Current Phase:** Phase 1 — Foundation (5-Day Sprint)

## How I Should Think
1. **Understand Intent First**: Before answering, identify what the user actually needs (e.g., a background script vs a content script).
2. **Explain the "Why"**: Since the user is learning, briefly explain extension-specific concepts (Shadow DOM, Manifest V3 constraints) before providing code.
3. **Plan Before Coding**: Propose a plan, ask for approval, then implement.
4. **Verify After Changes**: Run Plasmo's dev build and check the extension management page for errors.
5. **Explain Trade-offs**: Mention why we use background scripts to bypass CSP when calling APIs.

## Plan → Execute → Verify
1. **Plan:** Outline a brief approach (e.g., "I will now create the Gemini parsing utility").
2. **Execute:** Implement one feature at a time.
3. **Verify:** Check the browser console and extension background worker logs.

## Context & Memory
- Treat `AGENTS.md` and `agent_docs/` as living docs.
- Use `.github/copilot-instructions.md` for persistent project rules.

## Current State
**Last Updated:** 2026-02-08
**Working On:** Phase 1 — Foundation
**Recently Completed:** Plasmo + Tailwind + Shadcn init, manifest permissions
**Blocked By:** None

## Roadmap (5-Day MVP)
### Phase 1: Foundation (Day 1-2)
- [x] Initialize Plasmo project with Tailwind/Shadcn
- [x] Configure `manifest.json` for Identity, Storage, and ContextMenus
- [ ] Set up Google Cloud Console OAuth 2.0 Client ID

### Phase 2: Core Logic (Day 3-4)
- [ ] Implement Background Script (Context Menu listener)
- [ ] Build Gemini 1.5 Flash parsing utility (JSON Mode)
- [ ] Create Raycast-style UI Modal (Shadow DOM injection)

### Phase 3: Launch (Day 5)
- [ ] Integrate Google Calendar API (`events.insert`)
- [ ] Implement Success Toasts and Error Handling
- [ ] Configure Global Shortcut (`Cmd+Shift+S`)

## What NOT To Do
- Do NOT use standard `fetch` in Content Scripts for external APIs (use Background Scripts to avoid CSP issues).
- Do NOT delete the Plasmo `assets` folder.
- Do NOT skip the Shadow DOM setup (Shadcn will break without it in extensions).
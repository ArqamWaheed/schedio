# GitHub Copilot Instructions for Schedio

## Project Context
**App:** Schedio (Chrome Extension)
**Stack:** Plasmo, React, Gemini AI, Google Calendar API.
**User Level:** Level C (Explain architectural choices).

## Directives
1. **Read AGENTS.md First:** Always check the current roadmap phase.
2. **Extension Security:** Always suggest making external API calls (Gemini/Google) from the `background/` script, not the `contents/` script, to avoid Content Security Policy (CSP) errors.
3. **Shadow DOM:** When generating UI components for the overlay, ensure they are compatible with Plasmo's `getStyle` for Shadow DOM CSS injection.
4. **JSON Mode:** Ensure all Gemini prompts explicitly request JSON and use the Gemini 1.5 Flash model.
5. **Incremental Progress:** Implement one file at a time (e.g., define the types, then the utility, then the UI).

## Commands
- `pnpm dev` — Run development build
- `pnpm build` — Build for production
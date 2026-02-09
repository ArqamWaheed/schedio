# What I Built

## Meet Schedio — Highlight to Calendar in 5 Seconds ⚡📅

With Schedio installed in your browser, any highlighted text on any webpage is instantly parsed by AI and turned into a Google Calendar event — no tab switching, no copy-pasting, no friction.

Highlight a meeting time, right-click → **"Create Event with Schedio"** (or use the keyboard shortcut), review the pre-filled details in a sleek Raycast-style modal, hit Enter, and you're done. The event lands in your Google Calendar before you even leave the page.

### How It Works

1. **Highlight** any text containing event details on any webpage
2. **Trigger** via right-click context menu or `Alt+Shift+S` shortcut
3. **Review** the AI-parsed event in an inline modal (title, date, time, location — all pre-filled)
4. **Confirm** with one click — event is created in Google Calendar instantly

### Built With

- **Plasmo** (React 18 + TypeScript) — Chrome Extension framework for Manifest V3
- **Gemini 1.5 Flash** — AI-powered text parsing in JSON mode
- **Google Calendar API** — Direct `events.insert` from the browser
- **Chrome Identity API** — Native OAuth 2.0, no backend needed
- **Tailwind CSS + Shadcn UI** — Clean, minimal UI injected via Shadow DOM
- **GitHub Copilot CLI** — Terminal-based AI pair programmer that guided the entire build

### The Role of GitHub Copilot CLI

Schedio was built entirely with GitHub Copilot CLI as my development partner — from initial architecture to production packaging. It authored the PRD, structured the codebase, explained Manifest V3 constraints (CSP, Shadow DOM, service workers), implemented features one file at a time, debugged cross-machine timezone issues in the Google Calendar API, and audited every `chrome.runtime.lastError` call for production polish. As a learner-level developer, I went from "never built an extension" to a shipped `.zip` in under a week.

You can find the extension source on GitHub and follow the instructions to set it up in your browser.

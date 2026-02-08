# Product Requirements Document: Schedio MVP

## Overview
**Product Name:** Schedio
**Problem Statement:** Busy knowledge workers waste 30–90 seconds manually copying, pasting, and formatting event details from the browser into Google Calendar.
**MVP Goal:** Create a "magic" experience where any highlighted text becomes a calendar event in under 5 seconds.
**Target Launch:** 5-Day Sprint (Prototype)

---

## Target Users

### Primary User Profile
**Who:** Knowledge workers and power users (Students, Recruiters, Founders, Engineers).
**Problem:** High mental load and friction when moving data between a browser tab and a calendar.
**Current Solution:** Manual "Copy-Tab-Switch-Paste-Edit-Save" workflow.
**Why They'll Switch:** Schedio offers zero context switching—the user never leaves the current page.

### Personas
*   **The Student:** Highlighting exam dates from a syllabus PDF or class portal.
*   **The Recruiter:** Highlighting interview slots from a LinkedIn message or email.
*   **The Builder:** Highlighting hackathon or meeting times from a GitHub README.

---

## User Journey

### The Story
1.  **Trigger:** User sees a meeting time on a webpage and highlights the text.
2.  **Action:** User right-clicks and selects **"Add to Schedio"** (or uses `Cmd+Shift+C`).
3.  **Processing:** A minimalist Raycast-style modal appears instantly. A "magic" loading state shows the LLM (Gemini) parsing the text into a Title, Date, and Time.
4.  **Verification:** The user glances at the pre-filled fields. Everything looks correct.
5.  **Completion:** User hits `Enter` or clicks "Add to Calendar."
6.  **Success:** A toast notification appears ("Event Saved!"), the modal vanishes, and the user continues their work without ever changing tabs.

---

## MVP Features

### Core Features (Must Have)

| Feature | Description | Priority |
| :--- | :--- | :--- |
| **LLM Text Parsing** | Uses Gemini 1.5 Flash to extract `summary`, `start`, `end`, and `location` from unstructured text. | Critical |
| **Google OAuth 2.0** | Native login via `chrome.identity`. No custom backend required. | Critical |
| **Raycast-Style Modal** | A lightweight React modal injected into the active tab via Plasmo Content Scripts. | Critical |
| **Direct API Injection** | Direct POST request to `calendar.events.insert` via the browser. | Critical |
| **Basic Settings** | Ability to choose which Google Calendar to save to by default. | High |

### Future Features (NOT in MVP)
*   ❌ Recurring events (Every Monday, etc.)
*   ❌ Outlook / Apple Calendar support
*   ❌ Multiple Google Accounts
*   ❌ PDF/Image parsing (OCR)
*   ❌ Natural language chat interface

---

## Success Metrics
1.  **Speed to Value:** Time from "Text Highlight" to "Event Created" must be **< 5 seconds**.
2.  **Parsing Accuracy:** LLM must correctly identify date/time from 90% of standard event strings.
3.  **Zero-Budget Reliability:** Successfully handling Google's Rate Limits (15 RPM) on the Gemini free tier.

---

## UI/UX Direction
**Design Feel:** Minimalist, high-contrast, "Utility-first" (similar to Raycast or Vercel).

### Key Screens
1.  **The Interaction Modal:**
    *   **Input Fields:** Title (Focus first), Date/Time Picker, Location.
    *   **Action Button:** "Add to Calendar" (Primary) and "Cancel" (Esc).
2.  **Auth State:** A simple "Sign in with Google" button inside the extension popup if the user is logged out.
3.  **Success Toast:** A non-intrusive notification at the top-right of the viewport.

---

## Technical Considerations

*   **Framework:** Plasmo (React + Manifest V3).
*   **Intelligence:** Gemini 1.5 Flash (via Google AI Studio API Key).
*   **Authentication:** Chrome Identity API (OAuth 2.0 Client ID).
*   **Storage:** `chrome.storage.local` for user settings and auth tokens.
*   **Mac Integration:** Manifest `commands` for a global shortcut (`Alt+C` or `Cmd+Shift+C`).

---

## Constraints & Requirements
*   **Budget:** $0.00.
*   **Timeline:** 5 days to a working `.zip` file for manual Chrome installation.
*   **Privacy:** No user data should be stored on an external server (Client-side only).
*   **Security:** API Keys must be handled carefully in the extension build.

---

## MVP Completion Checklist

### Phase 1: Foundation (Day 1-2)
- [ ] Plasmo project initialized with Tailwind/Shadcn.
- [ ] Google Cloud Project setup (Calendar API enabled).
- [ ] OAuth 2.0 login flow working in the extension.

### Phase 2: Core Logic (Day 3-4)
- [ ] Context menu "Right-click to capture" working.
- [ ] Gemini API integration: Text selection -> JSON output.
- [ ] UI Modal: Displays JSON data for user review.

### Phase 3: Launch (Day 5)
- [ ] "Add to Calendar" API call successfully creates event.
- [ ] Success toast/error handling implemented.
- [ ] Global Mac Hotkey configured in `manifest.json`.

---

# Chrome Web Store Listing — Schedio

Title: Schedio — Highlight-to-Calendar

Short description
Create Google Calendar events from highlighted text in under 5 seconds.

Long description
Schedio turns any highlighted text on the web into a Google Calendar event — instantly. Highlight a meeting time, right-click and select "Create Event with Schedio" (or use Alt+Shift+S), review a pre-filled Raycast-style modal (title, date, time, location), and confirm. Behind the scenes Schedio uses Gemini (LLM) to parse natural language into structured event data and the Chrome Identity + Google Calendar API to create events in your account.

Key features
- One-click creation: highlight → right-click → confirm
- AI parsing: robust date/time and location extraction using Gemini
- Minimal verification UI: Raycast-style modal to review & edit parsed fields
- Local-first: no external server required for core event creation (Gemini calls go directly to Google’s API from the extension)
- Settings: add your own Gemini API key for higher rate limits

How to use
1. Install the extension from the Chrome Web Store
2. Highlight any event text on a page
3. Right-click → Create Event with Schedio, or press Alt+Shift+S
4. Review parsed title/date/time/location in the modal and click "Create Event"

Permissions explained
- identity: sign in with Google to create Calendar events
- storage: save user settings (custom Gemini key)
- contextMenus: add the right-click menu item
- activeTab & scripting: read selection and inject the modal UI
- host permissions: allow parsing/interaction across sites

Support & privacy
Privacy policy: [PRIVACY_POLICY_URL]
Support email: schedio.help@gmail.com

Suggested screenshots & copy for images
- Screenshot 1: Highlight a meeting time on a webpage and the modal open with parsed event (caption: "Highlight text → Create event instantly")
- Screenshot 2: Editing the modal fields (caption: "Edit parsed details before saving")
- Promotional blurb: "Turn highlighted text into calendar events in seconds — powered by Gemini AI."

Release notes (example)
- v1.0.0 — Initial release: highlight-to-event parsing, modal UI, Google Calendar integration, settings to add your own Gemini key.

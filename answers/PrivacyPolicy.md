Privacy Policy — Schedio

Last updated: [DATE]

1. Overview
Schedio is a browser extension that converts highlighted text into Google Calendar events using an on-device UI and direct calls to third-party APIs (Gemini for parsing and Google Calendar for event creation). This privacy policy explains what data is used, how it is processed, and how you can control it.

2. Information collected and how it’s used
- Highlighted text: When you create an event, the selected text is sent to Gemini (Google's Generative Language API) to parse event details. That parsed data is used to pre-fill the event modal.
- Google OAuth token: Used to call the Google Calendar API and create events in your calendar. The token is obtained only with your consent via chrome.identity and is not stored externally by Schedio.
- Settings: Your Gemini API key (optional) and preferences are stored in chrome.storage.local on your device.

3. Third-party services
- Gemini / Google Generative Language API: Selected text may be sent to Gemini for parsing. The extension does not act as an intermediary server — calls go directly from the extension to Google’s APIs.
- Google Calendar API: Events are created using your Google account via OAuth; Schedio does not read or export your calendar events beyond creating the event you confirm.

4. Data storage and retention
Schedio does not persist selected text or created events on any external servers. User settings (including an optional Gemini API key) are stored locally in the browser's storage.

5. Security
All network calls are made over HTTPS. OAuth tokens are managed by Chrome's identity API and handled per Chrome’s security model.

6. OAuth verification and sensitive scopes
Schedio requests the Calendar events scope to create events in your calendar. Because this is a sensitive scope, the OAuth consent screen may need to be verified by Google before the extension is available to external users; see the publishing guide for details.

7. Your choices
- You can remove the optional Gemini API key at any time from the extension Settings.
- You can revoke the extension’s access to your Google account from your Google account security settings or by using the extension’s "Switch Google Account" button.

8. Contact
For questions or privacy requests contact: schedio.help@gmail.com

9. Changes
This policy may be updated; the latest version is available in the extension listing.

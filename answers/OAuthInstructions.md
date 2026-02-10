OAuth Verification — Quick Guide for Schedio

Schedio requests the Calendar events scope (sensitive) to create events on behalf of the user. Publishing to the Chrome Web Store for external users requires configuring the OAuth consent screen and likely going through Google’s verification process.

Steps
1. Create or select a Google Cloud project
   - Visit https://console.cloud.google.com and either create a new project or select an existing one.

2. Enable the Google Calendar API
   - APIs & Services → Library → search for "Google Calendar API" → Enable.

3. Configure OAuth consent screen
   - APIs & Services → OAuth consent screen
   - App type: External (if releasing publicly)
   - App name: Schedio
   - App logo: optional
   - Authorized domains: add the domain where your privacy policy is hosted (e.g., yoursite.com or username.github.io)
   - Scopes: add `https://www.googleapis.com/auth/calendar.events` and any other scopes used
   - Test users: while unverified, you can add tester accounts to allow them to use the app
   - Save and continue

4. Create OAuth credentials
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - For Chrome extensions, create an "OAuth client ID" appropriate for your extension (the exact type may vary over time; follow Google’s current guidance). Copy the client ID.
   - Add the client ID to your extension manifest/settings (the project currently stores it in package.json manifest.oauth2.client_id)

5. Submit for verification
   - In the OAuth consent screen, click "Submit for verification" and provide required evidence: privacy policy URL, screencast showing the extension flow (how users sign in and how the scope is used), justification for sensitive scopes, and a contact email.
   - Respond to any follow-up reviewer requests.

Notes & common pitfalls
- The verification team often requests a short screencast demonstrating the login and calendar-writing flow — prepare a simple 60–90 second recording.
- Make sure the privacy policy is hosted on the domain you add to Authorized domains.
- Verification can take several days to a few weeks depending on scope and reviewer load.

If you want, I can draft the OAuth justification text and a short screencast script for the verification submission.
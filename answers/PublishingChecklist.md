Publishing Checklist — Chrome Web Store (Schedio)

1) Dev account
- Sign in to the Chrome Web Store Developer Dashboard: https://chrome.google.com/webstore/developer/dashboard
- Complete developer registration (one-time fee may apply) and provide a support contact email.

2) Prepare assets & info
- build/chrome-mv3-prod.zip ready
- StoreListing.md copy, screenshots, icons, privacy policy URL, support email
- Version in manifest.json updated to match the package

3) OAuth & Google verification
- Because Schedio uses Google Calendar scopes, configure an OAuth consent screen in Google Cloud Console and submit for verification. This step is required for public distribution (sensitive scope).

4) Upload & listing
- Create a new item in the Developer Dashboard
- Upload the ZIP
- Fill in listing fields (title, short + long descriptions, screenshots, icons, categories, privacy policy, support email)
- Save draft and preview

5) Publish
- Publish the item; Google will queue it for review. OAuth verification may be required before the listing is allowed to access sensitive scopes for external users.

6) Post-publish
- Monitor play store listing and support inbox
- If OAuth verification requires changes, respond to Google’s reviewer requests. Verification can take several days depending on scope and provided evidence.

Quick tips
- Host a public privacy policy before submission (GitHub Pages works)
- Prepare a short screencast or step-by-step screenshots that clearly show the extension in action (these are frequently requested by Google during verification)
- Remove any embedded/shared API key from production builds to prevent key leakage

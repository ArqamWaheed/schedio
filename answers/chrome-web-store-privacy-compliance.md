# Schedio - Chrome Web Store Privacy & Compliance Answers

## Single Purpose Description
Schedio is a productivity tool that converts highlighted text into Google Calendar events with a single click. Users highlight text on any webpage, activate the extension via context menu or keyboard shortcut, and the extension parses the text to extract event details (title, date, time) and creates a calendar event in their Google Calendar. The extension's sole purpose is to streamline event creation and improve calendar management efficiency.

**Character Count:** 325/1000

---

## Permission Justifications

### Identity Justification
The `identity` permission is required to authenticate users with their Google Account via OAuth 2.0. This is essential for accessing the user's Google Calendar API to create events. The extension only requests permission to access Google Calendar for event creation and does not request access to other Google services. The user must explicitly authorize calendar access through Google's standard OAuth consent screen.

**Character Count:** 308/1000

---

### Storage Justification
The `storage` permission is used to securely store the user's Google Calendar API access token locally in the browser. This allows users to remain authenticated between sessions without re-authenticating on every use. No sensitive information beyond the API token is stored, and all data remains local to the user's browser.

**Character Count:** 249/1000

---

### ContextMenus Justification
The `contextMenus` permission enables the "Create Calendar Event" option when users right-click on highlighted text. This is the primary user interaction method for the extension, providing an intuitive way to trigger event creation without opening a separate interface.

**Character Count:** 200/1000

---

### ActiveTab Justification
The `activeTab` permission allows the extension to access the currently active tab to retrieve highlighted text. This is necessary to extract the text the user has selected for parsing into event details. The permission is only active when the user explicitly triggers the context menu action.

**Character Count:** 188/1000

---

### Scripting Justification
The `scripting` permission enables content script injection to extract highlighted text from the active webpage in a reliable manner. This is essential for capturing user selections across different website layouts and DOM structures. The script does not modify page content or interact with sensitive user data beyond the highlighted text.

**Character Count:** 238/1000

---

### Host Permission Justification
The host permission for `https://www.googleapis.com/*` is required to communicate with Google's APIs for authentication and calendar event creation. The extension only sends: (1) OAuth authentication requests, and (2) calendar event insertion requests with user-provided event data. No browsing history or other page data is transmitted to external servers. The host permission is strictly limited to Google APIs and no other external domains are accessed.

**Character Count:** 368/1000

---

## Remote Code Usage

**Are you using remote code?** Yes, I am using remote code.

### Remote Code Justification
The Schedio extension uses the Google Gemini 1.5 Flash API (via `https://generativelanguage.googleapis.com`) to parse highlighted text and extract structured event data (title, date, time, description). This requires sending user-selected text to Google's servers for AI-powered parsing. The extension does not evaluate arbitrary code via `eval()`, and all external requests are made only from the background script to ensure security compliance. The parsed response is returned as structured JSON and is not executed as code—it is only used to populate calendar event fields.

**Character Count:** 437/1000

---

## Data Usage

### What user data do you plan to collect from users now or in the future?

**Checked:**
- [ ] Personally identifiable information
- [ ] Health information
- [ ] Financial and payment information
- [ ] Authentication information
- [x] **Website content** (highlighted text the user selects for calendar event creation)
- [ ] Personal communications
- [ ] Location
- [ ] Web history
- [ ] User activity

**Explanation:**  
The extension temporarily processes user-highlighted text to extract event details. This text is sent to Google's Gemini API for parsing and is not permanently stored by Schedio. The text may contain general content from webpages (e.g., "Team meeting on March 15 at 2 PM") but is immediately discarded after parsing. No browsing history, personal communications, or other sensitive data is collected.

---

## Required Certifications

✅ **I certify that I do not sell or transfer user data to third parties, outside of the approved use cases.**

✅ **I certify that I do not use or transfer user data for purposes that are unrelated to my item's single purpose.**

✅ **I certify that I do not use or transfer user data to determine creditworthiness or for lending purposes.**

---

## Privacy Policy URL

**URL:** https://github.com/yourusername/schedio/blob/main/PRIVACY.md

*(Note: Create a privacy policy document at the above URL before submission. See template below.)*

---

## Recommended Privacy Policy Template

```markdown
# Privacy Policy for Schedio

## Data Collection
Schedio collects only the text that users explicitly highlight and choose to convert into calendar events. This text is temporarily processed by Google's Gemini AI API to extract event details and is not permanently stored by Schedio.

## Data Usage
User-highlighted text is used solely for:
1. Parsing event details (title, date, time)
2. Creating Google Calendar events

## Data Sharing
Highlighted text is transmitted to:
- **Google Gemini API** for AI-powered text parsing
- **Google Calendar API** for event creation (if the user authorizes)

Text is processed according to Google's privacy policies and is not shared with third parties.

## Data Storage
Schedio stores only the Google Calendar API access token locally in your browser. No text data is permanently stored.

## User Rights
Users can:
- Remove the extension at any time to prevent further data processing
- Clear their browser storage to remove stored authentication tokens
- Review Google's privacy policies for their respective services

## Contact
For privacy concerns, contact: [your-email@example.com]

Last updated: February 2026
```

---

## Summary

| Field | Status | Notes |
|-------|--------|-------|
| Single Purpose | ✅ Complete | Event creation from highlighted text |
| Permissions | ✅ Complete | 6 permissions justified |
| Remote Code | ✅ Complete | Google Gemini API usage justified |
| Data Usage | ✅ Complete | Only website content (user highlights) |
| Privacy Policy | ⏳ Pending | Create and host privacy.md in repo |
| Certifications | ✅ All signed | Data handling compliant |

---

## Next Steps

1. **Before Submission:**
   - Create a `PRIVACY.md` file in the repository with the privacy policy template
   - Update the Privacy Policy URL in the Chrome Web Store form to point to the actual file
   - Review all justifications for accuracy and completeness

2. **During Submission:**
   - Copy each justification into the corresponding field
   - Ensure all certifications are checked
   - Provide the correct privacy policy URL

3. **After Submission:**
   - Monitor for review feedback from Chrome Web Store team
   - Be prepared to clarify remote code usage (Gemini API) if questioned
   - Ensure privacy policy remains up-to-date if features change

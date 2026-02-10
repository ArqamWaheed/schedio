Store Assets Checklist — Schedio

Files you should prepare for the Chrome Web Store listing:

1) Icons
- Main icon (recommended): 128x128 PNG (square) with transparent background. This is used on the store listing and as the extension icon in Chrome.
- Optional: 256x256 high-resolution PNG for promotional uses.

2) Screenshots & promotional images
- At least 1 screenshot showing the modal populated from a highlighted selection (high-resolution PNG). Capture the exact flow: highlight → modal → create.
- Optional hero/banner: a wide promotional image used in marketing (high-res PNG).
- Include captions for each screenshot describing the step.

3) Short & long descriptions
- Short description (1 sentence): "Create Google Calendar events from highlighted text in under 5 seconds."
- Long description: full feature + privacy + how-to (see answers/StoreListing.md for copy you can paste).

4) Privacy policy & support contact
- Hosted privacy policy URL (must be a public URL). If you don't have a website, you can temporarily host the privacy policy on GitHub Pages or a simple S3/static site.
- Support email address.

5) Build artifact
- The packaged ZIP (.zip) produced by Plasmo (build/chrome-mv3-prod.zip).
- Confirm the ZIP contains a valid manifest.json and that the manifest's version matches the listing.

6) Release notes
- A short ‘what’s new’ string for the initial upload.

Notes
- Keep all images high-resolution and readable at small sizes. Avoid excessive text inside images.
- Do NOT include private API keys inside the extension binary if you are publishing publicly. If your build currently includes a shared Gemini API key, remove it from the build and require users to add their own key in Settings or implement a server-side proxy with rate limits and security.

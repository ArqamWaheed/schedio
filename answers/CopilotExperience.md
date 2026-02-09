# How GitHub Copilot CLI Improved My Developer Experience

## 1. Eliminating the "Context-Switching Tax"

During the development of Schedio, my biggest hurdle was navigating Chrome's Manifest V3 extension APIs — Content Security Policy restrictions, Shadow DOM injection, background service worker constraints, and OAuth 2.0 flows via `chrome.identity`. In a traditional workflow, I would have spent hours context-switching between my terminal, Chrome extension docs, and StackOverflow trying to figure out why my Gemini API call was getting blocked in the content script. Using Copilot CLI, I described the error in natural language and immediately learned that external API calls must go through the background script to bypass CSP — a Manifest V3 constraint that isn't obvious to newcomers. This kept me in a flow state and turned what would have been a full evening of doc-diving into a 30-second conversation.

## 2. Interactive Debugging & Self-Correction

One of the standout moments was debugging a timezone bug after cloning Schedio to a new machine. Event times were consistently showing up 5 hours off in Google Calendar despite the UI modal displaying them correctly. I described the symptom to Copilot CLI, and it didn't just give me a fix — it traced the entire data flow from Gemini's ISO8601 response through the content script's `parseDateTime` function to the Google Calendar API call, and explained that the `+05:00` offset in the `dateTime` string was conflicting with the `timeZone` field, causing a double-conversion. It then identified that Chrome's MV3 background service worker can report a different timezone than the browser tab, which was the root cause. This turned a frustrating cross-machine bug into a clear learning moment about how extension architecture affects runtime behavior — effectively acting as a senior pair programmer sitting next to me in the terminal.

## 3. Rapid Prototyping of the "Boring Stuff"

Copilot CLI was most useful for all the repetitive setup work that usually slows projects down. Things like wiring content scripts to background scripts, setting up TypeScript types, handling Chrome identity tokens, and scaffolding Google Calendar API requests were done in minutes instead of hours.

It also helped catch small but important issues early, like unchecked chrome.runtime.lastError cases that could have caused noisy errors for users later on. That kind of cleanup is easy to miss when you’re moving fast.

Because Copilot handled the initial scaffolding and routine code, I could spend my time where it actually mattered — designing the UX. I focused on making the flow feel instant: highlight text, open a clean modal, confirm, and see the event appear in your calendar almost immediately.

What would normally have been a multi-week learning curve ended up as a focused 5-day sprint, largely because Copilot reduced friction at every step.

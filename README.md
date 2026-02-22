<p align="center">
  <img src="assets/icon.png" alt="Schedio" width="128" />
</p>

<h1 align="center">Schedio</h1>

<p align="center">
  <strong>Highlight text → Google Calendar event in under 5 seconds.</strong><br />
  A Chrome extension powered by Gemini AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/chrome-extension-blue?logo=googlechrome" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/built%20with-Plasmo-orange" alt="Built with Plasmo" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## ⚡ Quick Start (First 100 Users)

The extension ships with a **built-in OAuth client** and a **shared Gemini API key** so you can get started immediately — no Google Cloud setup required.

> **Note:** The built-in OAuth client is limited to **100 authorized users** by Google (while the app is unverified). If you hit an authorization error, follow the [Self-Hosted Setup](#-self-hosted-setup) section below to configure your own credentials.

### 1. Clone & Install

```bash
git clone https://github.com/arqamwd/schedio.git
cd schedio
pnpm install
```

### 2. Package the Extension

```bash
pnpm package
```

This creates `build/chrome-mv3-prod.zip`.

### 3. Load in Chrome

1. **Extract the zip:**
   - Find `build/chrome-mv3-prod.zip`
   - Extract it to a folder (right-click → "Extract All" on Windows, double-click on Mac, or `unzip build/chrome-mv3-prod.zip -d build/chrome-mv3-prod` in terminal)
2. Open **chrome://extensions**
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the **extracted folder** (`build/chrome-mv3-prod`)

### 4. Use It

1. **Highlight any text** on a webpage that describes an event
2. **Right-click → "Create Event with Schedio"** or press **Alt + Shift + S**
3. A modal appears with the parsed event details — edit if needed
4. Click **Add to Calendar** → done ✅

---

## 🎯 How It Works

```
Highlight text → Gemini AI extracts event details → You review → One click to Google Calendar
```

1. **You highlight** text like _"Team standup, Friday 3pm, Room 204"_
2. **Gemini AI** parses it into structured data (title, date, time, location)
3. **A modal overlay** shows the parsed event for you to review or edit
4. **One click** sends it to Google Calendar via the Calendar API

Schedio handles timezone offsets deterministically in code — Gemini only extracts the raw date/time text, never does timezone math.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🤖 **AI Parsing** | Gemini 2.5 Flash extracts event details from any highlighted text |
| 📅 **Google Calendar** | Creates events directly via the Calendar API |
| ⌨️ **Keyboard Shortcut** | `Alt + Shift + S` (customizable in `chrome://extensions/shortcuts`) |
| 🖱️ **Context Menu** | Right-click → "Create Event with Schedio" |
| 🎨 **Inline Modal** | Raycast-style overlay to review/edit before saving |
| 📆 **Date Picker** | Built-in calendar picker for quick date changes |
| 🔑 **Custom API Key** | Bring your own Gemini key for unlimited personal usage |
| 🔄 **Account Switching** | Switch Google accounts from the settings page |

---

## 🛠️ Self-Hosted Setup

If the built-in OAuth client has hit its 100-user cap, or you want full control, follow these steps to configure your own Google Cloud credentials.

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### Step 2: Create a Google Cloud OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. **Enable the Google Calendar API:**
   - Go to **APIs & Services → Library**
   - Search for **Google Calendar API**
   - Click **Enable**
4. **Configure the OAuth consent screen:**
   - Go to **APIs & Services → OAuth consent screen**
   - Choose **External** user type
   - Fill in the app name (e.g. "Schedio") and your email
   - Add the scope: `https://www.googleapis.com/auth/calendar.events`
   - Add your email as a **test user**
   - Save
5. **Create OAuth credentials:**
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Application type: **Chrome Extension**
   - Name: `Schedio`
   - Item ID: Your extension's ID (find it at `chrome://extensions` with Developer mode on)
   - Click **Create**
   - Copy the **Client ID** (looks like `xxxx.apps.googleusercontent.com`)

### Step 3: Configure the Extension

1. **Create your `.env.local`** in the project root:

   ```bash
   PLASMO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Update the OAuth client ID** in `package.json` under `manifest.oauth2`:

   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/calendar.events"
     ]
   }
   ```

3. **Update the extension key** in `package.json` under `manifest.key`:
   - This ensures a consistent extension ID across installs
   - You can generate one or remove the `key` field entirely for local development (Chrome will assign a random ID — just make sure it matches your OAuth client's Item ID)

4. **Build and load:**

   ```bash
   pnpm package
   ```

   Extract `build/chrome-mv3-prod.zip`, then load the extracted folder as an unpacked extension (see [Quick Start](#-quick-start-first-100-users) step 3).

### Step 4: Add Your Gemini Key in the Extension

Even after setting the `.env.local` key (which acts as the shared default), you can override it per-install:

1. Right-click the Schedio extension icon → **Options**
2. Paste your Gemini API key
3. Click **Save**

This key is stored locally in `chrome.storage.local` and is never sent anywhere except Google's Gemini API.

---

## 📁 Project Structure

```
schedio/
├── src/
│   ├── background/index.ts   # Service worker: context menu, API calls, auth
│   ├── content.tsx            # Content script: overlay modal injection
│   ├── popup.tsx              # Extension popup UI
│   ├── options.tsx            # Settings page (API key, account, shortcuts)
│   ├── components/
│   │   ├── event-modal.tsx    # Raycast-style event review modal
│   │   ├── calendar-picker.tsx
│   │   └── ui/               # Shadcn-based UI primitives
│   ├── lib/
│   │   ├── gemini.ts          # Gemini AI parsing + timezone handling
│   │   └── utils.ts
│   ├── types/
│   │   ├── events.ts          # CalendarEvent type
│   │   └── messages.ts        # Message types for background ↔ content
│   └── style.css              # Tailwind + custom styles
├── assets/                    # Extension icons
├── package.json               # Plasmo config + manifest overrides
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## 🧑‍💻 Development

```bash
# Install dependencies
pnpm install

# Start dev server (hot reload)
pnpm dev

# Production build
pnpm build

# Package for distribution (.zip)
pnpm package
```

Load the dev build from `.plasmo/chrome-mv3-dev` during development.

---

## ⚙️ Architecture Notes

- **All external API calls** (Gemini, Google Calendar) happen in the **background service worker**, not the content script. This avoids Content Security Policy (CSP) violations in Manifest V3.
- **Shadow DOM:** The overlay modal is injected via Plasmo's content script system with Shadow DOM isolation, so page styles don't leak in and extension styles don't leak out.
- **Timezone handling:** Gemini returns naive datetimes (no timezone). The extension computes the correct UTC offset for the event's specific date (DST-aware) and appends it deterministically in code — the LLM never does timezone math.

---

## 📝 License

MIT © [Arqam Waheed](https://github.com/arqamwaheed)

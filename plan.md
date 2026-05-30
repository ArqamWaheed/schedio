# Schedio — Product & Launch Plan

> Living plan for taking Schedio from hackathon project → launched product.
> Target near-term milestone: **dev.to GitHub Finish-Up-A-Thon** submission (due **June 7, 2026**).

---

## 0. Hackathon framing (dev.to GitHub Finish-Up-A-Thon)

Judging criteria: use of tech · usability/UX · originality · **completion arc (clear before/after)**.

The "after" that demonstrates *finishing* the project = **landing page + OAuth verification + public Chrome Web Store listing**.
Monetization is part of the *vision/roadmap narrative*, not a launch blocker for the submission.

---

## 1. The launch blocker — two SEPARATE gates

We were conflating two different approvals:

1. **Chrome Web Store review** → gets the extension *listed*. Can publish while OAuth is unverified.
2. **Google OAuth verification** → lets *anyone* sign in without the warning. Required because we use the
   **sensitive scope** `calendar.events`.

Until OAuth is verified we are stuck with:
- "Google hasn't verified this app" warning screen, and
- a hard **100-user cap**.

### Why "no landing page" is the actual blocker (the chain)

Google OAuth verification **requires**:
- An **Application Home Page** on a **domain we own + have verified** (Google Search Console).
- A **Privacy Policy URL on that same verified domain**.
- The domain listed under **Authorized domains** on the consent screen.

No landing page → no authorized domain → can't even *submit* for verification → stuck unverified at 100 users.

**Keystone unlock:** one **GitHub Pages site** solves home page + hosted privacy policy + verifiable domain at once.

### Gap checklist
- [ ] **Landing page** on an owned domain (GitHub Pages) — keystone
- [ ] **Hosted privacy policy** at a stable public URL (currently only `answers/PrivacyPolicy.md`, unpublished; compliance doc still has placeholder `yourusername` URL)
- [ ] **Verify domain** in Google Search Console
- [ ] **OAuth consent screen** fully filled + **Submit for verification**
- [ ] **YouTube demo video** of the OAuth + calendar-write flow (Google almost always requires this for sensitive scopes)
- [ ] **Remove shared Gemini key** from the production build (leak + rejection risk)
- [ ] **Chrome Web Store dev account** ($5 one-time) + listing assets (icons, screenshots)
- [ ] Fix model-name inconsistency (README says **Gemini 2.5 Flash**; compliance doc/instructions say **1.5 Flash**)

---

## 2. Post-launch: do updates need re-verification?

**Chrome Web Store updates:** every version is reviewed (usually fast — hours to ~1–2 days for minor/no-new-permission updates), then **auto-rolls out** silently to all users. Supports percentage rollouts.

**Google OAuth verification:** verified **once**; normal updates do **not** re-trigger it. Re-verification only if we:
- add a **new sensitive/restricted scope** (e.g. broaden to full `calendar`, or add Gmail/Drive),
- change the OAuth app **identity** (name, logo, homepage/privacy-policy domain), or
- add new authorized domains.

Implications:
- Voice-to-text, recurring events, paid tiers → **no new Google scopes → no re-verification.**
- Outlook/iCloud providers → use **their own** OAuth verification (separate from Google).
- **Request the narrowest scope now** (`calendar.events` ✅ already) to avoid future re-verification.

---

## 3. Product / monetization strategy

### 3a. Which AI model? (Gemini vs Groq)
- AI cost is **already ~zero**: task is tiny (~500 in + ~150 out tokens) ≈ **$0.0001/event** → 10k events ≈ **$1**.
- "Switch because Gemini is expensive" = false premise. Flash is among the cheapest + has guaranteed JSON mode.
- Only reasons to move to Groq: **lower latency** (helps the "<5s" promise) or **reduce Google dependence**.
- **Decision:** stay on **Gemini Flash** for now; revisit only if latency disappoints.

### 3b. BYOK (Bring Your Own Key)?
- BYOK **kills conversion for non-technical users** (~90% drop-off).
- Since AI cost is trivial, the "BYOK saves me money" argument collapses.
- **Decision:**
  - **Default = we host the key** (absorb the negligible cost, funded by paid tiers).
  - Keep **BYOK as an optional power-user "unlimited" escape hatch** (already in Settings).
  - Protect with a **server-side proxy + per-user rate limits**; never ship a shared key in the public build.

### 3c. Paid tiers
Anchor tiers to cost-bearing / high-value features; gate volume on Free.

| | **Free** | **Pro (~$3–5/mo)** | **Power/Team (later)** |
|---|---|---|---|
| Text → event | ✅ ~20–30/mo cap | ✅ Unlimited | ✅ Unlimited |
| Calendars | Primary Google only | Multiple Google calendars | Shared team calendars |
| Providers | Google | + Outlook / iCloud / CalDAV | All |
| **Voice → event** | ❌ | ✅ (real cost → justifies Pro) | ✅ |
| Recurring events | Basic | Smart recurrence | ✅ |
| Smart defaults (durations, locations, attendees) | ❌ | ✅ | ✅ |
| Bulk / multi-event from one selection | ❌ | ✅ | ✅ |
| BYOK "unlimited" | optional | optional | n/a |
| Priority / latency | standard | faster model tier | faster |

Reasoning: **voice-to-text** = natural Pro anchor (genuine marginal cost → users accept paying). **Outlook** = large underserved market, low cost to us. Free tier usable but volume-capped so the habit forms before the paywall.

---

## 4. Repo / housekeeping notes
- `.env` is gitignored (only placeholder `.env.example` tracked) — no secrets in git.
- OAuth `client_id` in `package.json` is **not** secret.
- **Keep repo public** — the hackathon judges before/after + Copilot usage; privating hurts the submission.
- Real exposure to fix = **shared Gemini key in the production build** (build-time concern, not git).

---

## 4b. Open-source "before" vs proprietary "after" (repo strategy)

Goal: keep the hackathon "before" public, but don't ship a paid product as fully open source.

Plan:
- **Keep `ArqamWaheed/schedio` public + untouched** = the "before" / origin story for the hackathon.
- **New PRIVATE repo** (e.g. `schedio-app`) for the commercial product.
  - Start it with **fresh git history** (copy files + `git init` new) rather than `git clone`, so the
    MIT license/tags don't carry over. (Note: history is confirmed secret-free, so this is for the
    *license reset*, not secret hygiene.)
  - **Replace MIT `LICENSE`** with proprietary / "All rights reserved".

License nuance:
- The old MIT snapshot is permanently forkable (can't un-publish it) — competitors could fork the
  *old MVP* but never the new premium features. You own the copyright, so the new repo can be fully closed.

Recommended architecture — **open-core**:
- A Chrome extension's client is inspectable anyway (anyone can unzip an installed extension), so hiding
  the client buys little.
- Put the **moat server-side in a private backend**: API-key-holding proxy, billing/Stripe, rate limiting,
  license checks, premium model orchestration. (This is the same proxy the BYPK/hosted-key plan needs.)
- Then "is the client repo public?" becomes low-stakes.

Hackathon submission mapping:
- **Before** = old public repo + old post.
- **After** = live built app + demo video + Copilot story (private "after" repo is fine; rules need a demo,
  not a public after-repo).

### Secret-hygiene status (verified)
- No Gemini key (`AIza…`) in any commit/branch; `PLASMO_PUBLIC_GEMINI_API_KEY` only ever placeholder.
- `.env` never tracked. Git history is clean.
- Remaining real exposure = **shared Gemini key baked into the distributed build `.zip`** (runtime/build
  concern, NOT git) — remove before public launch.

---

## 5. Suggested order of execution
1. Build **landing page + hosted privacy policy** (GitHub Pages) — unlocks OAuth verification path.
2. Verify domain (Search Console) → finish OAuth consent screen → record demo video → **submit for verification**.
3. Remove shared key from prod build; wire server-side proxy + rate limits (or default-key plan).
4. Prepare Web Store listing assets → upload → publish.
5. Write the dev.to submission (before/after + Copilot story) using `answers/WhatIBuilt.md` + `answers/CopilotExperience.md`.
6. (Post-launch) Implement paid tiers + voice-to-text + extra providers.

# Tech Stack & Tools
- **Framework:** Plasmo (React 18 + TypeScript) - Best for Manifest V3.
- **AI Engine:** Gemini 1.5 Flash (via Google AI Studio).
- **Styling:** Tailwind CSS + Shadcn UI.
- **Auth:** Chrome Identity API (OAuth 2.0).
- **Icons:** Lucide React.

## Gemini Implementation Pattern (JSON Mode)
```typescript
const prompt = `Extract event details... Current time: ${new Date().toISOString()}. Return ONLY JSON.`;
// Use fetch to https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
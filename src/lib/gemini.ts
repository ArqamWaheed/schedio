import type { CalendarEvent } from "~types/events"

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

const RATE_LIMIT_MESSAGE =
  "Rate limit reached on the shared API key. Go to Schedio Settings (right-click extension icon → Options) and add your own free Gemini API key for unlimited usage."

async function getApiKey(): Promise<string> {
  // Check for user's custom key first
  const result = await chrome.storage.local.get("geminiApiKey")
  if (result.geminiApiKey) {
    return result.geminiApiKey
  }
  // Fall back to built-in key
  const builtInKey = process.env.PLASMO_PUBLIC_GEMINI_API_KEY
  if (!builtInKey) {
    throw new Error("Gemini API key not configured")
  }
  return builtInKey
}

export async function parseTextToEvent(text: string): Promise<CalendarEvent> {
  const apiKey = await getApiKey()

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date().toLocaleString("en-US", { timeZone: tz, dateStyle: "full", timeStyle: "long" })
  const prompt = `Extract event details from this text. Current time: ${now} (timezone: ${tz})
Return JSON: {"title":"","description":"","startTime":"ISO8601 with offset","endTime":"ISO8601 with offset","location":""}
IMPORTANT: Return times with the correct timezone offset (e.g. 2026-02-08T21:00:00-05:00), NOT in UTC.
Default to 1hr duration if end not specified. Default 9AM if no time given. Resolve relative dates.
Text: "${text}"`

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    // Detect rate limiting and prompt user to add their own key
    if (response.status === 429) {
      const isUsingSharedKey = !(await chrome.storage.local.get("geminiApiKey")).geminiApiKey
      if (isUsingSharedKey) {
        throw new Error(RATE_LIMIT_MESSAGE)
      }
      throw new Error("Rate limit reached. Please wait a moment and try again.")
    }
    throw new Error(
      errorData.error?.message || `Gemini API error: ${response.status}`
    )
  }

  const data = await response.json()
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) {
    throw new Error("No response from Gemini")
  }

  const parsed: CalendarEvent = JSON.parse(rawText)

  if (!parsed.title || !parsed.startTime || !parsed.endTime) {
    throw new Error("Gemini returned incomplete event data")
  }

  return parsed
}

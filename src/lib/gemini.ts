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

/** Compute the UTC offset string for a given date, e.g. "-05:00" or "-04:00" */
function getUtcOffsetForDate(date: Date): string {
  const offsetMin = date.getTimezoneOffset()
  const sign = offsetMin <= 0 ? "+" : "-"
  const abs = Math.abs(offsetMin)
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`
}

/** Strip any timezone suffix and append the correct local offset for that date */
function toLocalIso(naive: string): string {
  const stripped = naive.replace(/([Zz]|[+-]\d{2}:\d{2}|[+-]\d{4})$/, "")
  // Use the event's own date to compute the offset (handles DST correctly)
  const eventDate = new Date(stripped)
  const offset = isNaN(eventDate.getTime())
    ? getUtcOffsetForDate(new Date())
    : getUtcOffsetForDate(eventDate)
  return `${stripped}${offset}`
}

export async function parseTextToEvent(text: string): Promise<CalendarEvent> {
  const apiKey = await getApiKey()

  const now = new Date().toLocaleString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateStyle: "full",
    timeStyle: "short"
  })

  const prompt = `Extract event details from the text. Today is ${now}.
Return JSON: {"title":"","description":"","startTime":"YYYY-MM-DDTHH:MM:SS","endTime":"YYYY-MM-DDTHH:MM:SS","location":""}
IMPORTANT: Do NOT include timezone offsets or "Z" in the times. Return bare local datetimes only.
Default to 1hr duration if no end time. Default 9AM if no time given. Resolve relative dates.
Text:
${text}`

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
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

  // Attach local timezone offset deterministically — never trust the LLM for this
  parsed.startTime = toLocalIso(parsed.startTime)
  parsed.endTime = toLocalIso(parsed.endTime)

  return parsed
}

import { parseTextToEvent } from "~lib/gemini"
import type { CalendarEvent } from "~types/events"
import type { Message } from "~types/messages"

// Safe wrapper — silently ignores "receiving end does not exist" errors
// which happen when the content script hasn't loaded on the tab yet
function sendToTab(tabId: number, message: Message) {
  chrome.tabs.sendMessage(tabId, message).catch(() => {
    // Content script not ready on this tab — nothing we can do
  })
}

// Register context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "schedio-create-event",
    title: "Create Event with Schedio",
    contexts: ["selection"]
  })
})

// Shared handler for parsing selected text and showing the modal
async function handleSelectedText(text: string, tabId: number) {
  sendToTab(tabId, { type: "SHOW_LOADING" })
  try {
    const event = await parseTextToEvent(text)
    sendToTab(tabId, { type: "SHOW_MODAL", event })
  } catch (error) {
    sendToTab(tabId, {
      type: "SHOW_ERROR",
      error: error instanceof Error ? error.message : "Failed to parse event"
    })
  }
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "schedio-create-event" || !info.selectionText || !tab?.id) {
    return
  }
  handleSelectedText(info.selectionText, tab.id)
})

// Listen for keyboard shortcut (Cmd+Shift+S / Ctrl+Shift+S)
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "create-event") return

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) return

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection()?.toString() || ""
  })

  const selectedText = results?.[0]?.result
  if (!selectedText) {
    sendToTab(tab.id, { type: "SHOW_ERROR", error: "No text selected" })
    return
  }

  handleSelectedText(selectedText, tab.id)
})

// Listen for messages from the content script (e.g. CONFIRM_EVENT)
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === "CONFIRM_EVENT") {
    createCalendarEvent(message.event)
      .then((result) => sendResponse({ success: true, event: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }))
    return true // keeps the message channel open for async sendResponse
  }
})

// Google Calendar API integration
async function createCalendarEvent(event: CalendarEvent) {
  const token = await new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(token!)
    })
  })

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: event.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Calendar API error: ${response.status}`)
  }

  return response.json()
}

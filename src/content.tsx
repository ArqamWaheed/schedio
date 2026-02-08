import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { EventModal } from "~components/event-modal"
import type { CalendarEvent } from "~types/events"
import type { Message } from "~types/messages"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Check if the extension context is still valid.
// When the extension reloads, old content scripts lose their connection
// and chrome.runtime.id becomes undefined — any API call would throw.
function isContextValid(): boolean {
  return typeof chrome !== "undefined" && !!chrome.runtime?.id
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
}

type OverlayState =
  | { status: "idle" }
  | { status: "parsing" }
  | { status: "modal"; event: CalendarEvent }
  | { status: "loading"; event: CalendarEvent }
  | { status: "success" }
  | { status: "error"; error: string }

const PlasmoOverlay = () => {
  const [state, setState] = useState<OverlayState>({ status: "idle" })

  useEffect(() => {
    if (!isContextValid()) return

    const listener = (message: Message) => {
      if (message.type === "SHOW_LOADING") {
        setState({ status: "parsing" })
      } else if (message.type === "SHOW_MODAL") {
        setState({ status: "modal", event: message.event })
      } else if (message.type === "SHOW_ERROR") {
        setState({ status: "error", error: message.error })
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => {
      if (isContextValid()) {
        chrome.runtime.onMessage.removeListener(listener)
      }
    }
  }, [])

  // Auto-dismiss success/error after 3 seconds
  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      const timer = setTimeout(() => setState({ status: "idle" }), state.status === "error" ? 8000 : 3000)
      return () => clearTimeout(timer)
    }
  }, [state.status])

  const handleConfirm = (event: CalendarEvent) => {
    if (!isContextValid()) {
      setState({ status: "idle" })
      return
    }
    setState({ status: "loading", event })
    chrome.runtime.sendMessage(
      { type: "CONFIRM_EVENT", event } satisfies Message,
      (response) => {
        if (chrome.runtime.lastError) {
          setState({ status: "idle" })
          return
        }
        if (response?.success) {
          setState({ status: "success" })
        } else {
          setState({ status: "error", error: response?.error || "Failed to create event" })
        }
      }
    )
  }

  const handleDismiss = () => {
    setState({ status: "idle" })
    if (isContextValid()) {
      chrome.runtime.sendMessage({ type: "DISMISS_MODAL" } satisfies Message)
    }
  }

  // If context is invalidated, silently go idle — don't bother the user
  if (!isContextValid()) return null

  if (state.status === "idle") return null

  return (
    <div className="fixed top-4 right-4 z-[2147483647] font-sans">
      {state.status === "parsing" && (
        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Parsing event details...
        </div>
      )}

      {(state.status === "modal" || state.status === "loading") && (
        <EventModal
          event={state.event}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
          isLoading={state.status === "loading"}
        />
      )}

      {state.status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
          ✅ Event created successfully!
        </div>
      )}

      {state.status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 max-w-sm">
          ❌ {state.error}
        </div>
      )}
    </div>
  )
}

export default PlasmoOverlay

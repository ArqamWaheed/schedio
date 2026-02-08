import type { CalendarEvent } from "./events"

// Background → Content: show loading spinner while Gemini parses
export interface ShowLoadingMessage {
  type: "SHOW_LOADING"
}

// Background → Content: show the modal with parsed event data
export interface ShowModalMessage {
  type: "SHOW_MODAL"
  event: CalendarEvent
}

// Background → Content: show an error in the modal
export interface ShowErrorMessage {
  type: "SHOW_ERROR"
  error: string
}

// Content → Background: user confirmed the event
export interface ConfirmEventMessage {
  type: "CONFIRM_EVENT"
  event: CalendarEvent
}

// Content → Background: user dismissed the modal
export interface DismissModalMessage {
  type: "DISMISS_MODAL"
}

export type Message =
  | ShowLoadingMessage
  | ShowModalMessage
  | ShowErrorMessage
  | ConfirmEventMessage
  | DismissModalMessage

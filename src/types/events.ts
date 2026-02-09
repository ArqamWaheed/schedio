export interface CalendarEvent {
  title: string
  description: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
  location: string
  timeZone?: string // IANA timezone (e.g. "Asia/Karachi")
}

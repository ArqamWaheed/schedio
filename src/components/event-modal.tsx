import { Calendar, CalendarDays, Clock, MapPin, Settings, X } from "lucide-react"
import { useEffect, useState } from "react"

import type { CalendarEvent } from "~types/events"

import { CalendarPicker } from "./calendar-picker"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

interface EventModalProps {
  event: CalendarEvent
  onConfirm: (event: CalendarEvent) => void
  onDismiss: () => void
  isLoading?: boolean
}

// Format Date to "MM/DD/YYYY" for display
function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`
  } catch { return "" }
}

// Format Date to "HH:MM AM/PM" for display
function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    let h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, "0")
    const ampm = h >= 12 ? "PM" : "AM"
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
  } catch { return "" }
}

// Build ISO string with timezone offset from a Date
function toISOWithOffset(d: Date): string {
  const offset = -d.getTimezoneOffset()
  const sign = offset >= 0 ? "+" : "-"
  const absOff = Math.abs(offset)
  const offH = String(Math.floor(absOff / 60)).padStart(2, "0")
  const offM = String(absOff % 60).padStart(2, "0")
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offH}:${offM}`
}

// Parse "MM/DD/YYYY" + "H:MM AM/PM" back into an ISO string
function parseDateTime(dateStr: string, timeStr: string, fallbackIso: string): string {
  try {
    const [mm, dd, yyyy] = dateStr.split("/").map(Number)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!timeMatch || !mm || !dd || !yyyy) return fallbackIso

    let h = parseInt(timeMatch[1])
    const m = parseInt(timeMatch[2])
    const ap = timeMatch[3].toUpperCase()
    if (ap === "PM" && h !== 12) h += 12
    if (ap === "AM" && h === 12) h = 0

    const d = new Date(yyyy, mm - 1, dd, h, m)
    return toISOWithOffset(d)
  } catch {
    return fallbackIso
  }
}

export function EventModal({ event, onConfirm, onDismiss, isLoading }: EventModalProps) {
  const [edited, setEdited] = useState<CalendarEvent>(event)
  const [hasAccount, setHasAccount] = useState(false)

  // Text input states for free typing
  const [startDate, setStartDate] = useState(() => formatDate(event.startTime))
  const [startTime, setStartTime] = useState(() => formatTime(event.startTime))
  const [endDate, setEndDate] = useState(() => formatDate(event.endTime))
  const [endTime, setEndTime] = useState(() => formatTime(event.endTime))

  // Calendar picker visibility
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  useEffect(() => {
    try {
      chrome.runtime.sendMessage({ type: "CHECK_AUTH" }, (response) => {
        if (chrome.runtime.lastError) return
        if (response?.hasAccount) setHasAccount(true)
      })
    } catch { /* context invalidated */ }
  }, [])

  const updateField = (field: keyof CalendarEvent, value: string) => {
    setEdited((prev) => ({ ...prev, [field]: value }))
  }

  // Sync text inputs → edited state on blur
  const syncStart = () => {
    const iso = parseDateTime(startDate, startTime, edited.startTime)
    setEdited((prev) => ({ ...prev, startTime: iso }))
  }
  const syncEnd = () => {
    const iso = parseDateTime(endDate, endTime, edited.endTime)
    setEdited((prev) => ({ ...prev, endTime: iso }))
  }

  // Handle calendar picker selection
  const handleStartPick = (d: Date) => {
    const iso = toISOWithOffset(d)
    setEdited((prev) => ({ ...prev, startTime: iso }))
    setStartDate(formatDate(iso))
    setStartTime(formatTime(iso))
  }
  const handleEndPick = (d: Date) => {
    const iso = toISOWithOffset(d)
    setEdited((prev) => ({ ...prev, endTime: iso }))
    setEndDate(formatDate(iso))
    setEndTime(formatTime(iso))
  }

  // Build final event with synced times before confirm
  const handleConfirm = () => {
    const finalEvent = {
      ...edited,
      startTime: parseDateTime(startDate, startTime, edited.startTime),
      endTime: parseDateTime(endDate, endTime, edited.endTime)
    }
    onConfirm(finalEvent)
  }

  return (
    <Card className="w-[420px] animate-in fade-in slide-in-from-top-2 duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            New Event
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Title</label>
          <Input
            value={edited.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Event title"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start date/time */}
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Start
            </label>
            <Input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={syncStart}
              placeholder="MM/DD/YYYY"
              className="text-xs"
            />
            <div className="flex gap-1 mt-1">
              <Input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onBlur={syncStart}
                placeholder="12:00 PM"
                className="text-xs flex-1"
              />
              <button
                type="button"
                onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false) }}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors px-2"
                title="Pick date & time">
                <CalendarDays className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>
            {showStartPicker && (
              <div className="absolute top-full left-0 z-50 mt-1">
                <CalendarPicker
                  value={new Date(edited.startTime)}
                  onChange={handleStartPick}
                  onClose={() => setShowStartPicker(false)}
                />
              </div>
            )}
          </div>

          {/* End date/time */}
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> End
            </label>
            <Input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={syncEnd}
              placeholder="MM/DD/YYYY"
              className="text-xs"
            />
            <div className="flex gap-1 mt-1">
              <Input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onBlur={syncEnd}
                placeholder="12:00 PM"
                className="text-xs flex-1"
              />
              <button
                type="button"
                onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false) }}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors px-2"
                title="Pick date & time">
                <CalendarDays className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>
            {showEndPicker && (
              <div className="absolute top-full right-0 z-50 mt-1">
                <CalendarPicker
                  value={new Date(edited.endTime)}
                  onChange={handleEndPick}
                  onClose={() => setShowEndPicker(false)}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Location
          </label>
          <Input
            value={edited.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Add location"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <textarea
            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 min-h-[60px] resize-none"
            value={edited.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Event description"
          />
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3 pb-4">
        <div className="flex gap-2 justify-center w-full">
          <Button variant="outline" onClick={onDismiss} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </div>
        {hasAccount && (
          <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="text-[11px] text-gray-500">
              <strong className="text-gray-600">Wrong account?</strong>{" "}
              Switch Google Account in{" "}
              <strong className="text-gray-600">Settings</strong>
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

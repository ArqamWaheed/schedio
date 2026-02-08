import { Calendar, Clock, MapPin, X } from "lucide-react"
import { useState } from "react"

import type { CalendarEvent } from "~types/events"

import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

interface EventModalProps {
  event: CalendarEvent
  onConfirm: (event: CalendarEvent) => void
  onDismiss: () => void
  isLoading?: boolean
}

function formatDateTimeLocal(iso: string): string {
  try {
    const d = new Date(iso)
    // Format as local time for datetime-local input (YYYY-MM-DDTHH:MM)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ""
  }
}

function fromDateTimeLocal(value: string): string {
  try {
    // datetime-local gives us "YYYY-MM-DDTHH:MM" in local time
    // Create a Date from it (interpreted as local) and return ISO with offset
    const d = new Date(value)
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
  } catch {
    return value
  }
}

export function EventModal({ event, onConfirm, onDismiss, isLoading }: EventModalProps) {
  const [edited, setEdited] = useState<CalendarEvent>(event)

  const update = (field: keyof CalendarEvent, value: string) => {
    setEdited((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-[380px] animate-in fade-in slide-in-from-top-2 duration-200">
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
            onChange={(e) => update("title", e.target.value)}
            placeholder="Event title"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Start
            </label>
            <Input
              type="datetime-local"
              value={formatDateTimeLocal(edited.startTime)}
              onChange={(e) => update("startTime", fromDateTimeLocal(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> End
            </label>
            <Input
              type="datetime-local"
              value={formatDateTimeLocal(edited.endTime)}
              onChange={(e) => update("endTime", fromDateTimeLocal(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Location
          </label>
          <Input
            value={edited.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Add location"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <textarea
            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 min-h-[60px] resize-none"
            value={edited.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Event description"
          />
        </div>
      </CardContent>

      <CardFooter className="gap-2 justify-end">
        <Button variant="outline" onClick={onDismiss} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(edited)} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </CardFooter>
    </Card>
  )
}

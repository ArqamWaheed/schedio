import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

interface CalendarPickerProps {
  value: Date
  onChange: (date: Date) => void
  onClose: () => void
}

export function CalendarPicker({ value, onChange, onClose }: CalendarPickerProps) {
  const [viewYear, setViewYear] = useState(value.getFullYear())
  const [viewMonth, setViewMonth] = useState(value.getMonth())

  // Time state
  const [hour, setHour] = useState(() => {
    const h = value.getHours()
    return h === 0 ? 12 : h > 12 ? h - 12 : h
  })
  const [minute, setMinute] = useState(value.getMinutes())
  const [ampm, setAmpm] = useState<"AM" | "PM">(value.getHours() >= 12 ? "PM" : "AM")

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const selectedDay = value.getDate()
  const isSelectedMonth = value.getFullYear() === viewYear && value.getMonth() === viewMonth

  const selectDay = (day: number) => {
    let h24 = hour % 12
    if (ampm === "PM") h24 += 12
    const d = new Date(viewYear, viewMonth, day, h24, minute)
    onChange(d)
  }

  const applyTime = () => {
    let h24 = hour % 12
    if (ampm === "PM") h24 += 12
    const d = new Date(value.getFullYear(), value.getMonth(), value.getDate(), h24, minute)
    onChange(d)
    onClose()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-[260px] animate-in fade-in zoom-in-95 duration-150">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isSelected = isSelectedMonth && day === selectedDay
          const isToday =
            day === new Date().getDate() &&
            viewMonth === new Date().getMonth() &&
            viewYear === new Date().getFullYear()
          return (
            <button
              key={day}
              type="button"
              onClick={() => selectDay(day)}
              className={`text-xs py-1.5 rounded transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white font-medium"
                  : isToday
                    ? "bg-blue-50 text-blue-600 font-medium hover:bg-blue-100"
                    : "hover:bg-gray-100 text-gray-700"
              }`}>
              {day}
            </button>
          )
        })}
      </div>

      {/* Time picker */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 justify-center">
          <input
            type="text"
            value={String(hour)}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1 && v <= 12) setHour(v)
              if (e.target.value === "") setHour(12)
            }}
            className="w-10 text-center text-sm border border-gray-200 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-500">:</span>
          <input
            type="text"
            value={String(minute).padStart(2, "0")}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "")
              const v = parseInt(raw)
              if (!isNaN(v) && v >= 0 && v <= 59) setMinute(v)
              if (raw === "") setMinute(0)
            }}
            className="w-10 text-center text-sm border border-gray-200 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}
            className="text-xs font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors min-w-[40px]">
            {ampm}
          </button>
        </div>
      </div>

      {/* Apply button */}
      <button
        type="button"
        onClick={applyTime}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors">
        Apply
      </button>
    </div>
  )
}

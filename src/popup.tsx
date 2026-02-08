import { Calendar } from "lucide-react"

import "~style.css"

function IndexPopup() {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-64 gap-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h1 className="text-base font-semibold">Schedio</h1>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Highlight text on any page, right-click, and select "Create Event with Schedio"
      </p>
    </div>
  )
}

export default IndexPopup

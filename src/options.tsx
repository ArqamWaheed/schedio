import { KeyRound, ExternalLink, CheckCircle, UserCog } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~components/ui/card"
import { Input } from "~components/ui/input"

import "~style.css"

function OptionsPage() {
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get("geminiApiKey", (result) => {
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey)
      }
      setLoading(false)
    })
  }, [])

  const handleSave = () => {
    const trimmed = apiKey.trim()
    if (trimmed) {
      chrome.storage.local.set({ geminiApiKey: trimmed })
    } else {
      chrome.storage.local.remove("geminiApiKey")
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = () => {
    setApiKey("")
    chrome.storage.local.remove("geminiApiKey")
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Schedio Settings</h1>
          <p className="text-sm text-gray-500">
            Configure your Gemini API key for unlimited usage
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              Gemini API Key
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-2">
              <p className="font-medium">Why add your own key?</p>
              <p>
                Schedio uses a shared API key by default, which is rate-limited
                across all users. If you're seeing rate limit errors, adding your
                own free key gives you a personal quota.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p className="font-medium">How to get a free API key:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Go to{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1">
                    Google AI Studio <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Copy the key and paste it below</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">
                The free tier includes 1,500 requests/day — more than enough for
                personal use. Your key is stored locally and never sent anywhere
                except Google's Gemini API.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                API Key {apiKey ? "(custom key set)" : "(using shared key)"}
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
            </div>
          </CardContent>

          <CardFooter className="gap-2 justify-between">
            <Button variant="outline" onClick={handleClear} disabled={!apiKey}>
              Reset to Shared Key
            </Button>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Saved
                </span>
              )}
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCog className="h-5 w-5 text-blue-600" />
              Google Account
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              <p>
                Schedio uses your Google account to create calendar events. If
                you want to switch to a different Google account, click the
                button below. You'll be prompted to sign in again next time you
                create an event.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                chrome.identity.getAuthToken({ interactive: false }, (token) => {
                  if (token) {
                    // Revoke the token from Google's servers
                    fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
                    // Remove it from Chrome's cache
                    chrome.identity.removeCachedAuthToken({ token })
                  }
                  chrome.identity.clearAllCachedAuthTokens(() => {
                    alert("Signed out. You'll be prompted to choose an account next time you create an event.")
                  })
                })
              }}>
              Switch Google Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default OptionsPage

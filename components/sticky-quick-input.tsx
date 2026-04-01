// components/sticky-quick-input.tsx
"use client"

import { useInsightToast } from "@/hooks/use-insight-toast"
import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Loader2 } from "lucide-react"

const QUICK_BUTTONS = [
  { label: "☕ Kopi", text: "kopi " },
  { label: "🍱 Makan", text: "makan " },
  { label: "⛽ Bensin", text: "bensin " },
  { label: "🛒 Belanja", text: "belanja " },
]

const PLACEHOLDERS = [
  'cth: "makan 20k"',
  'cth: "gaji 2jt"',
  'cth: "bensin 50rb"',
  'cth: "kopi 18 ribu"',
]

export function StickyQuickInput({
  walletId,
  onSuccess,
}: {
  walletId?: string
  onSuccess?: () => void
}) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0])
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { showInsight } = useInsightToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const idx = PLACEHOLDERS.indexOf(prev)
        return PLACEHOLDERS[(idx + 1) % PLACEHOLDERS.length]
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg"

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        // Stop semua track mikrofon
        stream.getTracks().forEach((t) => t.stop())

        const blob = new Blob(chunksRef.current, { type: mimeType })
        await transcribeAudio(blob, mimeType)
      }

      recorder.start()
      setIsListening(true)
    } catch (err) {
      setFeedback("❌ Izin mikrofon ditolak")
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
  }

  const toggleVoice = () => {
    if (isListening) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const transcribeAudio = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true)
    try {
      const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm"
      const form = new FormData()
      form.append("audio", blob, `audio.${ext}`)

      const res = await fetch("/api/voice", {
        method: "POST",
        body: form,
      })

      const data = await res.json()

      if (data.transcript) {
        setValue(data.transcript)
        inputRef.current?.focus()
      } else {
        setFeedback("❌ Gagal transkripsi, coba lagi")
        setTimeout(() => setFeedback(null), 3000)
      }
    } catch {
      setFeedback("❌ Gagal konek ke AI")
      setTimeout(() => setFeedback(null), 3000)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleSubmitValue = async (rawValue: string) => {
    if (!rawValue.trim() || loading) return
    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/ai/quick-input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: rawValue.trim(), wallet_id: walletId ?? null }),
      })
      const data = await res.json()

      if (data.status === "success") {
        setFeedback(data.feedback)
        setValue("")
        onSuccess?.()
        showInsight({
          amount: data.parsed.amount,
          type: data.parsed.type,
          category: data.parsed.category,
          note: data.parsed.note,
        })
        setTimeout(() => setFeedback(null), 3000)
      } else {
        setFeedback(`❌ ${data.message}`)
        setTimeout(() => setFeedback(null), 3000)
      }
    } catch {
      setFeedback("❌ Gagal konek, coba lagi")
      setTimeout(() => setFeedback(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => handleSubmitValue(value)

  const micBusy = isListening || isTranscribing

  return (
    <div id="tutorial-quick-input" className="fixed bottom-20 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-3">
      {/* Feedback toast */}
      {feedback && (
        <div className="mb-2 px-4 py-2 rounded-xl bg-card shadow-soft text-sm animate-fade-in border border-border">
          {feedback}
        </div>
      )}

      {/* Status indicator */}
      {isListening && (
        <div className="mb-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-sm animate-fade-in flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-accent font-medium text-xs">Merekam... tap mic untuk stop</span>
        </div>
      )}

      {isTranscribing && (
        <div className="mb-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-sm animate-fade-in flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
          <span className="text-accent font-medium text-xs">AI sedang transkripsi...</span>
        </div>
      )}

      {/* Quick buttons */}
      <div className="flex gap-1.5 mb-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {QUICK_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              setValue(btn.text)
              inputRef.current?.focus()
            }}
            className="whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-card border border-border shadow-soft flex-shrink-0 active:scale-95 transition-transform"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className={`flex items-center gap-2 bg-card border rounded-2xl px-4 py-3 shadow-soft-lg transition-colors ${
        isListening ? "border-accent/50" : "border-border"
      }`}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={isListening ? "Merekam..." : isTranscribing ? "Memproses..." : placeholder}
          disabled={loading}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
        />

        {/* Mic button */}
        <button
          onClick={toggleVoice}
          disabled={loading || isTranscribing}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : isTranscribing
              ? "bg-muted text-muted-foreground opacity-50"
              : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
          }`}
        >
          {isListening ? (
            <MicOff className="w-3.5 h-3.5" />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim() || micBusy}
          className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform flex-shrink-0"
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5 text-accent-foreground" />
          )}
        </button>
      </div>
    </div>
  )
}
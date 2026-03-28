// components/sticky-quick-input.tsx
"use client"

import { useInsightToast } from "@/hooks/use-insight-toast"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

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
  const inputRef = useRef<HTMLInputElement>(null)
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

  const handleSubmit = async () => {
    if (!value.trim() || loading) return
    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/ai/quick-input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: value.trim(), wallet_id: walletId ?? null }),
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

  return (
    // bottom-16 = tepat di atas bottom nav (h-16)
    <div className="fixed bottom-16 left-0 right-0 z-50 max-w-md mx-auto px-4 pb-3">
      {/* Feedback toast */}
      {feedback && (
        <div className="mb-2 px-4 py-2 rounded-xl bg-card shadow-soft text-sm animate-fade-in border border-border">
          {feedback}
        </div>
      )}

      {/* Quick buttons row */}
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
      <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 shadow-soft-lg">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
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

// components/quick-input.tsx
"use client"

import { useInsightToast } from "@/hooks/use-insight-toast"
import { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

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

export function QuickInput({ walletId, onSuccess }: { walletId?: string, onSuccess?: () => void }) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const { showInsight } = useInsightToast()

  // Auto focus + rotate placeholder
  useEffect(() => {
    inputRef.current?.focus()
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const idx = PLACEHOLDERS.indexOf(prev)
        return PLACEHOLDERS[(idx + 1) % PLACEHOLDERS.length]
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    if (!value.trim() || loading) return

    setLoading(true)
    setFeedback(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const res = await fetch(`/api/ai/quick-input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw: value.trim(),
          wallet_id: walletId ?? null,
        }),
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
      }
    } catch {
      setFeedback("❌ Gagal konek, coba lagi")
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="space-y-3">
      {/* Quick buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {QUICK_BUTTONS.map(btn => (
          <button
            key={btn.label}
            onClick={() => {
              setValue(btn.text)
              inputRef.current?.focus()
            }}
            className="whitespace-nowrap px-3 py-1.5 text-xs rounded-full bg-secondary"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          disabled={loading}
          className="w-full px-4 py-3 pr-16 rounded-xl bg-secondary text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
        >
          {loading ? "..." : "Catat"}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <p className="text-sm px-1 animate-fade-in">{feedback}</p>
      )}
    </div>
  )
}
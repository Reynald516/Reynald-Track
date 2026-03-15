// components/views/insights-view.tsx

"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertCircle, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { getUserTransactions } from "@/lib/transactions.supabase"
type Insight = {
  id: string
  type: "pattern" | "warning"
  title: string
  description: string
}

interface InsightsViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function InsightsView({ isDarkMode, onToggleTheme }: InsightsViewProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  const [transactions, setTransactions] = useState<any[]>([])

  const [question, setQuestion] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const suggestedQuestions = [
    "Berapa total pengeluaranku minggu ini?",
    "Kategori mana yang paling boros?",
    "Tips hemat untuk bulan ini?",
  ]

  // ==============================
  // AUTO SCROLL CHAT (AMAN)
  // ==============================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, chatLoading])

  // ==============================
  // LOAD INSIGHTS DARI RTR ENGINE
  // ==============================
  // ✅ BARU - hit endpoint khusus insights
  useEffect(() => {
    async function loadAIInsights() {
      try {
        const res = await fetch("/api/ai/insights")
        const data = await res.json()
        if (data.ok && Array.isArray(data.insights)) {
          setInsights(data.insights)
        } else {
          setInsights([])
        }
      } catch (err) {
        console.error("Failed to load AI insights", err)
        setInsights([])
      }
    }
    loadAIInsights()
  }, [])

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    async function loadInsights() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setInsights([])
        setTransactions([])
        setLoading(false)
        return
      }

      const tx = await getUserTransactions(user.id)
      setTransactions(tx || [])
      setLoading(false)
    }

    loadInsights()
  }, [])

  // ==============================
  // SUBMIT CHAT (SATU-SATUNYA TEMPAT FETCH)
  // ==============================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (chatLoading) return

    const userMessage = question.trim()
    if (!userMessage) return

    // ===== GUARD DATA =====
    if (loading) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Tunggu sebentar ya, datamu masih dimuat ⏳",
        },
      ])
      return
    }

    if (!transactions || transactions.length === 0) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Aku belum melihat transaksi apa pun 😅",
        },
      ])
      return
    }
    // =====================

    setChatLoading(true)

    // ⬇️ TAMPILKAN PESAN USER SEKALI
    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage },
    ])

    // ⬇️ RESET INPUT AGAR TIDAK KE-SUBMIT ULANG
    setQuestion("")

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          transactions,
        }),
      })

      if (!res.ok) {
        throw new Error("API error")
      }

      const data = await res.json()

      if (data?.answer) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.answer },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "Maaf, aku belum bisa menjawab itu.",
          },
        ])
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Terjadi kesalahan. Coba lagi nanti.",
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AppHeader
        title="Insights"
        subtitle="AI financial advisor"
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      {loading && (
        <p className="text-xs text-muted-foreground px-1">
          Memuat insight...
        </p>
      )}

      <div className="px-5 space-y-6 pb-28">
        {/* AI INSIGHTS */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            AI Insights
          </h3>

          {insights.length > 0 ? (
            <div className="grid gap-3">
              {insights.map(insight => {
                const Icon =
                  insight.type === "pattern"
                    ? TrendingUp
                    : AlertCircle

                const color =
                  insight.type === "pattern"
                    ? "text-[var(--ai-accent)]"
                    : "text-[var(--warning)]"

                return (
                  <Card
                    key={insight.id}
                    className="border-0 shadow-soft-md bg-gradient-to-br from-[var(--ai-accent)]/[0.03] to-[var(--ai-accent)]/[0.06]"
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Belum ada insight. Catat transaksimu dulu.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* CHAT */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Chat dengan AI
          </h3>

          <Card>
            <CardContent className="p-5 space-y-4">
              {/* Suggested */}
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="px-3 py-2 text-xs rounded-lg bg-secondary"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground ml-auto"
                        : "bg-secondary"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-xs text-muted-foreground">
                    AI sedang mengetik...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="relative">
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  disabled={loading || chatLoading}
                  placeholder="Tanya tentang keuanganmu..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || chatLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
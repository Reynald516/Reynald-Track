"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertCircle, Send } from "lucide-react"

interface InsightsViewProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function InsightsView({ isDarkMode, onToggleTheme }: InsightsViewProps) {
  // Mock insights data
  const insights = [
    {
      id: 1,
      type: "pattern",
      title: "Pola Pengeluaran Terdeteksi",
      description: "Pengeluaran makanan cenderung naik di akhir pekan. Pertimbangkan meal prep untuk menghemat.",
      icon: TrendingUp,
      color: "text-[var(--ai-accent)]",
    },
    {
      id: 2,
      type: "warning",
      title: "Budget Transport Perlu Perhatian",
      description: "Kamu sudah menggunakan 78% budget transport bulan ini. Tersisa Rp 440.000.",
      icon: AlertCircle,
      color: "text-[var(--warning)]",
    },
  ]

  const suggestedQuestions = [
    "Berapa total pengeluaranku minggu ini?",
    "Kategori mana yang paling boros?",
    "Tips hemat untuk bulan ini?",
  ]

  return (
    <div className="space-y-6">
      <AppHeader
        title="Insights"
        subtitle="AI financial advisor"
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="px-5 space-y-6 pb-28">
        {/* AI Insights Feed */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">AI Insights</h3>
          {insights.length > 0 ? (
            <div className="grid gap-3">
              {insights.map((insight) => {
                const Icon = insight.icon
                return (
                  <Card
                    key={insight.id}
                    className="border-0 shadow-soft-md bg-gradient-to-br from-[var(--ai-accent)]/[0.03] to-[var(--ai-accent)]/[0.06] card-float"
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-[var(--ai-accent)]/15 flex items-center justify-center">
                            <Icon className={`w-5 h-5 ${insight.color}`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold tracking-tight mb-1">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-soft-md card-float">
              <CardContent className="p-8 text-center empty-elegant">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Belum ada insight. Catat transaksimu untuk mendapat analisis personal.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Chat with AI */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Chat dengan AI</h3>
          <Card className="border-0 shadow-soft-lg card-float">
            <CardContent className="p-5 space-y-4">
              {/* Suggested Questions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Pertanyaan Populer
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      className="px-3 py-2 text-xs font-medium rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-smooth button-scale"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tanya tentang keuanganmu..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary/50 border-0 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-smooth"
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-accent hover:bg-accent/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
